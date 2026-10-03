// Frozen public HARDHIT PBP coefficients, observed 2026-10-03 (670 games).
// This family-league model is not an official KBO statistic or talent projection.
const SABER = Object.freeze({
  version:'family-pf-v1', season:2026, observed:'2026-10-03', coverage:670,
  source:'https://hardhit.ai/engineroom/linear-weight',
  weights:Object.freeze({BB:.761,HBP:.791,'1B':.923,'2B':1.340,'3B':1.683,HR:1.982}),
  leagueWOBA:.34648, scale:1.150, runsPerPA:.129,
  priorPA:600, minimumGames:3, minimumPF:.8, maximumPF:1.2
});

function weightedBatting(lines) {
  const totals={PA:0,D:0,value:0};
  for(const s of lines) {
    const n=k=>Number(s[k]||0);
    const walks=n('BB')-n('IBB');
    totals.PA+=n('AB')+n('BB')+n('HBP')+n('SF')+n('SH');
    totals.D+=n('AB')+walks+n('HBP')+n('SF');
    totals.value+=SABER.weights.BB*walks+SABER.weights.HBP*n('HBP')+
      SABER.weights['1B']*(n('H')-n('2B')-n('3B')-n('HR'))+
      SABER.weights['2B']*n('2B')+SABER.weights['3B']*n('3B')+SABER.weights.HR*n('HR');
  }
  return {...totals,woba:totals.D?totals.value/totals.D:null};
}

function gamesThrough(all, cutoff) {
  return all.filter(g=>!cutoff||g.date<cutoff.date||(g.date===cutoff.date&&g.id<=cutoff.id));
}

// Paired within-player venue differences reduce bias from the 2/4-out PA mix.
// This cannot separate park effects from form, pitcher hand, weather or defense.
function estimateParks(sample) {
  const venues=[...new Set(sample.map(g=>g.venue).filter(Boolean))];
  const ids=[...new Set(sample.flatMap(g=>[g.away.player,g.home.player]))];
  const batting=(list,id)=>list.flatMap(g=>[g.away,g.home].filter(s=>s.player===id).map(s=>s.batting));
  return venues.map(venue=>{
    const inside=sample.filter(g=>g.venue===venue), outside=sample.filter(g=>g.venue&&g.venue!==venue);
    let exposure=0, difference=0;
    for(const id of ids) {
      const a=weightedBatting(batting(inside,id)), b=weightedBatting(batting(outside,id));
      if(!a.D||!b.D) continue;
      const paired=a.D*b.D/(a.D+b.D);
      exposure+=paired;
      difference+=paired*(a.woba-b.woba);
    }
    const delta=exposure?difference/exposure:0;
    const eligible=inside.length>=SABER.minimumGames&&outside.length>=SABER.minimumGames&&exposure>0;
    const weight=eligible?exposure/(exposure+SABER.priorPA):0;
    const raw=exposure?1+delta/(SABER.scale*SABER.runsPerPA):null;
    const estimate=1+weight*delta/(SABER.scale*SABER.runsPerPA);
    const factor=Math.max(SABER.minimumPF,Math.min(SABER.maximumPF,estimate));
    const totals=weightedBatting(inside.flatMap(g=>[g.away.batting,g.home.batting]));
    return {venue,G:inside.length,otherG:outside.length,PA:totals.PA,exposure,raw,weight,factor,eligible,capped:factor!==estimate};
  });
}

function virtualOffense(woba, factor=1) {
  if(woba==null) return null;
  // Additive park adjustment, using KBO R/PA as the reference denominator.
  const runsAboveAverage=(woba-SABER.leagueWOBA)/SABER.scale+SABER.runsPerPA*(1-factor);
  return {wrc:100*(1+runsAboveAverage/SABER.runsPerPA),runs600:600*runsAboveAverage};
}

function advancedBatting(id, selected, modelGames=games) {
  const parks=estimateParks(modelGames);
  const entries=selected.flatMap(g=>[g.away,g.home].filter(s=>s.player===id).map(s=>({g,batting:s.batting})));
  const totals=weightedBatting(entries.map(e=>e.batting));
  if(!totals.PA||totals.woba==null) return {wOBA:'—','wRC+':'—',nWRC:'—',PF:'—',Bat600:'—'};
  const factor=entries.reduce((sum,e)=>sum+weightedBatting([e.batting]).PA*(parks.find(p=>p.venue===e.g.venue)?.factor??1),0)/totals.PA;
  const adjusted=virtualOffense(totals.woba,factor), neutral=virtualOffense(totals.woba);
  return {wOBA:totals.woba.toFixed(3),'wRC+':Math.round(adjusted.wrc),nWRC:Math.round(neutral.wrc),PF:(100*factor).toFixed(1),Bat600:adjusted.runs600.toFixed(1)};
}

function saberNote() {
  return '<p class="saber-notice">실험 지표 · KBO 기준 가상 wRC+입니다. 100은 기준 평균이며, 실제 KBO에서의 실력을 예측하지 않습니다. <a href="#parks">파크팩터 · 계산 기준 보기 →</a></p>';
}

function renderParks() {
  const parks=estimateParks(games);
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  const cards=Object.values(players).map(p=>{
    const s=advancedBatting(p.id,games);
    return `<section class="log-summary ${p.color}"><div><span class="player-key ${p.color}">${p.name}</span><span>KBO 기준 가상 지표</span></div><dl><div><dt>가상 wRC+</dt><dd>${s['wRC+']}</dd></div><div><dt>보정 전</dt><dd>${s.nWRC}</dd></div><div><dt>적용 PF</dt><dd>${s.PF}</dd></div><div><dt>wOBA</dt><dd>${s.wOBA}</dd></div></dl><p>600타석당 평균 대비 타격 득점 ${s.Bat600}점 · <a href="#trends?player=${p.id}&view=expanded&metric=wRC%2B&basis=cumulative">변화 보기 ↗</a></p></section>`;
  }).join('');
  app.innerHTML=`<section class="container stats-page"><header class="stats-page-heading"><div><p class="eyebrow">FAMILY LEAGUE / EXPERIMENTAL</p><h1>파크팩터 · 가상 wRC+</h1><p class="subhead">경기장이 쌓이면, 보정도 함께 자랍니다.</p></div><span class="season-stamp">${SABER.season}<span>KBO 기준</span></span></header>
    ${saberNote()}<div class="trend-summaries">${cards}</div>
    <section class="panel"><div class="section-heading"><h2>경기장별 파크팩터</h2><span>${games.length}경기 · ${parks.length}개 구장</span></div><p class="table-hint">PF 100 = 중립 · 100 초과 = 타격에 유리한 방향의 추정. 새 경기와 경기장이 등록되면 자동 재계산합니다.</p>
    <div class="record-table-wrap" tabindex="0" aria-label="경기장별 파크팩터"><table class="record-table park-table"><thead><tr><th scope="col">경기장</th><th scope="col">경기</th><th scope="col">타석</th><th scope="col">다른 구장 경기</th><th scope="col">관측 반영률</th><th scope="col">적용 PF</th><th scope="col">상태</th></tr></thead><tbody>${parks.map(p=>`<tr><th scope="row">${esc(p.venue)}</th><td>${p.G}</td><td>${p.PA}</td><td>${p.otherG}</td><td>${(p.weight*100).toFixed(1)}%</td><td class="sorted-stat">${(p.factor*100).toFixed(1)}</td><td>${p.eligible?'잠정 추정'+(p.capped?' · 안전 범위 적용':''):'표본 대기 · 중립'}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="panel saber-method"><h2>작은 표본을 다루는 방법</h2><p>각 선수의 해당 구장 wOBA와 다른 구장 wOBA 차이를 먼저 계산합니다. 이를 양쪽 타석 수로 가중하므로 영훈의 2아웃 공격과 윤재의 4아웃 공격으로 생기는 타석 구성 차이를 줄입니다. 실제 득점이나 경기당 득점으로 구장을 비교하지 않습니다.</p><p>해당 구장과 다른 구장에 각각 ${SABER.minimumGames}경기 이상이 있어야 보정을 시작합니다. 유효 표본 N = 선수별 D구장 × D다른구장 ÷ (D구장 + D다른구장)의 합. 관측 반영률은 N ÷ (N + ${SABER.priorPA})이며, 나머지는 중립값으로 돌립니다. 600은 검증된 통계 상수가 아닌 보수적인 운영 가정입니다.</p><p>Δ = 위 유효 표본으로 가중한 선수별 wOBA 차이. PF = 100 × [1 + 반영률 × Δ ÷ (스케일 × KBO R/PA)]. 극단적인 소표본 보정을 막기 위해 80–120 범위로 제한합니다. 미등록 구장은 중립이며 파크팩터 학습에서는 제외합니다. 개인 적용 PF는 출전 구장의 PF를 개인 타석 수로 가중합니다.</p><p>이 값은 <strong>가족 구장 간 타격 결과로 만든 실험용 대용치</strong>이지, KBO 구장과 직접 비교한 공식 득점 파크팩터가 아닙니다. 날짜·컨디션·투구 손·수비·성장 효과를 구장 효과와 분리할 수 없으며, 타석 기준 비교도 특별 규칙의 차이를 완전히 없애지는 못합니다. 표본이 늘어도 이 한계는 남습니다.</p></section>
    <details class="panel stat-guide"><summary>KBO 비교 기준 · 공식 · 출처</summary><div class="rules"><p>${SABER.version} · <a href="${SABER.source}" target="_blank" rel="noopener">HARDHIT 공개 PBP 계수</a>의 ${SABER.season} 시즌 표시값을 ${SABER.observed}에 고정했습니다(수집 ${SABER.coverage}경기). KBO 공식 발표 지표가 아닌 해당 제공자의 추정치이며, 표시 자릿수에 따른 반올림 오차가 있습니다. KBO 상수는 자동으로 바꾸지 않습니다.</p><p>가중치: 볼넷 .761 · 사구 .791 · 단타 .923 · 2루타 1.340 · 3루타 1.683 · 홈런 1.982. 리그 wOBA .34648 · 스케일 1.150 · R/PA .129.</p><p>wOBA = 가중 출루 합 ÷ D. D = AB + BB − IBB + HBP + SF. 희생번트는 분모에서 제외하고, 실책 출루는 가중 출루 점수를 주지 않습니다. 고의4구는 별도로 기록되지 않아 0으로 가정합니다.</p><p>가상 wRC+ = 100 × {1 + [(wOBA − 리그 wOBA) ÷ 스케일 + R/PA × (1 − PF/100)] ÷ R/PA}. <a href="https://library.fangraphs.com/offense/wrc/" target="_blank" rel="noopener">FanGraphs의 가산형 구장 보정 개념</a>을 사용하되, 분모를 KBO R/PA로 단순화했습니다. 600타석 타격 득점은 중괄호 안 평균 대비 득점률 × 600이며 WAR가 아닙니다.</p><p>선수 기록의 기간별 합계는 현재 전체 자료의 PF를 적용합니다. 기록 추이의 각 경기 행은 그 경기 종료 시점까지의 자료로만 PF를 다시 계산합니다. 이후 경기가 추가되어도 과거 행에 미래 자료를 사용하지 않습니다. 원기록 수정이나 모델 버전 변경 시에는 과거 값도 재계산됩니다.</p><p>수비·주루·포지션·대체선수 기준이 없어 WAR는 표시하지 않습니다. 가상 wRC+와 600타석 득점은 타격 결과의 재미용 비교이며, KBO 선수와 능력이 동등하다는 의미가 아닙니다.</p></div></details>
    <p><a class="text-link" href="#players?view=expanded&sort=wRC%2B">선수 상세 기록 →</a></p></section>`;
  setActive('parks');
}
