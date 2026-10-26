function outsToInnings(outs) { return `${Math.floor(outs / 3)}.${outs % 3}`; }
function battingRate(value) { return value.toFixed(3).replace(/^0\./, '.'); }

const battingColumns = ['AVG','OBP','SLG','OPS','PA','AB','R','H','2B','HR','RBI','BB','HBP','SO'];
const pitchingColumns = ['IP','ERA','WHIP','K9','BB9','H','R','ER','BB','HBP','SO','HR'];
const statLabels = { G:'경기 수', PA:'타석', AB:'타수', R:'득점 / 실점', H:'안타 / 피안타', '2B':'2루타', HR:'홈런 / 피홈런', RBI:'타점', BB:'볼넷', HBP:'몸에 맞는 공', SO:'삼진', AVG:'타율', OBP:'출루율', SLG:'장타율', OPS:'출루율 + 장타율', IP:'투구 이닝 (3아웃 환산)', ER:'자책점', ERA:'평균자책점 (방어율)', WHIP:'이닝당 안타·볼넷 허용', K9:'9이닝당 탈삼진', BB9:'9이닝당 볼넷' };
const statHeader = key => `<th scope="col" title="${statLabels[key] || key}">${key === 'K9' ? 'K/9' : key === 'BB9' ? 'BB/9' : key}</th>`;
const handNames = { R: '우완', L: '좌완' };
function summarizeBatting(lines) {
  const stats = { G:lines.length, PA:0, AB:0, R:0, H:0, '2B':0, '3B':0, HR:0, RBI:0, BB:0, HBP:0, SO:0, SF:0, SH:0 };
  for (const line of lines) for (const key of ['AB','R','H','2B','3B','HR','RBI','BB','HBP','SO','SF','SH']) stats[key] += line[key] || 0;
  stats.PA = stats.AB + stats.BB + stats.HBP + stats.SF + stats.SH;
  const obpDenominator = stats.PA - stats.SH;
  const totalBases = stats.H + stats['2B'] + 2 * stats['3B'] + 3 * stats.HR;
  const obp = obpDenominator ? (stats.H + stats.BB + stats.HBP) / obpDenominator : null;
  const slg = stats.AB ? totalBases / stats.AB : null;
  return { ...stats, AVG:stats.AB ? battingRate(stats.H / stats.AB) : '—', OBP:obp === null ? '—' : battingRate(obp), SLG:slg === null ? '—' : battingRate(slg), OPS:obp === null || slg === null ? '—' : battingRate(obp + slg) };
}
function summarizePitching(lines) {
  const stats = { H:0, R:0, ER:0, BB:0, HBP:0, SO:0, HR:0 };
  let outs = 0;
  for (const line of lines) {
    outs += inningsToOuts(line.IP);
    for (const key of Object.keys(stats)) stats[key] += line[key] || 0;
  }
  return { ...stats, IP:outsToInnings(outs), ERA:outs ? (stats.ER * 27 / outs).toFixed(2) : '—', WHIP:outs ? ((stats.H + stats.BB) * 3 / outs).toFixed(2) : '—', K9:outs ? (stats.SO * 27 / outs).toFixed(2) : '—', BB9:outs ? (stats.BB * 27 / outs).toFixed(2) : '—' };
}
function pitchingStints(side, opponent) {
  // 투구 손이 따로 기록되지 않은 기존 경기는 우완. 좌·우 전환 경기는 구간별 기록을 사용한다.
  return side.pitchingStints || [{ hand:'R', ...side.pitching, HBP:opponent.batting.HBP || 0 }];
}
function splitPitching(stints) {
  return ['R','L'].filter(hand => stints.some(s => s.hand === hand)).map(hand => ({ hand, ...summarizePitching(stints.filter(s => s.hand === hand)) }));
}

// 경기별 기록에서 통산 기록을 계산해 경기 추가와 이닝 보정이 모든 화면에 반영되도록 한다.
for (const p of Object.values(players)) {
  const battingLines = [], pitchingLines = [];
  const decisions = { G:0, W:0, L:0, T:0 };
  const handLines = { R: [], L: [] };
  const handGames = { R: 0, L: 0 };
  for (const game of games) {
    const side = game.away.player === p.id ? game.away : game.home;
    const opponent = side === game.away ? game.home : game.away;
    battingLines.push(side.batting);
    pitchingLines.push({ ...side.pitching, HBP:opponent.batting.HBP || 0 });
    decisions.G++;
    decisions[side.R > opponent.R ? 'W' : side.R < opponent.R ? 'L' : 'T']++;
    const stints = pitchingStints(side, opponent);
    for (const hand of ['R','L']) {
      const lines = stints.filter(s => s.hand === hand);
      handLines[hand].push(...lines);
      if (lines.length) handGames[hand]++;
    }
  }
  p.batting = summarizeBatting(battingLines);
  p.pitching = { ...decisions, ...summarizePitching(pitchingLines) };
  p.pitchingSplits = ['R','L'].filter(hand => handGames[hand]).map(hand => ({ hand, G:handGames[hand], ...summarizePitching(handLines[hand]) }));
}

const app = document.querySelector('#app');
let recordMode = 'batting';
let trendState = { player:'all', mode:'batting', basis:'cumulative', hand:'all', metric:'AVG' };
let leadersState = {};
let restoreTrendFocus = '';

const route = (name, id = '') => { location.hash = id ? `${name}/${id}` : name; };
const player = id => players[id];
const outcome = game => game.away.R === game.home.R ? '무승부' : `${player(game.away.R > game.home.R ? game.away.player : game.home.player).name} 승`;

// 휴대폰 화면(폭 600px 이하)은 같은 주소에서 표 대신 카드 구조로 따로 그린다.
const phoneQuery = window.matchMedia?.('(max-width: 600px)');
const isPhone = () => Boolean(phoneQuery?.matches);
const weekday = date => ['일','월','화','수','목','금','토'][new Date(`${date}T00:00:00`).getDay()];
function statGrid(stats, keys, highlight = '', cumulative = []) {
  return `<dl class="m-stat-grid">${keys.map(k=>`<div class="${k===highlight?'is-key':''} ${cumulative.includes(k)?'is-cum':''}"><dt title="${statLabels[k] || k}">${statName(k)}</dt><dd>${stats?.[k] ?? '—'}</dd></div>`).join('')}</dl>`;
}
function phoneCardHead(p, sub, extra = '', lead = '', href = '') {
  return `<header class="m-card-head">${lead}<span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><div>${href ? `<a href="${href}">${p.name}</a>` : `<strong>${p.name}</strong>`}<small>${sub}</small></div>${extra}</header>`;
}
function phoneGameCard(g) {
  const rows=['away','home'].map(key=>{
    const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player),record=recordAtGame(p.id,g);
    return `<div class="m-team ${resultClass(side,opponent)}"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><span class="m-team-name">${p.name}<small>${key==='away'?'초':'말'} 공격 · ${record.W}–${record.L}–${record.T}</small></span><strong>${side.R}</strong><span>${side.H}</span><span>${side.E}</span></div>`;
  }).join('');
  return `<li><a class="m-game-card" href="#game/${g.id}" data-score-game="${g.id}"><div class="m-game-meta"><time datetime="${g.date}">${g.date.slice(5).replace('-','.')} ${weekday(g.date)}</time><span>${g.venue || '미등록'}</span><span class="final-status">FINAL / ${g.innings}</span></div><div class="m-team m-team-labels" aria-hidden="true"><span></span><span>${g.no}</span><span>R</span><span>H</span><span>E</span></div>${rows}<div class="m-game-foot"><span>${outcome(g)}</span><span aria-hidden="true">박스스코어 ›</span></div></a></li>`;
}
function phoneLinescore(g) {
  const cols=Array.from({length:g.innings},(_,i)=>i+1);
  return `<table class="m-linescore" style="--innings:${g.innings}"><caption class="sr-only">${g.label} 이닝별 점수</caption><thead><tr><th scope="col"><span class="sr-only">선수</span></th>${cols.map(i=>`<th scope="col">${i}</th>`).join('')}${['R','H','E'].map(c=>`<th scope="col" class="m-total">${c}</th>`).join('')}</tr></thead><tbody>${['away','home'].map(key=>`<tr><th scope="row">${player(g[key].player).name}</th>${g[key].runs.map(r=>`<td class="${typeof r==='number'&&r?'scoring-inning':''}">${r}</td>`).join('')}${['R','H','E'].map(c=>`<td class="m-total ${c==='R'?'run-total':''}">${g[key][c]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function phoneBox(g, mode) {
  return ['away','home'].map(key=>{
    const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player);
    const cols=mode==='batting'?battingColumns:pitchingColumns;
    const stats=mode==='batting'?summarizeBatting([side.batting]):summarizePitching([{ ...side.pitching, HBP:opponent.batting.HBP || 0 }]);
    const splits=mode==='pitching'&&side.pitchingStints?splitPitching(side.pitchingStints).map(line=>`<div class="m-split"><h4>↳ ${handNames[line.hand]}</h4>${statGrid(line,cols)}</div>`).join(''):'';
    return `<article class="m-card">${phoneCardHead(p,`${key==='away'?'초':'말'} 공격${splits?' · 합계':''}`)}${statGrid(stats,cols)}${splits}</article>`;
  }).join('');
}
function renderPhoneGame(g, a, h) {
  const innings=[...new Set(g.plays.map(p=>p[0]))];
  return `<section class="m-page"><button class="m-back" data-route="schedule">‹ 경기 결과</button>
    <header class="m-heading"><p class="eyebrow">BOX SCORE · ${g.no}</p><h1>${formatDate(g.date)}</h1>${renderVenue(g)}</header>
    <section class="m-scoreboard" aria-label="${a.name} ${g.away.R} 대 ${h.name} ${g.home.R}, ${outcome(g)}">${['away','home'].map(key=>{
      const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player);
      return `<div class="m-contender ${resultClass(side,opponent)}"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><div><a href="#player/${p.id}">${p.name}</a><small>${key==='away'?'AWAY · 초 공격':'HOME · 말 공격'}</small></div><span class="result-tag ${resultClass(side,opponent)}">${resultLabel(side,opponent)}</span><strong>${side.R}</strong></div>`;
    }).join('')}<div class="m-final"><span class="final-status">FINAL / ${g.innings}</span></div>${phoneLinescore(g)}</section>
    <section class="m-section"><h2>타자 기록</h2>${phoneBox(g,'batting')}</section>
    <section class="m-section"><h2>투수 기록</h2>${phoneBox(g,'pitching')}<p class="m-note">ERA·WHIP은 이 경기의 3아웃 환산 이닝 기준입니다.</p></section>
    <section class="m-section" id="game-plays"><h2>플레이 기록</h2><div class="m-card m-innings">${innings.map(inning=>{
      const index=Number.parseInt(inning,10)-1;
      return `<details class="m-inning"><summary><strong>${inning}</strong><span>${a.name} ${g.away.runs[index] ?? '–'} · ${h.name} ${g.home.runs[index] ?? '–'}</span></summary>${g.plays.filter(p=>p[0]===inning).map(p=>`<div class="m-half"><h3>${p[1]===a.name?'초':'말'} · ${p[1]} 공격</h3><p>${p[2]}</p></div>`).join('')}</details>`;
    }).join('')}</div></section>
    <section class="m-section"><h2>경기 메모</h2><div class="m-card m-prose"><p>${g.note}</p><p class="m-note">가족 리그 특별 규칙: 윤재 공격은 이닝당 4아웃, 영훈 공격은 이닝당 2아웃으로 진행했습니다. 투수 IP는 전체 아웃카운트를 표준 3아웃제 이닝으로 환산했습니다.</p></div></section>
  </section>`;
}

function renderSchedule() {
  const orderedGames = games.slice().sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const yunjae = players.yunjae.pitching;
  if (isPhone()) {
    app.innerHTML = `<section class="m-page"><header class="m-heading"><p class="eyebrow">FAMILY LEAGUE / SCORES</p><h1>경기 결과</h1><p class="m-sub">전체 ${orderedGames.length}경기 · 최신 경기순</p></header>
      <div class="m-summary"><div><strong>${games.length}</strong><span>총 경기</span></div><div><strong>${yunjae.W}–${yunjae.L}–${yunjae.T}</strong><span>윤재 승–패–무</span></div><div><strong>${games.reduce((total, g) => total + g.away.R + g.home.R, 0)}</strong><span>두 선수 총 득점</span></div></div>
      ${orderedGames.length ? `<ol class="m-game-list">${orderedGames.map(phoneGameCard).join('')}</ol>` : '<div class="schedule-empty">아직 기록된 경기가 없습니다.</div>'}
      <p class="m-note">R 득점 · H 안타 · E 실책. 선수명 아래 승–패–무는 해당 경기 종료 시점의 누적 전적입니다. 카드를 누르면 박스스코어로 이동합니다.</p>
    </section>`;
    setActive('schedule');
    return;
  }
  app.innerHTML = `<section class="container stats-page scores-page">
    <header class="stats-page-heading"><div><p class="eyebrow">FAMILY LEAGUE / SCORES</p><h1>경기 결과</h1><p class="subhead">함께한 모든 경기, 한눈에 보는 스코어보드.</p></div><span class="season-stamp">2026<span>SEASON</span></span></header>
    <div class="scores-toolbar"><strong>전체 경기 <span>${orderedGames.length}</span></strong><p>최신 경기순 · 날짜 이동 없이 모든 경기 표시</p></div>
    ${orderedGames.length ? `<div class="scores-grid">${orderedGames.map(gameCard).join('')}</div>` : '<div class="schedule-empty">아직 기록된 경기가 없습니다.</div>'}
    <p class="stats-footnote score-key">R 득점 · H 안타 · E 실책. 선수명 아래 승–패–무는 해당 경기 종료 시점의 누적 전적입니다. 투구 IP는 3아웃 환산 이닝입니다.</p>
    <div class="summary-strip"><div class="summary-stat"><strong>${games.length}</strong><span>총 경기</span></div><div class="summary-stat"><strong>${players.yunjae.pitching.W}–${players.yunjae.pitching.L}–${players.yunjae.pitching.T}</strong><span>윤재 승–패–무</span></div><div class="summary-stat"><strong>${games.reduce((total, g) => total + g.away.R + g.home.R, 0)}</strong><span>두 선수 총 득점</span></div></div>
  </section>`;
  setActive('schedule');
}

function recordAtGame(id, currentGame) {
  const record={W:0,L:0,T:0};
  for(const g of games) {
    if(g.date>currentGame.date || (g.date===currentGame.date && g.id>currentGame.id)) continue;
    const side=g.away.player===id?g.away:g.home, opponent=side===g.away?g.home:g.away;
    record[side.R>opponent.R?'W':side.R<opponent.R?'L':'T']++;
  }
  return record;
}
function resultClass(side, opponent) { return side.R>opponent.R?'win':side.R<opponent.R?'loss':'draw'; }
function resultLabel(side, opponent) { return side.R>opponent.R?'승':side.R<opponent.R?'패':'무'; }
function renderVenue(g) { return `<p class="game-venue"><span>경기장</span>${g.venue || '미등록'}</p>`; }
function resultLinescore(g) {
  return `<div class="result-line-scroll" tabindex="0" aria-label="${g.label} 이닝별 점수, 좌우 스크롤 가능"><table class="result-linescore"><caption class="sr-only">${g.label} 이닝별 점수</caption><thead><tr><th scope="col">선수</th>${Array.from({length:g.innings},(_,i)=>`<th scope="col">${i+1}</th>`).join('')}${['R','H','E'].map(c=>`<th scope="col" class="result-total">${c}</th>`).join('')}</tr></thead><tbody>${['away','home'].map(key=>`<tr><th scope="row">${player(g[key].player).name}</th>${g[key].runs.map(r=>`<td class="${typeof r==='number'&&r?'scoring-inning':''}">${r}</td>`).join('')}${['R','H','E'].map(c=>`<td class="result-total ${c==='R'?'run-total':''}">${g[key][c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function gameCard(g) {
  const rows=['away','home'].map(key=>{
    const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player),record=recordAtGame(p.id,g);
    return `<tr class="score-team ${resultClass(side,opponent)}"><th scope="row"><div class="score-player"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><div><a href="#player/${p.id}">${p.name}</a><small>${key==='away'?'초':'말'} 공격 · ${record.W}–${record.L}–${record.T}</small></div><span class="winner-indicator" aria-label="${resultLabel(side,opponent)}">${side.R>opponent.R?'◀':''}</span></div></th><td class="card-runs">${side.R}</td><td>${side.H}</td><td>${side.E}</td></tr>`;
  }).join('');
  const pitchers=['away','home'].map(key=>{
    const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player);
    const hands=side.pitchingStints?'우·좌완':side.pitching.hand==='L'?'좌완':'우완';
    return `<div class="card-pitcher"><span class="result-tag ${resultClass(side,opponent)}">${resultLabel(side,opponent)}</span><div><a href="#player/${p.id}">${p.name}</a><span>${hands} · ${side.pitching.IP} IP · ${side.pitching.SO} K</span></div></div>`;
  }).join('');
  return `<article class="score-card" aria-labelledby="score-title-${g.id}" data-score-game="${g.id}"><header class="score-card-heading"><h2 id="score-title-${g.id}"><time datetime="${g.date}">${g.date.slice(5).replace('-','.')} <small>${['일','월','화','수','목','금','토'][new Date(`${g.date}T00:00:00`).getDay()]}</small></time></h2><span>${g.no}</span><span class="final-status">FINAL / ${g.innings}</span></header>
    ${renderVenue(g)}
    <table class="card-score-table"><caption class="sr-only">${formatDate(g.date)} ${outcome(g)}, 득점·안타·실책</caption><thead><tr><th scope="col">${g.away.R===g.home.R?'무승부':'경기 종료'}</th><th scope="col" title="득점">R</th><th scope="col" title="안타">H</th><th scope="col" title="실책">E</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="card-pitching"><span class="card-section-label">이 경기 투구</span><div>${pitchers}</div></div>
    <details class="card-innings"><summary>이닝별 점수 <span aria-hidden="true">⌄</span></summary>${resultLinescore(g)}</details>
    <div class="score-card-actions"><a href="#game/${g.id}" aria-label="${g.label} 박스스코어">박스스코어 <span aria-hidden="true">↗</span></a><a href="#game/${g.id}?view=plays" aria-label="${g.label} 플레이 기록">플레이 기록 <span aria-hidden="true">↗</span></a></div>
  </article>`;
}

function renderGame(id) {
  const g = games.find(x => x.id === id) || games[1], a = player(g.away.player), h = player(g.home.player);
  if (isPhone()) { app.innerHTML = renderPhoneGame(g, a, h); setActive('schedule'); return; }
  app.innerHTML = `<section class="container stats-page game-detail-page"><button class="back-btn" data-route="schedule">← 전체 경기 결과</button>
    <header class="game-detail-heading"><div><p class="eyebrow">FAMILY LEAGUE / BOX SCORE</p><h1>경기 결과</h1><p class="subhead">${formatDate(g.date)} · ${g.no}</p>${renderVenue(g)}</div><span class="final-status">FINAL / ${g.innings}</span></header>
    <section class="result-scoreboard" aria-label="${a.name} ${g.away.R} 대 ${h.name} ${g.home.R}, ${outcome(g)}"><div class="result-matchup">${['away','home'].map(key=>{
      const side=g[key],opponent=g[key==='away'?'home':'away'],p=player(side.player);
      return `<div class="result-contender ${resultClass(side,opponent)}"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><div><a href="#player/${p.id}">${p.name}</a><small>${key==='away'?'AWAY · 초 공격':'HOME · 말 공격'}</small></div><strong>${side.R}</strong><span class="result-tag ${resultClass(side,opponent)}">${resultLabel(side,opponent)}</span></div>`;
    }).join('<div class="result-versus">FINAL</div>')}</div>${resultLinescore(g)}</section>
    <div class="detail-grid"><div>
      <section class="panel"><h2 class="panel-title">타자 기록 · 이 경기</h2>${boxTable(g,'batting',battingColumns)}<p class="table-hint">좌우로 스크롤하면 모든 기록을 볼 수 있습니다.</p></section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">투수 기록 · 이 경기</h2>${boxTable(g,'pitching',pitchingColumns)}<p class="table-hint">ERA·WHIP은 이 경기의 3아웃 환산 이닝 기준입니다.</p></section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">경기 메모</h2><div class="rules"><p><strong>${g.note}</strong></p><p>가족 리그 특별 규칙: 윤재 공격은 이닝당 4아웃, 영훈 공격은 이닝당 2아웃으로 진행했습니다. 투수 IP는 전체 아웃카운트를 표준 3아웃제 이닝으로 환산했습니다.</p></div></section>
    </div><aside class="panel" id="game-plays"><h2 class="panel-title">플레이 기록</h2><div class="play-list">${g.plays.map(p=>`<div class="inning"><div class="inning-head"><strong>${p[0]} ${p[1]} 공격</strong><span>${p[1]===a.name?'초':'말'}</span></div><p>${p[2]}</p></div>`).join('')}</div></aside></div>
  </section>`;
  setActive('schedule');
}

function boxTable(g, mode, cols) {
  const rows = ['away','home'].flatMap(s => {
    const side = g[s];
    const opponent = g[s === 'away' ? 'home' : 'away'];
    const stats = mode === 'batting' ? summarizeBatting([side.batting]) : summarizePitching([{ ...side.pitching, HBP:opponent.batting.HBP || 0 }]);
    const rows = [{ label:player(side.player).name, stats }];
    if (mode === 'pitching' && side.pitchingStints) {
      rows[0].label += ' (합계)';
      for (const line of splitPitching(side.pitchingStints)) rows.push({ label:`↳ ${handNames[line.hand]}`, stats:line });
    }
    return rows;
  });
  return `<div class="record-table-wrap" tabindex="0" aria-label="경기 ${mode === 'batting' ? '타격' : '투구'} 기록"><table class="box-table"><thead><tr><th scope="col">선수</th>${cols.map(statHeader).join('')}</tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${row.label}</th>${cols.map(c=>`<td>${row.stats[c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderPitchingSplits(p) {
  if (recordMode !== 'pitching' || p.pitchingSplits.length < 2) return '';
  const cols = ['G', ...pitchingColumns];
  return `<section class="panel game-log"><div class="record-table-wrap"><table class="record-table"><caption>좌완 · 우완 통산 기록</caption><thead><tr><th class="season">투구 손</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${p.pitchingSplits.map(line=>`<tr><td class="season">${handNames[line.hand]}</td>${cols.map(c=>`<td>${line[c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="rules"><p>한 경기에서 양손으로 던지면 양쪽 G에 각각 1경기로 집계합니다. IP는 실제 아웃 수를 3아웃제 이닝으로 환산하며, 승패는 선수 전체 기록에만 집계합니다.</p></div></section>`;
}

function renderPlayerGameLog(g, p) {
  const side = g.away.player === p.id ? g.away : g.home;
  const opponent = side === g.away ? g.home : g.away;
  const cols = recordMode === 'batting' ? battingColumns : pitchingColumns;
  const stats = recordMode === 'batting' ? summarizeBatting([side.batting]) : summarizePitching([{ ...side.pitching, HBP:opponent.batting.HBP || 0 }]);
  const totalRow = `<tr><th scope="row"><a href="#game/${g.id}">${g.date.replaceAll('-','.')}</a></th><td>vs ${player(opponent.player).name}</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr>`;
  if (recordMode !== 'pitching' || !side.pitchingStints) return totalRow;
  return totalRow + splitPitching(side.pitchingStints).map(split=>`<tr class="split-row"><th scope="row">↳ ${handNames[split.hand]}</th><td>손별 기록</td>${cols.map(c=>`<td>${split[c]}</td>`).join('')}</tr>`).join('');
}

const leaderColumns = {
  batting: {
    standard:['G','AB','R','H','2B','3B','HR','RBI','BB','SO','AVG','OBP','SLG','OPS'],
    expanded:['G','PA','wOBA','wRC+','PF','Bat600','AB','H','TB','XBH','HR','RBI','BB','HBP','SO','SF','SH','AVG','OBP','SLG','OPS']
  },
  pitching: {
    standard:['W','L','T','ERA','G','IP','H','R','ER','HR','HBP','BB','SO','WHIP'],
    expanded:['G','IP','ERA','WHIP','K9','BB9','H','R','ER','HR','HBP','BB','SO']
  }
};
Object.assign(statLabels, { W:'승', L:'패', T:'무승부', '3B':'3루타', TB:'총 루타', XBH:'장타 수', SF:'희생플라이', SH:'희생번트' });
Object.assign(statLabels, {wOBA:'KBO 계수 가중 출루율','wRC+':'KBO 기준 가상 wRC+',PF:'개인 타석 가중 실험 파크팩터',Bat600:'600타석당 평균 대비 가상 타격 득점'});
const rateKeys = ['AVG','OBP','SLG','OPS','ERA','WHIP','K9','BB9','wOBA','wRC+','PF','Bat600'];
const statName = key => key === 'K9' ? 'K/9' : key === 'BB9' ? 'BB/9' : key;
const months = () => [...new Set(games.map(g=>g.date.slice(0,7)))].sort().reverse();
const monthLabel = month => `${month.slice(0,4)}년 ${Number(month.slice(5))}월`;
const periodOptions = () => [['all','시즌 전체'],['last3','최근 3경기'],['last5','최근 5경기'],...months().map(m=>[m,monthLabel(m)])];
function periodGames(period) {
  const ordered=games.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  return period==='last3' ? ordered.slice(-3) : period==='last5' ? ordered.slice(-5) : months().includes(period) ? ordered.filter(g=>g.date.startsWith(period)) : ordered;
}
function aggregateRecords(id, mode, hand, selectedGames) {
  const lines=[];
  const decisions={G:0,W:0,L:0,T:0};
  for(const game of selectedGames) {
    const side=game.away.player===id ? game.away : game.home;
    const opponent=side===game.away ? game.home : game.away;
    const entry=mode==='batting' ? [side.batting] : pitchingStints(side,opponent).filter(s=>hand==='all'||s.hand===hand);
    if(!entry.length) continue;
    lines.push(...entry);
    decisions.G++;
    decisions[side.R>opponent.R?'W':side.R<opponent.R?'L':'T']++;
  }
  if(!lines.length) return null;
  const stats=mode==='batting' ? summarizeBatting(lines) : summarizePitching(lines);
  if(mode==='batting') Object.assign(stats,advancedBatting(id,selectedGames));
  return { ...stats, ...decisions, ...(mode==='batting' ? {TB:stats.H+stats['2B']+2*stats['3B']+3*stats.HR,XBH:stats['2B']+stats['3B']+stats.HR} : hand!=='all' ? {W:'—',L:'—',T:'—'} : {}) };
}
function segmentedLinks(page, state, key, options, label) {
  return `<div class="stats-segments" role="group" aria-label="${label}">${options.map(([value,label])=>{
    const next={...state,[key]:value};
    if(key==='mode') { next.hand='all'; if(page==='trends') next.metric=trendMetrics[value][0]; else {next.sort=value==='batting'?'AVG':'ERA';next.dir=value==='batting'?'desc':'asc';} }
    return `<a href="#${page}?${new URLSearchParams(next)}" class="${state[key]===value?'active':''}" ${state[key]===value?'aria-current="page"':''}>${label}</a>`;
  }).join('')}</div>`;
}
function readLeaderState(query) {
  const p=new URLSearchParams(query), mode=p.get('mode')==='pitching'?'pitching':'batting';
  const view=p.get('view')==='expanded'?'expanded':'standard';
  const sort=leaderColumns[mode][view].includes(p.get('sort'))?p.get('sort'):mode==='batting'?'AVG':'ERA';
  return {mode,view,sort,dir:['asc','desc'].includes(p.get('dir'))?p.get('dir'):sort==='ERA'?'asc':'desc',period:periodOptions().some(([v])=>v===p.get('period'))?p.get('period'):'all',hand:mode==='pitching'&&['R','L'].includes(p.get('hand'))?p.get('hand'):'all'};
}
function leaderSelect(key,label,options) {
  return `<label class="trend-control" for="leaders-${key}"><span>${label}</span><select id="leaders-${key}" data-leaders="${key}">${options.map(([v,t])=>`<option value="${v}" ${leadersState[key]===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
}
function rankedLeaders(state) {
  const entries=Object.values(players).map(p=>({player:p,stats:aggregateRecords(p.id,state.mode,state.hand,periodGames(state.period))}));
  const value=e=>e.stats?.[state.sort];
  const missing=v=>v==null||v==='—';
  entries.sort((a,b)=>missing(value(a))?missing(value(b))?a.player.id.localeCompare(b.player.id):1:missing(value(b))?-1:(Number(value(a))-Number(value(b)))*(state.dir==='asc'?1:-1)||a.player.id.localeCompare(b.player.id));
  entries.forEach((e,i)=>{e.rank=missing(value(e))?'—':i>0&&value(e)===value(entries[i-1])?entries[i-1].rank:i+1;});
  return entries;
}
function renderPlayers(query='') {
  leadersState=readLeaderState(query);
  const {mode,view,sort,dir,hand,period}=leadersState;
  const cols=leaderColumns[mode][view], entries=rankedLeaders(leadersState);
  const selection=periodOptions().find(([v])=>v===period)[1];
  if(isPhone()) {
    app.innerHTML=`<section class="m-page"><header class="m-heading"><p class="eyebrow">FAMILY LEAGUE / STATISTICS</p><h1>선수 기록</h1><p class="m-sub">${selection} · ${periodGames(period).length}경기 · ${mode==='pitching'?hand==='all'?'전체 투구':handNames[hand]:'두 선수 전체'}</p></header>
      ${segmentedLinks('players',leadersState,'mode',[['batting','타격'],['pitching','투구']],'기록 분야')}
      <div class="m-filters">${leaderSelect('period','기록 기간',periodOptions())}${mode==='pitching'?leaderSelect('hand','투구 손',[['all','전체'],['R','우완'],['L','좌완']]):''}${leaderSelect('sort','정렬 기준',cols.map(c=>[c,`${statName(c)} · ${statLabels[c]}`]))}<button class="m-sort-dir" id="sort-${sort}" data-stat-sort="${sort}" aria-label="${statLabels[sort]} 정렬 방향 바꾸기">${dir==='asc'?'낮은 순 ↑':'높은 순 ↓'}</button></div>
      ${segmentedLinks('players',leadersState,'view',[['standard','기본 기록'],['expanded','상세 기록']],'표 항목')}
      ${mode==='batting'?saberNote():''}
      <ol class="m-rank-list">${entries.map(({player:p,stats,rank})=>`<li class="m-card">${phoneCardHead(p,p.handedness,`<span class="m-key-stat"><small>${statName(sort)}</small>${stats?.[sort]??'—'}</span>`,`<span class="m-rank">${rank}</span>`,`#player/${p.id}`)}${stats?statGrid(stats,cols,sort):'<p class="m-note">선택한 조건의 기록이 없습니다.</p>'}</li>`).join('')}</ol>
      <p class="m-note">규정 타석/이닝 제한 없음.${hand!=='all'?' 좌·우완별 승패는 따로 부여하지 않으며, 해당 손 미등판은 —로 표시합니다.':''}</p>
      <div class="m-list">${Object.values(players).map(p=>`<a href="#trends?player=${p.id}&mode=${mode}" class="m-list-link"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><span><strong>${p.name}</strong><small>경기 로그 · 누적 기록</small></span><span aria-hidden="true">›</span></a>`).join('')}</div>
      <p class="m-note">기록된 항목만 표시합니다. 투구 이닝과 ERA는 3아웃 환산 기준이며, 실책 상황에 따른 자책점 추정은 각 경기 설명을 따릅니다.</p>
    </section>`;
    setActive('players');
    return;
  }
  const headers=cols.map(c=>`<th scope="col" aria-sort="${c===sort?(dir==='asc'?'ascending':'descending'):'none'}"><button id="sort-${c}" data-stat-sort="${c}" title="${statLabels[c]}" aria-label="${statLabels[c]} (${statName(c)}) 정렬">${statName(c)}<span aria-hidden="true">${c===sort?(dir==='asc'?' ↑':' ↓'):' ↕'}</span></button></th>`).join('');
  app.innerHTML=`<section class="container stats-page"><header class="stats-page-heading"><div><p class="eyebrow">FAMILY LEAGUE / STATISTICS</p><h1>선수 기록</h1><p class="subhead">우리 가족 리그의 기록을 한눈에.</p></div><span class="season-stamp">2026<span>SEASON</span></span></header>
    ${segmentedLinks('players',leadersState,'mode',[['batting','타격 · HITTING'],['pitching','투구 · PITCHING']],'기록 분야')}
    ${mode==='batting'?saberNote():''}
    <div class="stats-filterbar">${leaderSelect('period','기록 기간',periodOptions())}${mode==='pitching'?leaderSelect('hand','투구 손',[['all','전체'],['R','우완'],['L','좌완']]):'<div class="filter-note">영훈 · 좌타<br>윤재 · 우타</div>'}<a class="reset-link" href="#players?mode=${mode}">필터 초기화</a></div>
    <div class="stats-table-heading"><div><h2>${mode==='batting'?'타격':'투구'} 순위</h2><p>${selection} · ${periodGames(period).length}경기 · ${mode==='pitching'?hand==='all'?'전체 투구':handNames[hand]:'두 선수 전체'} · 규정 타석/이닝 제한 없음</p></div>${segmentedLinks('players',leadersState,'view',[['standard','기본 기록'],['expanded','상세 기록']],'표 항목')}</div>
    <div class="record-table-wrap stats-scroll" tabindex="0" aria-label="${mode==='batting'?'타격':'투구'} 순위표, 좌우 스크롤 가능"><table class="record-table league-table"><caption class="sr-only">2026 ${selection} ${mode==='batting'?'타격':'투구'} 순위</caption><thead><tr><th scope="col" class="player-cell">순위 / 선수</th>${headers}</tr></thead><tbody>${entries.map(({player:p,stats,rank})=>`<tr><th scope="row" class="player-cell"><div class="ranked-player"><span class="rank-number">${rank}</span><span class="team-dot ${p.color}">${p.initial}</span><div><a href="#player/${p.id}">${p.name}</a><small>${p.handedness}</small></div></div></th>${cols.map(c=>`<td class="${c===sort?'sorted-stat':''}">${stats?.[c]??'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="table-hint">열 제목을 누르면 오름차순·내림차순으로 정렬됩니다. 선수 이름을 누르면 상세 기록으로 이동합니다.${hand!=='all'?' 좌·우완별 승패는 따로 부여하지 않으며, 해당 손 미등판은 —로 표시합니다.':''}</p>
    <div class="stats-roster">${Object.values(players).map(p=>`<a href="#trends?player=${p.id}&mode=${mode}" class="roster-link"><span class="team-dot ${p.color}">${p.initial}</span><span><strong>${p.name}</strong><small>경기 로그 · 누적 기록</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>
    <p class="stats-footnote">기록된 항목만 표시합니다. 도루·도루실패·세이브 등 별도로 기록하지 않은 항목은 제외했습니다. 투구 이닝과 ERA는 3아웃 환산 기준이며, 실책 상황에 따른 자책점 추정은 각 경기 설명을 따릅니다.</p>
  </section>`;
  setActive('players');
}

function renderPlayer(id) {
  const p = player(id) || players.yunjae;
  const stats = recordMode === 'batting' ? p.batting : p.pitching;
  const logCols = recordMode === 'batting' ? battingColumns : pitchingColumns;
  const cols = recordMode === 'batting' ? ['G',...battingColumns] : ['G','W','L','T',...pitchingColumns];
  if (isPhone()) {
    const logCards = games.slice().reverse().map(g => {
      const side = g.away.player === p.id ? g.away : g.home, opponent = side === g.away ? g.home : g.away;
      const gameStats = recordMode === 'batting' ? summarizeBatting([side.batting]) : summarizePitching([{ ...side.pitching, HBP:opponent.batting.HBP || 0 }]);
      const splits = recordMode === 'pitching' && side.pitchingStints ? splitPitching(side.pitchingStints).map(split=>`<div class="m-split"><h4>↳ ${handNames[split.hand]}</h4>${statGrid(split,logCols)}</div>`).join('') : '';
      return `<article class="m-card"><a class="m-log-head" href="#game/${g.id}"><time datetime="${g.date}">${g.date.slice(5).replace('-','.')} ${weekday(g.date)}</time><span>vs ${player(opponent.player).name}</span><span class="result-tag ${resultClass(side,opponent)}">${resultLabel(side,opponent)} ${side.R}–${opponent.R}</span><span aria-hidden="true">›</span></a>${statGrid(gameStats,logCols)}${splits}</article>`;
    }).join('');
    app.innerHTML = `<section class="m-page"><button class="m-back" data-route="players">‹ 선수 기록</button>
      <div class="m-profile ${p.color}" data-initial="${p.initial}"><p>PLAYER ${p.number} · TWO-WAY</p><h1>${p.name}</h1><p>${p.role} · ${p.handedness}</p><dl>${[['AVG',p.batting.AVG],['HR',p.batting.HR],['ERA',p.pitching.ERA],['SO',p.pitching.SO]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
      <div class="m-segmented" role="group" aria-label="기록 분야">${[['batting','타자'],['pitching','투수']].map(([m,label])=>`<button class="${recordMode===m?'active':''}" data-mode="${m}" aria-pressed="${recordMode===m}">${label}</button>`).join('')}</div>
      <section class="m-section"><h2>2026 시즌 ${recordMode==='batting'?'타격':'투구'}</h2><div class="m-card">${statGrid(stats,cols)}</div></section>
      ${recordMode==='pitching'&&p.pitchingSplits.length>1?`<section class="m-section"><h2>좌완 · 우완 통산</h2>${p.pitchingSplits.map(line=>`<div class="m-card"><h3 class="m-card-title">${handNames[line.hand]}</h3>${statGrid(line,['G',...pitchingColumns])}</div>`).join('')}<p class="m-note">한 경기에서 양손으로 던지면 양쪽 G에 각각 1경기로 집계합니다. 승패는 선수 전체 기록에만 집계합니다.</p></section>`:''}
      <section class="m-section"><div class="m-section-head"><h2>경기별 기록</h2><a href="#trends?player=${p.id}&mode=${recordMode}">기록 추이 ›</a></div>${logCards}</section>
    </section>`;
    setActive('players');
    return;
  }
  app.innerHTML = `<section class="container"><button class="back-btn" data-route="players">← 선수 목록</button><div class="profile-hero"><div class="profile-side ${p.color}" data-initial="${p.initial}"><strong>PLAYER ${p.number}</strong><span>영훈 × 윤재 FAMILY LEAGUE</span></div><div class="profile-main"><p class="eyebrow">TWO-WAY PLAYER</p><h1>${p.name}</h1><p class="bio">${p.role} · ${p.handedness} · 2026 가족 리그</p><div class="hero-stats"><div class="hero-stat"><strong>${p.batting.AVG}</strong><span>AVG</span></div><div class="hero-stat"><strong>${p.batting.HR}</strong><span>HR</span></div><div class="hero-stat"><strong>${p.pitching.ERA}</strong><span>ERA</span></div><div class="hero-stat"><strong>${p.pitching.SO}</strong><span>SO</span></div></div></div></div>
    <div class="record-tabs"><button class="record-tab ${recordMode==='batting'?'active':''}" data-mode="batting">타자</button><button class="record-tab ${recordMode==='pitching'?'active':''}" data-mode="pitching">투수</button></div>
    <section class="panel"><div class="record-table-wrap"><table class="record-table"><caption>${recordMode==='batting'?'타격':'투구'} 기록</caption><thead><tr><th class="season">시즌</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><td class="season">2026</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tbody><tfoot><tr><td class="season">통산</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tfoot></table></div></section>
    ${renderPitchingSplits(p)}
    <section class="panel game-log"><div class="section-heading"><h2>경기별 기록</h2><a class="text-link" href="#trends?player=${p.id}&mode=${recordMode}">기록 추이 보기 →</a></div><p class="table-hint">각 경기의 성적입니다. 날짜를 누르면 박스스코어로 이동합니다.</p><div class="record-table-wrap" tabindex="0" aria-label="경기별 상세 기록"><table class="record-table game-stats-table"><thead><tr><th scope="col">날짜</th><th scope="col">상대 / 구분</th>${logCols.map(statHeader).join('')}</tr></thead><tbody>${games.slice().reverse().map(g=>renderPlayerGameLog(g,p)).join('')}</tbody></table></div></section>
  </section>`;
  setActive('players');
}

const trendMetrics = { batting:['AVG','OBP','SLG','OPS','wOBA','wRC+','PF','Bat600','H','HR','RBI'], pitching:['ERA','WHIP','K9','BB9','SO','H','R'] };

function buildHistory(playerId, mode, basis, hand = 'all') {
  const accumulated = [];
  let appearances = 0;
  return games.slice().sort((a,b)=>a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).map((game,index) => {
    const side = game.away.player === playerId ? game.away : game.home;
    const opponent = side === game.away ? game.home : game.away;
    const lines = mode === 'batting' ? [side.batting] : pitchingStints(side,opponent).filter(s=>hand === 'all' || s.hand === hand);
    accumulated.push(...lines);
    if (lines.length) appearances++;
    const source = basis === 'cumulative' ? accumulated : lines;
    const stats = source.length ? { ...(mode === 'batting' ? summarizeBatting(source) : summarizePitching(source)), G:basis === 'cumulative' ? appearances : 1 } : null;
    if(stats&&mode==='batting') {
      const known=gamesThrough(games,game);
      Object.assign(stats,advancedBatting(playerId,basis==='cumulative'?known:[game],known));
    }
    return { game, number:index+1, stats, played:lines.length > 0 };
  });
}

function readTrendState(query) {
  const params = new URLSearchParams(query);
  const mode = params.get('mode') === 'pitching' ? 'pitching' : 'batting';
  return {
    player:['yunjae','younghun'].includes(params.get('player')) ? params.get('player') : 'all',
    mode,
    basis:['game','cumulative'].includes(params.get('basis')) ? params.get('basis') : 'gamelog',
    hand:mode === 'pitching' && ['R','L'].includes(params.get('hand')) ? params.get('hand') : 'all',
    metric:trendMetrics[mode].includes(params.get('metric')) ? params.get('metric') : trendMetrics[mode][0],
    period:periodOptions().some(([v])=>v===params.get('period'))?params.get('period'):'all',
    view:params.get('view')==='expanded'?'expanded':'standard'
  };
}

function trendSelect(key, label, options) {
  return `<label class="trend-control" for="trend-${key}"><span>${label}</span><select id="trend-${key}" data-trend="${key}">${options.map(([value,text])=>`<option value="${value}" ${trendState[key] === value ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
}

function trendMetricLabel(key, mode) {
  if (key === 'H') return mode === 'batting' ? '안타' : '피안타';
  if (key === 'R') return mode === 'batting' ? '득점' : '실점';
  if (key === 'SO') return '탈삼진';
  if (key === 'HR') return mode === 'batting' ? '홈런' : '피홈런';
  return statLabels[key];
}

function renderTrendChart(series, metric) {
  const values = series.flatMap(s=>s.rows.map(row=>row.stats?.[metric])).filter(v=>v != null && v !== '—').map(Number);
  if (!values.length) return '<div class="chart-empty">선택한 투구 손으로 등판한 기록이 없습니다.<br>다른 선수나 투구 손을 선택해 주세요.</div>';
  const compact=isPhone();
  const width=compact?400:1000, height=compact?280:360, left=compact?44:64, right=compact?16:42, top=26, bottom=compact?40:62;
  const plotWidth=width-left-right, plotHeight=height-top-bottom;
  const minimum=Math.min(0,...values);
  const rawStep=((Math.max(0,...values)-minimum) || 1)*1.15/4;
  const magnitude=10**Math.floor(Math.log10(rawStep));
  const rateMetric=['AVG','OBP','SLG','OPS','wOBA','ERA','WHIP','K9','BB9'].includes(metric);
  const step=rateMetric ? Math.ceil(rawStep/magnitude*4)/4*magnitude : Math.max(1,Math.ceil(rawStep));
  const maximum=minimum+step*4;
  const count=series[0].rows.length;
  const x=i=>count===1 ? left+plotWidth/2 : left+i*plotWidth/(count-1);
  const y=value=>top+plotHeight-((value-minimum)/(maximum-minimum))*plotHeight;
  const decimals=['AVG','OBP','SLG','OPS','wOBA'].includes(metric) ? 3 : ['ERA','WHIP','K9','BB9'].includes(metric) ? 2 : ['PF','Bat600'].includes(metric)?1:0;
  const grid=Array.from({length:5},(_,i)=>{
    const value=minimum+step*i, pos=y(value);
    return `<line x1="${left}" y1="${pos}" x2="${width-right}" y2="${pos}" stroke="#e2e7ec"/><text x="${left-12}" y="${pos+4}" text-anchor="end">${value.toFixed(decimals)}</text>`;
  }).join('');
  const labels=series[0].rows.map((row,i)=>compact?`<text x="${x(i)}" y="${height-16}" text-anchor="middle">${row.game.date.slice(5).replace('-','/')}</text>`:`<text x="${x(i)}" y="${height-34}" text-anchor="middle">${row.game.date.slice(5).replace('-','/')}</text><text class="chart-game-number" x="${x(i)}" y="${height-15}" text-anchor="middle">${row.number}경기</text>`).join('');
  const lines=series.map(s=>{
    let started=false;
    const path=s.rows.map((row,i)=>{
      const value=row.stats?.[metric];
      if(value == null || value === '—') { started=false; return ''; }
      const command=started ? 'L' : 'M'; started=true;
      return `${command}${x(i)},${y(Number(value))}`;
    }).join(' ');
    const points=s.rows.map((row,i)=>{
      const value=row.stats?.[metric];
      if(value == null || value === '—') return '';
      const label=`${row.game.date} ${s.player.name} ${metric} ${value}${row.played ? '' : ' (해당 손 미등판, 누적 유지)'}`;
      return `<a href="#game/${row.game.id}" aria-label="${label}, 경기 상세 보기"><circle cx="${x(i)}" cy="${y(Number(value))}" r="6" fill="${row.played ? s.color : '#fff'}" stroke="${s.color}" stroke-width="3"><title>${label}</title></circle></a>`;
    }).join('');
    return `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${points}`;
  }).join('');
  return `<div class="chart-scroll" tabindex="0" aria-label="${metric} 추이 그래프, 좌우 스크롤 가능"><svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="trend-chart-title trend-chart-desc"><title id="trend-chart-title">${trendMetricLabel(metric,trendState.mode)} ${trendBasisLabel(trendState.basis,metric)} 추이</title><desc id="trend-chart-desc">가로축은 경기 순서, 세로축은 ${metric}입니다. 정확한 수치는 경기 로그 표에서 확인할 수 있습니다. 그래프의 점을 누르면 경기 상세로 이동합니다.</desc>${grid}${labels}${lines}</svg></div>`;
}

function trendBasisLabel(basis,metric) {
  return basis==='cumulative'||(basis==='gamelog'&&rateKeys.includes(metric))?'시즌 누적':'경기별';
}
function buildLogSeries(id,mode,basis,hand,period) {
  const cumulative=buildHistory(id,mode,'cumulative',hand);
  const single=buildHistory(id,mode,'game',hand);
  const selected=new Set(periodGames(period).map(g=>g.id));
  return cumulative.map((row,index)=>{
    const gameStats=single[index].stats;
    let stats=basis==='cumulative'?row.stats:gameStats;
    if(basis==='gamelog') stats=gameStats||row.stats ? {...gameStats,...Object.fromEntries(rateKeys.map(key=>[key,row.stats?.[key]??'—']))} : null;
    if(stats&&mode==='batting') stats={...stats,TB:stats.H+stats['2B']+2*stats['3B']+3*stats.HR};
    return {...row,stats,gameStats};
  }).filter(row=>selected.has(row.game.id));
}
function renderLogTable(series, cols) {
  const {mode,basis,hand,metric}=trendState;
  const p=series.player, ordered=series.rows.slice().reverse();
  const monthKeys=[...new Set(ordered.map(r=>r.game.date.slice(0,7)))];
  const body=monthKeys.map(month=>{
    const entries=ordered.filter(r=>r.game.date.startsWith(month));
    const totals=aggregateRecords(p.id,mode,hand,entries.map(r=>r.game));
    const rows=entries.map(row=>{
      const side=row.game.away.player===p.id?row.game.away:row.game.home;
      const opponent=side===row.game.away?row.game.home:row.game.away;
      const result=side.R>opponent.R?'win':side.R<opponent.R?'loss':'draw';
      return `<tr data-log-game="${row.game.id}"><th scope="row"><a href="#game/${row.game.id}">${row.game.date.slice(5).replace('-','/')}</a><small class="log-game-number">${row.number}경기${row.played?'':' · 해당 손 미등판'}</small></th><td>${side===row.game.away?'@':'vs'} ${players[opponent.player].name}</td><td><span class="result-tag ${result}">${result==='win'?'승':result==='loss'?'패':'무'}</span> ${side.R}–${opponent.R}</td>${cols.map(c=>`<td class="${c===metric?'selected-stat':''} ${basis==='gamelog'&&rateKeys.includes(c)?'cumulative-cell':''}">${row.stats?.[c]??'—'}</td>`).join('')}</tr>`;
    }).join('');
    return `<tr class="month-divider"><th colspan="${cols.length+3}" scope="rowgroup">${monthLabel(month)} <span>${entries.length}경기</span></th></tr>${rows}<tr class="month-total"><th scope="row">${Number(month.slice(5))}월 합계</th><td colspan="2">${totals?.G??0}경기 집계</td>${cols.map(c=>`<td>${totals?.[c]??'—'}</td>`).join('')}</tr>`;
  }).join('');
  return `<section class="trend-player-table log-player-table"><header class="log-player-heading"><span class="team-dot ${p.color}">${p.initial}</span><div><h3 id="trend-table-${p.id}">${p.name}</h3><span>${p.handedness}</span></div><a href="#player/${p.id}" aria-label="${p.name} 선수 상세">프로필 ↗</a></header><div class="record-table-wrap" tabindex="0" aria-label="${p.name} ${mode==='batting'?'타격':'투구'} 경기 로그"><table class="record-table game-stats-table log-table" aria-labelledby="trend-table-${p.id}"><thead><tr><th scope="col">날짜</th><th scope="col">상대</th><th scope="col">결과</th>${cols.map(c=>`<th scope="col" class="${basis==='gamelog'&&rateKeys.includes(c)?'cumulative-heading':''}" title="${statLabels[c]}">${statName(c)}${basis==='gamelog'&&rateKeys.includes(c)?'<small>누적</small>':''}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div></section>`;
}

function renderTrends(query = '') {
  trendState=readTrendState(query);
  const { mode, basis, hand, metric, period, view }=trendState;
  const ids=trendState.player === 'all' ? ['yunjae','younghun'] : [trendState.player];
  const series=ids.map(id=>({ player:players[id], color:id === 'yunjae' ? '#d95713' : '#08754c', rows:buildLogSeries(id,mode,basis,hand,period) }));
  const basisLabel=trendBasisLabel(basis,metric);
  const cols=mode==='batting' ? (view==='expanded'?['PA','AB','R','H','TB','2B','3B','HR','RBI','BB','HBP','SO','SF','SH','AVG','OBP','SLG','OPS']:['AB','R','H','2B','HR','RBI','BB','SO','AVG','OBP','SLG','OPS']) : (view==='expanded'?[...pitchingColumns]:['IP','H','R','ER','BB','SO','HR','ERA','WHIP']);
  if(mode==='batting'&&view==='expanded') cols.unshift('wOBA','wRC+','PF','Bat600');
  else if(mode==='batting'&&!cols.includes(metric)) cols.unshift(metric);
  if(basis==='cumulative') cols.unshift('G');
  const cards=series.map(s=>{
    const stats=aggregateRecords(s.player.id,mode,hand,periodGames(period));
    const keys=mode==='batting'?['AVG','H','HR','OPS']:['IP','ERA','SO','WHIP'];
    return `<section class="log-summary ${s.player.color}"><div><span class="player-key ${s.player.color}">${s.player.name}</span><span>${periodOptions().find(([v])=>v===period)[1]} · ${stats?.G??0}경기</span></div><dl>${keys.map(k=>`<div><dt>${statName(k)}</dt><dd>${stats?.[k]??'—'}</dd></div>`).join('')}</dl></section>`;
  }).join('');
  const explainer=`${basis==='gamelog'?'안타·삼진·이닝 등은 그 경기의 성적, 파란색 비율 지표는 해당 경기 종료 시점까지의 시즌 누적입니다.':basis==='cumulative'?'각 경기 종료 시점의 누적 기록입니다. 모든 항목을 시즌 첫 경기부터 합산합니다.':'모든 항목은 해당 경기만의 성적입니다. 비율 지표도 그 경기 기록으로 계산합니다.'} 월 합계는 표시된 해당 월 경기만 집계합니다. 기간 필터를 바꿔도 시즌 누적은 초기화하지 않습니다.`;
  const statGuide='<div class="rules"><p>AVG = 안타 ÷ 타수 · OBP = (안타 + 볼넷 + 사구) ÷ (타수 + 볼넷 + 사구 + 희생플라이) · SLG = 총 루타 ÷ 타수 · OPS = OBP + SLG</p><p>ERA = 자책점 × 27 ÷ 아웃 수 · WHIP = (피안타 + 볼넷) × 3 ÷ 아웃 수 · K/9 = 탈삼진 × 27 ÷ 아웃 수 · BB/9 = 볼넷 × 27 ÷ 아웃 수</p><p>투구 이닝은 3아웃 기준입니다. 3.1은 3⅓이닝, 3.2는 3⅔이닝입니다. 누적 비율은 경기별 비율의 평균이 아니라, 해당 시점까지의 원기록 합계로 다시 계산합니다. 좌·우완은 같은 선수의 투구 손에 따른 분류이며, 상대 타자의 타격 방향을 뜻하지 않습니다.</p></div>';
  const handNote=mode==='pitching'&&hand!=='all'?' 빈 점은 해당 손 미등판으로 누적 비율이 유지된 경기입니다. 경기별 값은 미등판 시 표시하지 않습니다.':'';
  if(isPhone()) {
    const cumulative=basis==='gamelog'?rateKeys:[];
    const logs=series.map(s=>{
      const p=s.player, ordered=s.rows.slice().reverse();
      return `<section class="m-section" aria-labelledby="trend-table-${p.id}"><div class="m-section-head"><h2 id="trend-table-${p.id}">${p.name} 경기 로그</h2><a href="#player/${p.id}">프로필 ›</a></div>${[...new Set(ordered.map(r=>r.game.date.slice(0,7)))].map((month,monthIndex)=>{
        const entries=ordered.filter(r=>r.game.date.startsWith(month));
        const totals=aggregateRecords(p.id,mode,hand,entries.map(r=>r.game));
        return `<details class="m-month-group" ${monthIndex===0?'open':''}><summary class="m-month">${monthLabel(month)} <span>${entries.length}경기</span></summary>${entries.map(row=>{
          const side=row.game.away.player===p.id?row.game.away:row.game.home, opponent=side===row.game.away?row.game.home:row.game.away;
          return `<article class="m-card" data-log-game="${row.game.id}"><a class="m-log-head" href="#game/${row.game.id}"><time datetime="${row.game.date}">${row.game.date.slice(5).replace('-','.')}</time><span>${row.number}경기 · ${side===row.game.away?'@':'vs'} ${players[opponent.player].name}${row.played?'':' · 해당 손 미등판'}</span><span class="result-tag ${resultClass(side,opponent)}">${resultLabel(side,opponent)} ${side.R}–${opponent.R}</span><span aria-hidden="true">›</span></a>${statGrid(row.stats,cols,metric,cumulative)}</article>`;
        }).join('')}<article class="m-card m-month-total"><h4 class="m-card-title">${Number(month.slice(5))}월 합계 · ${totals?.G??0}경기 집계</h4>${statGrid(totals,cols)}</article></details>`;
      }).join('')}</section>`;
    }).join('');
    app.innerHTML=`<section class="m-page"><header class="m-heading"><p class="eyebrow">FAMILY LEAGUE / GAME LOGS</p><h1>기록 추이</h1><p class="m-sub">매 경기의 성적과 시즌 기록이 쌓이는 과정.</p></header>
      ${segmentedLinks('trends',trendState,'mode',[['batting','타격'],['pitching','투구']],'기록 분야')}
      <div class="m-filters">${trendSelect('player','선수',[['all','두 선수 비교'],['yunjae','윤재'],['younghun','영훈']])}${trendSelect('period','표시 기간',periodOptions())}${mode==='pitching'?trendSelect('hand','투구 손',[['all','전체'],['R','우완'],['L','좌완']]):''}</div>
      <div class="trend-summaries">${cards}</div>
      <section class="m-section"><h2>기록 그래프 · ${basisLabel}</h2><div class="m-card m-chart">${trendSelect('metric','그래프 지표',trendMetrics[mode].map(key=>[key,`${statName(key)} · ${trendMetricLabel(key,mode)}`]))}<div class="chart-legend">${series.map(s=>`<span class="player-key ${s.player.color}">${s.player.name}</span>`).join('')}</div>${renderTrendChart(series,metric)}<p class="m-note">점을 누르면 경기 상세로 이동합니다.${handNote}</p></div></section>
      <section class="m-section"><h2>경기 로그</h2>${segmentedLinks('trends',trendState,'basis',[['gamelog','경기+누적'],['cumulative','전체 누적'],['game','그 경기만']],'집계 기준')}${segmentedLinks('trends',trendState,'view',[['standard','기본 기록'],['expanded','상세 기록']],'표 항목')}<p class="m-note">${explainer}${basis==='gamelog'?' 파란 점이 붙은 지표가 누적입니다.':''} @는 초 공격, vs는 말 공격입니다.</p>${mode==='batting'?saberNote():''}</section>
      ${logs}
      <details class="m-card stat-guide"><summary>스탯 계산 기준</summary>${statGuide}</details>
    </section>`;
    setActive('trends');
    return;
  }
  app.innerHTML=`<section class="container stats-page"><header class="stats-page-heading"><div><p class="eyebrow">FAMILY LEAGUE / GAME LOGS</p><h1>기록 추이</h1><p class="subhead">매 경기의 성적과 시즌 기록이 쌓이는 과정.</p></div><span class="season-stamp">2026<span>SEASON</span></span></header>
    ${segmentedLinks('trends',trendState,'mode',[['batting','타격 · HITTING'],['pitching','투구 · PITCHING']],'기록 분야')}
    ${mode==='batting'?saberNote()+'<p class="table-hint">가상 지표의 경기 행은 당시까지의 자료로 계산한 PF를 적용합니다. 기간 요약·월 합계는 현재 전체 자료의 PF 기준입니다. Bat600은 WAR가 아닌 600타석당 타격 득점입니다.</p>':''}
    <div class="stats-filterbar">
      ${trendSelect('player','선수',[['all','두 선수 비교'],['yunjae','윤재'],['younghun','영훈']])}
      ${trendSelect('period','표시 기간',periodOptions())}
      ${mode === 'pitching' ? trendSelect('hand','투구 손',[['all','전체'],['R','우완'],['L','좌완']]) : ''}
      <a class="reset-link" href="#trends?mode=${mode}">필터 초기화</a>
    </div>
    <div class="trend-summaries">${cards}</div>
    <div class="stats-table-heading"><div><h2>경기 로그 <span>GAME LOGS</span></h2><p>최신 경기부터 · 날짜를 누르면 박스스코어로 이동</p></div>${segmentedLinks('trends',trendState,'view',[['standard','기본 기록'],['expanded','상세 기록']],'표 항목')}</div>
    ${segmentedLinks('trends',trendState,'basis',[['gamelog','경기 성적 + 누적 비율'],['cumulative','전체 누적 기록'],['game','그 경기만']],'집계 기준')}
    <p class="log-explainer">${explainer}<span class="log-scroll-hint">← 각 표를 좌우로 밀어 전체 기록 보기 →</span></p>
    <div class="trend-player-tables log-tables">${series.map(s=>renderLogTable(s,cols)).join('')}</div>
    <p class="table-hint">각 표를 좌우로 스크롤하면 모든 기록을 볼 수 있습니다. @는 초 공격, vs는 말 공격입니다. —는 기록 또는 계산에 필요한 분모가 없다는 뜻입니다.</p>
    <section class="panel trend-panel"><div class="section-heading"><h2>기록 그래프 · ${basisLabel}</h2>${trendSelect('metric','그래프 지표',trendMetrics[mode].map(key=>[key,`${statName(key)} · ${trendMetricLabel(key,mode)}`]))}<div class="chart-legend">${series.map(s=>`<span class="player-key ${s.player.color}">${s.player.name}</span>`).join('')}</div></div>${renderTrendChart(series,metric)}<p class="table-hint">${trendMetricLabel(metric,mode)} · ${basisLabel} 추이. 점을 누르면 경기 상세로 이동합니다.${handNote}</p></section>
    <details class="panel stat-guide"><summary>스탯 계산 기준</summary>${statGuide}</details>
  </section>`;
  setActive('trends');
}

function badgeIcon(b) {
  const long=b.mark.length>2;
  return `<svg class="badge-icon" viewBox="0 0 64 64" aria-hidden="true"><path class="badge-shape" d="M32 3l25 14.5v29L32 61 7 46.5v-29z"/><path class="badge-inner" d="M32 9.5l19.5 11.25v22.5L32 54.5 12.5 43.25v-22.5z"/><text class="badge-mark${long?' is-long':''}" x="32" y="${long?37:38.5}" text-anchor="middle">${b.mark}</text></svg>`;
}
function badgeItem(b) {
  const [, month, day]=b.game?b.game.date.split('-').map(Number):[];
  const progress=b.progress&&!b.unlocked?`<div class="badge-progress"><div class="badge-bar" role="progressbar" aria-label="${b.title} 진행도" aria-valuemin="0" aria-valuemax="${b.progress.target}" aria-valuenow="${b.progress.value}"><span style="width:${Math.round(b.progress.value/b.progress.target*100)}%"></span></div><span>${b.progress.value}/${b.progress.target}</span></div>`:'';
  const state=b.unlocked?`<p class="badge-when">${b.game.no} · ${month}월 ${day}일 달성${b.count>1?` · <strong>${b.count}번 달성</strong>`:''}</p>`:progress||'<p class="badge-when is-waiting">아직 잠겨 있어요</p>';
  return `<li class="badge cat-${b.category} ${b.unlocked?'is-unlocked':'is-locked'}" data-badge="${b.id}">${badgeIcon(b)}<div class="badge-body"><p class="badge-cat">${b.categoryLabel}${b.unlocked?'':' · 잠김'}</p><h3>${b.title}</h3><p class="badge-desc">${b.desc}</p>${state}</div></li>`;
}
function renderBadges(query = '') {
  const requested=new URLSearchParams(query).get('player');
  const state={ player:['yunjae','younghun'].includes(requested)?requested:'yunjae' };
  const p=players[state.player], list=sortAchievements(computeAchievements(p.id,games));
  const done=list.filter(b=>b.unlocked).length, pct=Math.round(done/list.length*100), next=list.find(b=>!b.unlocked);
  const summary=`<section class="badge-summary ${p.color}" aria-label="${p.name} 도전과제 달성 현황"><div class="badge-summary-top"><span class="team-dot ${p.color}" aria-hidden="true">${p.initial}</span><strong>달성 ${done}/${list.length} (${pct}%)</strong><span>${p.name} · ${games.length}경기 기록 기준</span></div><div class="badge-bar" role="progressbar" aria-label="전체 달성률" aria-valuemin="0" aria-valuemax="${list.length}" aria-valuenow="${done}"><span style="width:${pct}%"></span></div>${next?`<p class="badge-next">다음 목표 · <strong>${next.title}</strong>${next.progress?` ${next.progress.value}/${next.progress.target}`:''}</p>`:''}</section>`;
  const segments=segmentedLinks('badges',state,'player',[['yunjae','윤재'],['younghun','영훈']],'선수 선택');
  const items=`<ol class="badge-list">${list.map(badgeItem).join('')}</ol>`;
  const note='배지는 기록된 경기 결과(타격·투구·이닝별 점수·플레이 기록)로만 계산합니다. 수비는 기록하지 않아 수비 배지는 없습니다. 달성 경기는 처음 조건을 채운 경기이고, 반복 배지는 조건을 채운 경기 수를 셉니다.';
  app.innerHTML=isPhone()
    ? `<section class="m-page badges-page"><header class="m-heading"><p class="eyebrow">FAMILY LEAGUE / ACHIEVEMENTS</p><h1>도전과제</h1><p class="m-sub">경기를 할 때마다 배지가 열려요.</p></header>${segments}${summary}${items}<p class="m-note">${note}</p></section>`
    : `<section class="container stats-page badges-page"><header class="stats-page-heading"><div><p class="eyebrow">FAMILY LEAGUE / ACHIEVEMENTS</p><h1>도전과제</h1><p class="subhead">경기를 할 때마다 배지가 열려요. 하나씩 모아 보세요.</p></div><span class="season-stamp">2026<span>SEASON</span></span></header>${segments}${summary}${items}<p class="stats-footnote">${note}</p></section>`;
  setActive('badges');
}

function formatDate(date) { const d = new Date(`${date}T00:00:00`); return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][d.getDay()]}`; }
function setActive(name) { document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.route===name)); }
function navigate() {
  const [path,query='']=location.hash.slice(1).split('?');
  const [name='schedule',id]=path.split('/');
  if(name==='game') renderGame(id); else if(name==='players') renderPlayers(query); else if(name==='player') renderPlayer(id); else if(name==='trends') renderTrends(query); else if(name==='parks') renderParks(); else if(name==='badges') renderBadges(query); else renderSchedule();
  if(name==='game' && new URLSearchParams(query).get('view')==='plays') { restoreTrendFocus=''; const plays=document.getElementById('game-plays'); plays?.querySelector?.('details')?.setAttribute('open',''); plays?.scrollIntoView({block:'start'}); }
  else if(restoreTrendFocus) { document.getElementById(restoreTrendFocus)?.focus({preventScroll:true}); restoreTrendFocus=''; }
  else window.scrollTo(0,0);
}

document.addEventListener('click', e => {
  const sortButton=e.target.closest('[data-stat-sort]');
  if(sortButton) {
    const key=sortButton.dataset.statSort;
    leadersState.dir=leadersState.sort===key?(leadersState.dir==='desc'?'asc':'desc'):['ERA','WHIP','BB9'].includes(key)?'asc':'desc';
    leadersState.sort=key;
    restoreTrendFocus=sortButton.id;
    location.hash=`players?${new URLSearchParams(leadersState)}`;
    return;
  }
  const routeBtn = e.target.closest('[data-route]'); if(routeBtn){ route(routeBtn.dataset.route); return; }
  const gameEl = e.target.closest('[data-game]'); if(gameEl){ route('game',gameEl.dataset.game); return; }
  const playerEl = e.target.closest('[data-player]'); if(playerEl){ route('player',playerEl.dataset.player); return; }
  const mode = e.target.closest('[data-mode]'); if(mode){ recordMode=mode.dataset.mode; navigate(); return; }
});
document.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && e.target.matches('[data-game],[data-player]')) e.target.click(); });
document.addEventListener('change', e => {
  const leaderKey=e.target.dataset.leaders;
  if(['period','hand','sort'].includes(leaderKey)) {
    leadersState[leaderKey]=e.target.value;
    if(leaderKey==='sort') leadersState.dir=['ERA','WHIP','BB9'].includes(e.target.value)?'asc':'desc';
    restoreTrendFocus=e.target.id;
    location.hash=`players?${new URLSearchParams(leadersState)}`;
    return;
  }
  const key=e.target.dataset.trend;
  if(!['player','mode','basis','hand','metric','period'].includes(key)) return;
  trendState[key]=e.target.value;
  if(key==='mode') { trendState.metric=trendMetrics[trendState.mode][0]; trendState.hand='all'; }
  restoreTrendFocus=e.target.id;
  location.hash=`trends?${new URLSearchParams(trendState)}`;
});
window.addEventListener('hashchange', navigate);
phoneQuery?.addEventListener('change', navigate);
navigate();
