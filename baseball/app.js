const players = {
  yunjae: {
    id: 'yunjae', name: '윤재', initial: 'Y', number: '01', role: '투수 · 타자', color: 'yunjae',
    handedness: '우투우타', batting: {}, pitching: {}
  },
  younghun: {
    id: 'younghun', name: '영훈', initial: 'H', number: '02', role: '투수 · 타자', color: 'younghun',
    handedness: '양손 투구 · 좌타', batting: {}, pitching: {}
  }
};

const games = [
  {
    id: '20260823-01', date: '2026-08-23', label: '8월 23일 일요일', no: 'GAME 01', innings: 9,
    away: { player: 'yunjae', runs: [1,1,0,2,0,1,0,1,3], R: 9, H: 18, E: 0, batting: { AB:51,R:9,H:18,'2B':2,HR:3,RBI:9,BB:0,HBP:2,SO:13 }, pitching: { IP:'6.0',H:12,R:4,ER:4,BB:3,SO:2,HR:0 } },
    home: { player: 'younghun', runs: [0,0,0,0,2,0,2,0,0], R: 4, H: 12, E: 0, batting: { AB:30,R:4,H:12,'2B':2,HR:0,RBI:4,BB:3,HBP:0,SO:2 }, pitching: { IP:'12.0',H:18,R:9,ER:9,BB:0,SO:13,HR:3 } },
    note: '윤재가 1회 선두 홈런으로 앞서간 뒤 4회와 9회 홈런을 더해 첫 승을 기록했습니다.',
    plays: [
      ['1회','윤재','홈런(1–0) · 삼진 · 안타 · 삼진 · 뜬공 · 직선타'],['1회','영훈','안타 · 파울플라이 · 안타 · 뜬공'],
      ['2회','윤재','안타 · 사구 · 병살(주자 3루) · 안타(2–0) · 안타 · 삼진 · 삼진'],['2회','영훈','파울플라이 · 삼진'],
      ['3회','윤재','삼진 · 삼진 · 안타 · 병살'],['3회','영훈','땅볼 · 내야플라이'],
      ['4회','윤재','직선타 · 땅볼 · 내야안타 · 직선타 · 홈런(4–0) · 안타 · 뜬공'],['4회','영훈','2루타 · 땅볼 · 안타 · 내야플라이'],
      ['5회','윤재','땅볼 · 땅볼 · 땅볼 · 삼진'],['5회','영훈','안타 · 안타 · 땅볼 · 안타(4–2) · 안타 · 볼넷 · 뜬공'],
      ['6회','윤재','안타 · 안타 · 삼진 · 땅볼 · 사구 · 안타(5–2) · 병살'],['6회','영훈','투수땅볼 · 땅볼'],
      ['7회','윤재','쓰리번트 · 삼진 · 땅볼 · 땅볼'],['7회','영훈','안타 · 안타 · 파울플라이 · 2루타(5–4) · 볼넷 · 뜬공'],
      ['8회','윤재','안타 · 삼진 · 2루타 · 땅볼(6–4) · 삼진 · 땅볼'],['8회','영훈','삼진 · 안타 · 땅볼'],
      ['9회','윤재','내야안타 · 홈런(8–4) · 땅볼 · 2루타 · 안타 · 삼진 · 땅볼(9–4) · 땅볼'],['9회','영훈','뜬공 · 볼넷 · 땅볼']
    ]
  },
  {
    id: '20260830-02', date: '2026-08-30', label: '8월 30일 일요일', no: 'GAME 02', innings: 9,
    away: { player: 'yunjae', runs: [1,0,0,1,0,1,2,0,0], R: 5, H: 16, E: 0, batting: { AB:51,R:5,H:16,'2B':2,HR:1,RBI:5,BB:0,HBP:3,SO:11 }, pitching: { IP:'6.0',H:13,R:5,ER:5,BB:5,SO:0,HR:1 } },
    home: { player: 'younghun', runs: [0,0,0,2,3,0,0,0,0], R: 5, H: 13, E: 0, batting: { AB:29,R:5,H:13,'2B':2,HR:1,RBI:5,BB:5,HBP:0,SO:0 }, pitching: { IP:'12.0',H:16,R:5,ER:5,BB:0,SO:11,HR:1 } },
    note: '영훈이 5회 5–2로 앞섰지만 윤재가 6·7회 추격해 5–5 동점을 만들었습니다.',
    plays: [
      ['1회','윤재','삼진 · 2루타 · 땅볼(주자 3루) · 땅볼(1–0) · 2루타 · 뜬공'],['1회','영훈','안타 · 뜬공 · 안타 · 땅볼'],
      ['2회','윤재','안타 · 안타 · 뜬공 · 땅볼 · 병살'],['2회','영훈','안타 · 병살'],
      ['3회','윤재','땅볼 · 삼진 · 삼진 · 안타 · 뜬공'],['3회','영훈','볼넷 · 볼넷 · 뜬공 · 뜬공'],
      ['4회','윤재','홈런(2–0) · 땅볼 · 안타 · 안타 · 땅볼 · 삼진 · 땅볼'],['4회','영훈','볼넷 · 볼넷 · 뜬공 · 안타 · 안타(2–1) · 안타(2–2) · 뜬공'],
      ['5회','윤재','삼진 · 뜬공 · 사구 · 삼진 · 땅볼'],['5회','영훈','2루타 · 2루타(2–3) · 뜬공 · 홈런(2–5) · 땅볼'],
      ['6회','윤재','사구 · 안타 · 안타 · 땅볼 · 뜬공 · 땅볼(3–5) · 삼진'],['6회','영훈','땅볼 · 안타 · 뜬공'],
      ['7회','윤재','땅볼 · 안타 · 삼진 · 안타 · 안타 · 사구(4–5) · 안타(5–5) · 삼진 · 땅볼'],['7회','영훈','뜬공 · 볼넷 · 안타 · 땅볼'],
      ['8회','윤재','땅볼 · 땅볼 · 땅볼 · 안타 · 땅볼'],['8회','영훈','뜬공 · 안타 · 땅볼'],
      ['9회','윤재','안타 · 삼진 · 땅볼(주자 2루) · 삼진 · 땅볼'],['9회','영훈','뜬공 · 땅볼']
    ]
  },
  {
    id: '20260906-03', date: '2026-09-06', label: '9월 6일 일요일', no: 'GAME 03', innings: 5,
    away: { player: 'younghun', runs: [0,0,0,0,0], R: 0, H: 5, E: 1, batting: { AB:15,R:0,H:5,'2B':1,HR:0,RBI:0,BB:5,HBP:0,SO:2 }, pitching: { IP:'6.1',H:7,R:1,ER:0,BB:0,SO:7,HR:0 } },
    home: { player: 'yunjae', runs: [0,0,0,0,1], R: 1, H: 7, E: 0, batting: { AB:27,R:1,H:7,'2B':0,HR:0,RBI:1,BB:0,HBP:1,SO:7 }, pitching: { IP:'3.1',H:5,R:0,ER:0,BB:5,SO:2,HR:0 } },
    note: '5이닝제 경기. 윤재가 5회말 끝내기 안타로 1–0 승리를 기록했습니다. 윤재는 10아웃(3.1 IP), 영훈은 끝내기 시점까지 19아웃(6.1 IP)을 잡았습니다. 5회말 실책 출루를 아웃으로 복원하면 결승타 전에 4아웃이 되므로 영훈의 1실점은 비자책점입니다.',
    plays: [
      ['1회','영훈','뜬공 · 땅볼'],['1회','윤재','땅볼 · 땅볼 · 안타 · 폭투로 2루 진출 · 땅볼 · 삼진'],
      ['2회','영훈','볼넷 · 안타 · 볼넷 · 뜬공 · 삼진'],['2회','윤재','땅볼 · 땅볼 · 안타 · 삼진 · 삼진'],
      ['3회','영훈','안타 · 파울플라이 · 볼넷 · 볼넷 · 삼진'],['3회','윤재','안타 · 삼진 · 땅볼 · 삼진 · 안타 · 삼진'],
      ['4회','영훈','안타 · 안타 · 직선타 아웃 · 땅볼'],['4회','윤재','땅볼 · 삼진 · 안타 · 땅볼 · 땅볼'],
      ['5회','영훈','땅볼 · 볼넷 · 2루타 · 뜬공'],['5회','윤재','안타 · 실책 출루 · 땅볼 · 뜬공 · 뜬공 · 몸맞는 공 · 끝내기 안타(영훈 0–1 윤재)']
    ]
  },
  {
    id: '20260920-04', date: '2026-09-20', label: '9월 20일 일요일', no: 'GAME 04', innings: 5,
    away: { player: 'yunjae', runs: [0,0,1,1,2], R: 4, H: 9, E: 0, batting: { AB:30,R:4,H:9,'2B':1,HR:0,RBI:4,BB:1,HBP:2,SO:7 }, pitching: { IP:'3.1',H:4,R:3,ER:3,BB:2,SO:0,HR:1 } },
    home: {
      player: 'younghun', runs: [0,0,0,3,0], R: 3, H: 4, E: 1,
      batting: { AB:14,R:3,H:4,'2B':0,HR:1,RBI:3,BB:2,HBP:0,SO:0 },
      pitching: { IP:'6.2',H:9,R:4,ER:3,BB:1,SO:7,HR:0 },
      pitchingStints: [
        { hand:'R', stint:'1회초~3회초 적시타까지', IP:'3.2',H:4,R:1,ER:0,BB:0,HBP:1,SO:4,HR:0 },
        { hand:'L', stint:'3회초 마지막 삼진~4회초', IP:'1.2',H:3,R:1,ER:1,BB:0,HBP:0,SO:2,HR:0 },
        { hand:'R', stint:'5회초', IP:'1.1',H:2,R:2,ER:2,BB:1,HBP:1,SO:1,HR:0 }
      ]
    },
    note: '5이닝제 경기. 영훈이 4회말 3점 홈런으로 역전했지만 윤재가 5회초 2득점해 4–3으로 승리했습니다. 영훈은 3회초 적시타 직후 좌완으로 전환했고, 5회초부터 다시 우완으로 던졌습니다. 우완 15아웃(5.0 IP), 좌완 5아웃(1.2 IP)입니다. 3회초 실책을 아웃으로 복원하면 적시타 전에 4아웃이 되므로 우완의 1실점은 비자책점으로 처리했습니다.',
    plays: [
      ['1회','윤재','땅볼 · 땅볼 · 땅볼 · 삼진'],['1회','영훈','땅볼 · 땅볼'],
      ['2회','윤재','안타 · 삼진 · 땅볼 · 사구 · 안타 · 삼진 · 땅볼'],['2회','영훈','땅볼 · 안타 · 볼넷 · 내야뜬공'],
      ['3회','윤재','땅볼 · 땅볼 · 2루타 · 실책 출루 · 삼진 · 안타(윤재 1–0 영훈) · 영훈 좌완 전환 · 삼진'],['3회','영훈','땅볼 · 뜬공'],
      ['4회','윤재','안타 · 삼진 · 땅볼(주자 2루) · 안타 · 안타(윤재 2–0 영훈) · 뜬공 · 땅볼'],['4회','영훈','볼넷 · 안타 · 땅볼 · 홈런(윤재 2–3 영훈) · 땅볼'],
      ['5회','윤재','영훈 우완 전환 · 뜬공 · 내야안타 · 볼넷 · 폭투로 주자 2·3루 · 땅볼(3–3) · 사구 · 삼진 · 내야안타(윤재 4–3 영훈) · 땅볼'],['5회','영훈','안타 · 뜬공 · 뜬공']
    ]
  }
];

// IP의 소수 부분은 십진수가 아닌 아웃 수(.1 = 1아웃, .2 = 2아웃)다.
function inningsToOuts(ip) {
  const [innings, outs = '0'] = String(ip).split('.');
  return Number(innings) * 3 + Number(outs);
}
function outsToInnings(outs) { return `${Math.floor(outs / 3)}.${outs % 3}`; }
function battingRate(value) { return value.toFixed(3).replace(/^0\./, '.'); }

const pitchingColumns = ['IP','H','R','ER','BB','HBP','SO','HR','ERA','WHIP'];
const handNames = { R: '우완', L: '좌완' };
function summarizePitching(lines) {
  const stats = { H:0, R:0, ER:0, BB:0, HBP:0, SO:0, HR:0 };
  let outs = 0;
  for (const line of lines) {
    outs += inningsToOuts(line.IP);
    for (const key of Object.keys(stats)) stats[key] += line[key] || 0;
  }
  return { ...stats, IP:outsToInnings(outs), ERA:outs ? (stats.ER * 27 / outs).toFixed(2) : '—', WHIP:outs ? ((stats.H + stats.BB) * 3 / outs).toFixed(2) : '—' };
}
function pitchingStints(side, opponent) {
  // 이전 세 경기는 우완. 좌·우 전환이 있는 경기는 구간별 기록을 사용한다.
  return side.pitchingStints || [{ hand:'R', ...side.pitching, HBP:opponent.batting.HBP || 0 }];
}
function splitPitching(stints) {
  return ['R','L'].filter(hand => stints.some(s => s.hand === hand)).map(hand => ({ hand, ...summarizePitching(stints.filter(s => s.hand === hand)) }));
}

// 경기별 기록에서 통산 기록을 계산해 경기 추가와 이닝 보정이 모든 화면에 반영되도록 한다.
for (const p of Object.values(players)) {
  const batting = { G: 0, PA: 0, AB: 0, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 0, HBP: 0, SO: 0, SF: 0, SH: 0 };
  const pitching = { G: 0, W: 0, L: 0, T: 0, H: 0, R: 0, ER: 0, BB: 0, SO: 0, HR: 0 };
  let outs = 0;
  const handLines = { R: [], L: [] };
  const handGames = { R: 0, L: 0 };
  for (const game of games) {
    const side = game.away.player === p.id ? game.away : game.home;
    const opponent = side === game.away ? game.home : game.away;
    batting.G++;
    for (const key of ['AB','R','H','2B','3B','HR','RBI','BB','HBP','SO','SF','SH']) batting[key] += side.batting[key] || 0;
    pitching.G++;
    pitching[side.R > opponent.R ? 'W' : side.R < opponent.R ? 'L' : 'T']++;
    for (const key of ['H','R','ER','BB','SO','HR']) pitching[key] += side.pitching[key];
    outs += inningsToOuts(side.pitching.IP);
    const stints = pitchingStints(side, opponent);
    for (const hand of ['R','L']) {
      const lines = stints.filter(s => s.hand === hand);
      handLines[hand].push(...lines);
      if (lines.length) handGames[hand]++;
    }
  }
  batting.PA = batting.AB + batting.BB + batting.HBP + batting.SF + batting.SH;
  const totalBases = batting.H + batting['2B'] + 2 * batting['3B'] + 3 * batting.HR;
  const obp = (batting.H + batting.BB + batting.HBP) / (batting.PA - batting.SH || 1);
  const slg = totalBases / (batting.AB || 1);
  Object.assign(batting, { AVG: battingRate(batting.H / (batting.AB || 1)), OBP: battingRate(obp), SLG: battingRate(slg), OPS: battingRate(obp + slg) });
  Object.assign(pitching, { IP: outsToInnings(outs), ERA: outs ? (pitching.ER * 27 / outs).toFixed(2) : '—', WHIP: outs ? ((pitching.H + pitching.BB) * 3 / outs).toFixed(2) : '—' });
  p.batting = batting;
  p.pitching = pitching;
  p.pitchingSplits = ['R','L'].filter(hand => handGames[hand]).map(hand => ({ hand, G:handGames[hand], ...summarizePitching(handLines[hand]) }));
}

const app = document.querySelector('#app');
let selectedDate = games[games.length - 1].date;
let recordMode = 'batting';

const route = (name, id = '') => { location.hash = id ? `${name}/${id}` : name; };
const player = id => players[id];
const outcome = game => game.away.R === game.home.R ? '무승부' : `${player(game.away.R > game.home.R ? game.away.player : game.home.player).name} 승`;

function renderSchedule() {
  const onDate = games.filter(g => g.date === selectedDate);
  app.innerHTML = `<section class="container">
    <p class="eyebrow">FAMILY LEAGUE · 2026 SEASON</p><h1>경기 일정과 결과</h1><p class="subhead">우리 가족이 함께한 모든 경기를 한곳에 기록합니다.</p>
    <div class="date-bar"><button class="date-arrow" data-date-step="-1" aria-label="이전 경기">‹</button><div class="date-title">${formatDate(selectedDate)}<span>GAME DAY</span></div><button class="date-arrow" data-date-step="1" aria-label="다음 경기">›</button></div>
    ${onDate.length ? `<div class="game-list">${onDate.map(gameCard).join('')}</div>` : '<div class="date-empty">이 날짜에는 기록된 경기가 없습니다.</div>'}
    <div class="summary-strip"><div class="summary-stat"><strong>${games.length}</strong><span>총 경기</span></div><div class="summary-stat"><strong>${players.yunjae.pitching.W}–${players.yunjae.pitching.L}–${players.yunjae.pitching.T}</strong><span>윤재 승–패–무</span></div><div class="summary-stat"><strong>${games.reduce((total, g) => total + g.away.R + g.home.R, 0)}</strong><span>두 선수 총 득점</span></div></div>
  </section>`;
  setActive('schedule');
}

function gameCard(g) {
  const a = player(g.away.player), h = player(g.home.player);
  return `<article class="game-card" data-game="${g.id}" tabindex="0" aria-label="${a.name} 대 ${h.name} 경기 상세">
    <div class="game-meta"><span class="status">FINAL</span><span class="game-no">${g.no}</span></div>
    <div class="matchup"><div class="team-row"><span class="team-dot ${a.color}">${a.initial}</span><span class="team-name">${a.name}<small>AWAY · 초 공격</small></span><span class="score">${g.away.R}</span></div><div class="team-row"><span class="team-dot ${h.color}">${h.initial}</span><span class="team-name">${h.name}<small>HOME · 말 공격</small></span><span class="score">${g.home.R}</span></div></div>
    <div class="game-result"><div><strong>${outcome(g)}</strong><span>박스스코어 보기 →</span></div></div>
  </article>`;
}

function renderGame(id) {
  const g = games.find(x => x.id === id) || games[1], a = player(g.away.player), h = player(g.home.player);
  const inningHeaders = Array.from({length:g.innings},(_,i)=>`<th>${i+1}</th>`).join('');
  const row = side => `<tr><td>${player(g[side].player).name}</td>${g[side].runs.map(x=>`<td>${x}</td>`).join('')}<td class="total">${g[side].R}</td><td class="total">${g[side].H}</td><td class="total">${g[side].E}</td></tr>`;
  app.innerHTML = `<section class="container"><button class="back-btn" data-route="schedule">← 경기 목록</button>
    <div class="scoreboard"><div class="scoreboard-head"><strong>${g.no} · FINAL</strong><span>${g.label}</span></div><div class="line-scroll"><table class="line-score"><thead><tr><th>TEAM</th>${inningHeaders}<th class="total">R</th><th class="total">H</th><th class="total">E</th></tr></thead><tbody>${row('away')}${row('home')}</tbody></table></div><div class="final-call"><span>경기 종료</span><strong>${a.name} ${g.away.R} — ${g.home.R} ${h.name}</strong></div></div>
    <div class="detail-grid"><div>
      <section class="panel"><h2 class="panel-title">타자 기록</h2>${boxTable(g,'batting',['AB','R','H','2B','HR','RBI','BB','HBP','SO'])}</section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">투수 기록</h2>${boxTable(g,'pitching',['IP','H','R','ER','BB','SO','HR'])}</section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">경기 메모</h2><div class="rules"><p><strong>${g.note}</strong></p><p>가족 리그 특별 규칙: 윤재 공격은 이닝당 4아웃, 영훈 공격은 이닝당 2아웃으로 진행했습니다. 투수 IP는 전체 아웃카운트를 표준 3아웃제 이닝으로 환산했습니다.</p></div></section>
    </div><aside class="panel"><h2 class="panel-title">플레이 기록</h2><div class="play-list">${g.plays.map(p=>`<div class="inning"><div class="inning-head"><strong>${p[0]} ${p[1]} 공격</strong><span>${p[1]===a.name?'초':'말'}</span></div><p>${p[2]}</p></div>`).join('')}</div></aside></div>
  </section>`;
  setActive('schedule');
}

function boxTable(g, mode, cols) {
  const rows = ['away','home'].flatMap(s => {
    const side = g[s];
    const rows = [{ label:player(side.player).name, stats:side[mode] }];
    if (mode === 'pitching' && side.pitchingStints) {
      rows[0].label += ' (합계)';
      for (const line of splitPitching(side.pitchingStints)) rows.push({ label:`↳ ${handNames[line.hand]}`, stats:line });
    }
    return rows;
  });
  return `<div class="record-table-wrap"><table class="box-table"><thead><tr><th>선수</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr><td>${row.label}</td>${cols.map(c=>`<td>${row.stats[c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderPitchingSplits(p) {
  if (recordMode !== 'pitching' || p.pitchingSplits.length < 2) return '';
  const cols = ['G', ...pitchingColumns];
  return `<section class="panel game-log"><div class="record-table-wrap"><table class="record-table"><caption>좌완 · 우완 통산 기록</caption><thead><tr><th class="season">투구 손</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${p.pitchingSplits.map(line=>`<tr><td class="season">${handNames[line.hand]}</td>${cols.map(c=>`<td>${line[c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="rules"><p>한 경기에서 양손으로 던지면 양쪽 G에 각각 1경기로 집계합니다. IP는 실제 아웃 수를 3아웃제 이닝으로 환산하며, 승패는 선수 전체 기록에만 집계합니다.</p></div></section>`;
}

function renderPlayerGameLog(g, p) {
  const side = g.away.player === p.id ? g.away : g.home;
  const opponent = side === g.away ? g.home : g.away;
  const line = side[recordMode];
  const summary = recordMode === 'batting' ? `${line.H}H · ${line.R}R · ${line.HR}HR` : `${line.IP}IP · ${line.SO}K · ${line.R}R`;
  const totalRow = `<div class="log-row" data-game="${g.id}"><time>${g.date.replaceAll('-','.')}</time><strong>vs ${player(opponent.player).name}</strong><span>${summary}</span></div>`;
  if (recordMode !== 'pitching' || !side.pitchingStints) return totalRow;
  return totalRow + splitPitching(side.pitchingStints).map(split=>`<div class="log-row" data-game="${g.id}"><time>↳ 투구 손별</time><strong>${handNames[split.hand]}</strong><span>${split.IP}IP · ${split.SO}K · ${split.R}R</span></div>`).join('');
}

function renderPlayers() {
  app.innerHTML = `<section class="container"><p class="eyebrow">PLAYER DIRECTORY</p><h1>선수 기록</h1><p class="subhead">타격과 투구, 두 분야의 기록을 확인하세요.</p><div class="players-grid">${Object.values(players).map(p=>`<article class="player-card ${p.color}" data-player="${p.id}" data-initial="${p.initial}" tabindex="0"><span class="number">PLAYER ${p.number}</span><h2>${p.name}</h2><p>${p.role} · 가족 리그 2026</p><div class="mini-stats"><div><strong>${p.batting.AVG}</strong><span>AVG</span></div><div><strong>${p.batting.HR}</strong><span>HR</span></div><div><strong>${p.pitching.ERA}</strong><span>ERA</span></div></div></article>`).join('')}</div></section>`;
  setActive('players');
}

function renderPlayer(id) {
  const p = player(id) || players.yunjae;
  const stats = recordMode === 'batting' ? p.batting : p.pitching;
  const cols = recordMode === 'batting' ? ['G','PA','AB','R','H','2B','HR','RBI','BB','HBP','SO','AVG','OBP','SLG','OPS'] : ['G','W','L','T','IP','H','R','ER','BB','SO','HR','ERA','WHIP'];
  app.innerHTML = `<section class="container"><button class="back-btn" data-route="players">← 선수 목록</button><div class="profile-hero"><div class="profile-side ${p.color}" data-initial="${p.initial}"><strong>PLAYER ${p.number}</strong><span>영훈 × 윤재 FAMILY LEAGUE</span></div><div class="profile-main"><p class="eyebrow">TWO-WAY PLAYER</p><h1>${p.name}</h1><p class="bio">${p.role} · ${p.handedness} · 2026 가족 리그</p><div class="hero-stats"><div class="hero-stat"><strong>${p.batting.AVG}</strong><span>AVG</span></div><div class="hero-stat"><strong>${p.batting.HR}</strong><span>HR</span></div><div class="hero-stat"><strong>${p.pitching.ERA}</strong><span>ERA</span></div><div class="hero-stat"><strong>${p.pitching.SO}</strong><span>SO</span></div></div></div></div>
    <div class="record-tabs"><button class="record-tab ${recordMode==='batting'?'active':''}" data-mode="batting">타자</button><button class="record-tab ${recordMode==='pitching'?'active':''}" data-mode="pitching">투수</button></div>
    <section class="panel"><div class="record-table-wrap"><table class="record-table"><caption>${recordMode==='batting'?'타격':'투구'} 기록</caption><thead><tr><th class="season">시즌</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><td class="season">2026</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tbody><tfoot><tr><td class="season">통산</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tfoot></table></div></section>
    ${renderPitchingSplits(p)}
    <section class="panel game-log"><h2 class="panel-title">경기별 기록</h2>${games.slice().reverse().map(g=>renderPlayerGameLog(g,p)).join('')}</section>
  </section>`;
  setActive('players');
}

function formatDate(date) { const d = new Date(`${date}T00:00:00`); return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][d.getDay()]}`; }
function setActive(name) { document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.route===name)); }
function navigate() { const [name='schedule',id] = location.hash.slice(1).split('/'); if(name==='game') renderGame(id); else if(name==='players') renderPlayers(); else if(name==='player') renderPlayer(id); else renderSchedule(); window.scrollTo(0,0); }

document.addEventListener('click', e => {
  const routeBtn = e.target.closest('[data-route]'); if(routeBtn){ route(routeBtn.dataset.route); return; }
  const gameEl = e.target.closest('[data-game]'); if(gameEl){ route('game',gameEl.dataset.game); return; }
  const playerEl = e.target.closest('[data-player]'); if(playerEl){ route('player',playerEl.dataset.player); return; }
  const mode = e.target.closest('[data-mode]'); if(mode){ recordMode=mode.dataset.mode; navigate(); return; }
  const step = e.target.closest('[data-date-step]'); if(step){ const idx=games.findIndex(g=>g.date===selectedDate); const next=Math.max(0,Math.min(games.length-1,idx+Number(step.dataset.dateStep))); selectedDate=games[next].date; renderSchedule(); }
});
document.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && e.target.matches('[data-game],[data-player]')) e.target.click(); });
window.addEventListener('hashchange', navigate);
navigate();
