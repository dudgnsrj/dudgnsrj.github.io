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
  },
  {
    id: '20260927-05', date: '2026-09-27', label: '9월 27일 일요일', no: 'GAME 05', innings: 3,
    away: { player: 'yunjae', runs: [0,0,3], R: 3, H: 6, E: 0, batting: { AB:19,R:3,H:6,'2B':2,HR:0,RBI:2,BB:0,HBP:0,SO:11 }, pitching: { hand:'R',IP:'2.0',H:3,R:0,ER:0,BB:1,SO:2,HR:0 } },
    home: { player: 'younghun', runs: [0,0,0], R: 0, H: 3, E: 1, batting: { AB:9,R:0,H:3,'2B':1,HR:0,RBI:0,BB:1,HBP:0,SO:2 }, pitching: { hand:'R',IP:'4.0',H:6,R:3,ER:1,BB:0,SO:11,HR:0 } },
    note: '3이닝 경기. 윤재가 3회초 2루타, 실책, 적시타로 3득점하며 3–0으로 승리했습니다. 영훈은 전 이닝 우완으로 던져 12아웃(4.0 IP) 중 11개를 삼진으로 잡았습니다. 윤재는 6아웃(2.0 IP) 무실점입니다. 3회초 3아웃 이후의 실책을 아웃으로 복원하면 이닝이 끝나므로 이후 2득점은 비자책점으로 처리했습니다. 실책 득점에는 타점을 부여하지 않아 윤재의 타점은 2개입니다.',
    plays: [
      ['1회','윤재','삼진 · 삼진 · 땅볼 · 삼진'],['1회','영훈','뜬공 · 안타 · 안타 · 삼진'],
      ['2회','윤재','삼진 · 삼진 · 삼진 · 번트안타 · 2루타 · 삼진'],['2회','영훈','볼넷 · 뜬공 · 2루타 · 뜬공'],
      ['3회','윤재','안타 · 삼진 · 안타 · 2루타(윤재 1–0 영훈) · 삼진 · 삼진 · 실책 출루(윤재 2–0 영훈) · 안타(윤재 3–0 영훈) · 삼진'],['3회','영훈','뜬공 · 삼진']
    ]
  },
  {
    id: '20261001-06', date: '2026-10-01', label: '10월 1일 목요일', no: 'GAME 06', innings: 4,
    away: { player: 'younghun', runs: [0,1,0,0], R: 1, H: 6, E: 0, batting: { AB:13,R:1,H:6,'2B':1,HR:0,RBI:1,BB:2,HBP:0,SO:1 }, pitching: { hand:'R',IP:'5.1',H:3,R:1,ER:1,BB:3,SO:11,HR:0 } },
    home: { player: 'yunjae', runs: [0,0,0,1], R: 1, H: 3, E: 0, batting: { AB:19,R:1,H:3,'2B':0,HR:0,RBI:1,BB:3,HBP:1,SO:11 }, pitching: { hand:'R',IP:'2.2',H:6,R:1,ER:1,BB:2,SO:1,HR:0 } },
    note: '4이닝 경기. 영훈이 2회초 적시타로 선취점을 냈고, 윤재가 4회말 적시타로 동점을 만들어 1–1 무승부로 마쳤습니다. 영훈은 우완 16아웃(5.1 IP), 11탈삼진, 1실점·1자책점이며 윤재는 8아웃(2.2 IP), 1실점·1자책점입니다. 4회초 병살은 타석 1개, 아웃 2개로 집계했습니다.',
    plays: [
      ['1회','영훈','삼진 · 2루타 · 뜬공'],['1회','윤재','삼진 · 삼진 · 볼넷 · 삼진 · 땅볼'],
      ['2회','영훈','안타 · 안타 · 땅볼(주자 1·3루) · 안타(영훈 1–0 윤재) · 볼넷 · 뜬공'],['2회','윤재','땅볼 · 번트안타 · 삼진 · 삼진 · 땅볼'],
      ['3회','영훈','뜬공 · 볼넷 · 안타 · 땅볼'],['3회','윤재','볼넷 · 삼진 · 삼진 · 볼넷 · 삼진 · 땅볼'],
      ['4회','영훈','안타 · 병살'],['4회','윤재','삼진 · 안타 · 사구 · 삼진 · 안타(1–1) · 삼진 · 직선타']
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
let restoreTrendFocus = '';

const route = (name, id = '') => { location.hash = id ? `${name}/${id}` : name; };
const player = id => players[id];
const outcome = game => game.away.R === game.home.R ? '무승부' : `${player(game.away.R > game.home.R ? game.away.player : game.home.player).name} 승`;

function renderSchedule() {
  const orderedGames = games.slice().sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  app.innerHTML = `<section class="container">
    <p class="eyebrow">FAMILY LEAGUE · 2026 SEASON</p><h1>경기 일정과 결과</h1><p class="subhead">우리 가족이 함께한 모든 경기를 한곳에 기록합니다.</p>
    <div class="schedule-summary"><strong>전체 ${orderedGames.length}경기</strong><span>최신 경기순</span></div>
    ${orderedGames.length ? `<div class="game-list">${orderedGames.map(gameCard).join('')}</div>` : '<div class="schedule-empty">아직 기록된 경기가 없습니다.</div>'}
    <div class="summary-strip"><div class="summary-stat"><strong>${games.length}</strong><span>총 경기</span></div><div class="summary-stat"><strong>${players.yunjae.pitching.W}–${players.yunjae.pitching.L}–${players.yunjae.pitching.T}</strong><span>윤재 승–패–무</span></div><div class="summary-stat"><strong>${games.reduce((total, g) => total + g.away.R + g.home.R, 0)}</strong><span>두 선수 총 득점</span></div></div>
  </section>`;
  setActive('schedule');
}

function gameCard(g) {
  const a = player(g.away.player), h = player(g.home.player);
  return `<article class="game-card" data-game="${g.id}" tabindex="0" role="button" aria-label="${formatDate(g.date)} ${a.name} 대 ${h.name} 경기 상세">
    <div class="game-meta"><span class="status">FINAL</span><time class="game-date" datetime="${g.date}">${g.date.replaceAll('-','.')}<small>${['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][new Date(`${g.date}T00:00:00`).getDay()]}</small></time><span class="game-no">${g.no} · ${g.innings}이닝</span></div>
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
      <section class="panel"><h2 class="panel-title">타자 기록 · 이 경기</h2>${boxTable(g,'batting',battingColumns)}<p class="table-hint">좌우로 스크롤하면 모든 기록을 볼 수 있습니다.</p></section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">투수 기록 · 이 경기</h2>${boxTable(g,'pitching',pitchingColumns)}<p class="table-hint">ERA·WHIP은 이 경기의 3아웃 환산 이닝 기준입니다.</p></section>
      <section class="panel" style="margin-top:22px"><h2 class="panel-title">경기 메모</h2><div class="rules"><p><strong>${g.note}</strong></p><p>가족 리그 특별 규칙: 윤재 공격은 이닝당 4아웃, 영훈 공격은 이닝당 2아웃으로 진행했습니다. 투수 IP는 전체 아웃카운트를 표준 3아웃제 이닝으로 환산했습니다.</p></div></section>
    </div><aside class="panel"><h2 class="panel-title">플레이 기록</h2><div class="play-list">${g.plays.map(p=>`<div class="inning"><div class="inning-head"><strong>${p[0]} ${p[1]} 공격</strong><span>${p[1]===a.name?'초':'말'}</span></div><p>${p[2]}</p></div>`).join('')}</div></aside></div>
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

function renderPlayers() {
  app.innerHTML = `<section class="container"><p class="eyebrow">PLAYER DIRECTORY</p><h1>선수 기록</h1><p class="subhead">타격과 투구, 두 분야의 기록을 확인하세요.</p><div class="players-grid">${Object.values(players).map(p=>`<article class="player-card ${p.color}" data-player="${p.id}" data-initial="${p.initial}" tabindex="0"><span class="number">PLAYER ${p.number}</span><h2>${p.name}</h2><p>${p.role} · 가족 리그 2026</p><div class="mini-stats"><div><strong>${p.batting.AVG}</strong><span>AVG</span></div><div><strong>${p.batting.HR}</strong><span>HR</span></div><div><strong>${p.pitching.ERA}</strong><span>ERA</span></div></div></article>`).join('')}</div></section>`;
  setActive('players');
}

function renderPlayer(id) {
  const p = player(id) || players.yunjae;
  const stats = recordMode === 'batting' ? p.batting : p.pitching;
  const logCols = recordMode === 'batting' ? battingColumns : pitchingColumns;
  const cols = recordMode === 'batting' ? ['G',...battingColumns] : ['G','W','L','T',...pitchingColumns];
  app.innerHTML = `<section class="container"><button class="back-btn" data-route="players">← 선수 목록</button><div class="profile-hero"><div class="profile-side ${p.color}" data-initial="${p.initial}"><strong>PLAYER ${p.number}</strong><span>영훈 × 윤재 FAMILY LEAGUE</span></div><div class="profile-main"><p class="eyebrow">TWO-WAY PLAYER</p><h1>${p.name}</h1><p class="bio">${p.role} · ${p.handedness} · 2026 가족 리그</p><div class="hero-stats"><div class="hero-stat"><strong>${p.batting.AVG}</strong><span>AVG</span></div><div class="hero-stat"><strong>${p.batting.HR}</strong><span>HR</span></div><div class="hero-stat"><strong>${p.pitching.ERA}</strong><span>ERA</span></div><div class="hero-stat"><strong>${p.pitching.SO}</strong><span>SO</span></div></div></div></div>
    <div class="record-tabs"><button class="record-tab ${recordMode==='batting'?'active':''}" data-mode="batting">타자</button><button class="record-tab ${recordMode==='pitching'?'active':''}" data-mode="pitching">투수</button></div>
    <section class="panel"><div class="record-table-wrap"><table class="record-table"><caption>${recordMode==='batting'?'타격':'투구'} 기록</caption><thead><tr><th class="season">시즌</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><td class="season">2026</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tbody><tfoot><tr><td class="season">통산</td>${cols.map(c=>`<td>${stats[c]}</td>`).join('')}</tr></tfoot></table></div></section>
    ${renderPitchingSplits(p)}
    <section class="panel game-log"><div class="section-heading"><h2>경기별 기록</h2><a class="text-link" href="#trends?player=${p.id}&mode=${recordMode}">기록 추이 보기 →</a></div><p class="table-hint">각 경기의 성적입니다. 날짜를 누르면 박스스코어로 이동합니다.</p><div class="record-table-wrap" tabindex="0" aria-label="경기별 상세 기록"><table class="record-table game-stats-table"><thead><tr><th scope="col">날짜</th><th scope="col">상대 / 구분</th>${logCols.map(statHeader).join('')}</tr></thead><tbody>${games.slice().reverse().map(g=>renderPlayerGameLog(g,p)).join('')}</tbody></table></div></section>
  </section>`;
  setActive('players');
}

const trendMetrics = { batting:['AVG','OBP','SLG','OPS','H','HR','RBI'], pitching:['ERA','WHIP','K9','BB9','SO','H','R'] };

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
    return { game, number:index+1, stats, played:lines.length > 0 };
  });
}

function readTrendState(query) {
  const params = new URLSearchParams(query);
  const mode = params.get('mode') === 'pitching' ? 'pitching' : 'batting';
  return {
    player:['yunjae','younghun'].includes(params.get('player')) ? params.get('player') : 'all',
    mode,
    basis:params.get('basis') === 'game' ? 'game' : 'cumulative',
    hand:mode === 'pitching' && ['R','L'].includes(params.get('hand')) ? params.get('hand') : 'all',
    metric:trendMetrics[mode].includes(params.get('metric')) ? params.get('metric') : trendMetrics[mode][0]
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
  const width=1000, height=360, left=64, right=42, top=26, bottom=62;
  const plotWidth=width-left-right, plotHeight=height-top-bottom;
  const rawStep=(Math.max(...values) || 1)*1.15/4;
  const magnitude=10**Math.floor(Math.log10(rawStep));
  const rateMetric=['AVG','OBP','SLG','OPS','ERA','WHIP','K9','BB9'].includes(metric);
  const step=rateMetric ? Math.ceil(rawStep/magnitude*4)/4*magnitude : Math.max(1,Math.ceil(rawStep));
  const maximum=step*4;
  const count=series[0].rows.length;
  const x=i=>count===1 ? left+plotWidth/2 : left+i*plotWidth/(count-1);
  const y=value=>top+plotHeight-(value/maximum)*plotHeight;
  const decimals=['AVG','OBP','SLG','OPS'].includes(metric) ? 3 : ['ERA','WHIP','K9','BB9'].includes(metric) ? 2 : 0;
  const grid=Array.from({length:5},(_,i)=>{
    const value=step*i, pos=y(value);
    return `<line x1="${left}" y1="${pos}" x2="${width-right}" y2="${pos}" stroke="#e2e7ec"/><text x="${left-12}" y="${pos+4}" text-anchor="end">${value.toFixed(decimals)}</text>`;
  }).join('');
  const labels=series[0].rows.map((row,i)=>`<text x="${x(i)}" y="${height-34}" text-anchor="middle">${row.game.date.slice(5).replace('-','/')}</text><text class="chart-game-number" x="${x(i)}" y="${height-15}" text-anchor="middle">${row.number}경기</text>`).join('');
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
  return `<div class="chart-scroll" tabindex="0" aria-label="${metric} 추이 그래프, 좌우 스크롤 가능"><svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="trend-chart-title trend-chart-desc"><title id="trend-chart-title">${trendMetricLabel(metric,trendState.mode)} ${trendState.basis === 'cumulative' ? '누적' : '경기별'} 추이</title><desc id="trend-chart-desc">가로축은 경기 순서, 세로축은 ${metric}입니다. 정확한 수치는 아래 표에서 확인할 수 있습니다. 그래프의 점을 누르면 경기 상세로 이동합니다.</desc>${grid}${labels}${lines}</svg></div>`;
}

function renderTrends(query = '') {
  trendState=readTrendState(query);
  const { mode, basis, hand, metric }=trendState;
  const ids=trendState.player === 'all' ? ['yunjae','younghun'] : [trendState.player];
  const series=ids.map(id=>({ player:players[id], color:id === 'yunjae' ? '#d95713' : '#08754c', rows:buildHistory(id,mode,basis,hand) }));
  const basisLabel=basis === 'cumulative' ? '누적' : '경기별';
  const cols=mode === 'batting' ? ['G',...battingColumns] : ['G',...pitchingColumns];
  const cards=series.map(s=>{
    const row=s.rows.slice().reverse().find(r=>r.stats);
    return `<div class="trend-summary ${s.player.color}"><span>${s.player.name} · ${basis === 'cumulative' ? '현재 누적' : '최근 경기'}</span><strong>${row?.stats?.[metric] ?? '—'} <small>${metric === 'K9' ? 'K/9' : metric === 'BB9' ? 'BB/9' : metric}</small></strong><p>${row ? `${row.game.date.replaceAll('-','.')} 기준 · ${row.stats.G}경기 집계` : '해당 투구 기록 없음'}</p></div>`;
  }).join('');
  const tableRows=series[0].rows.flatMap((_,index)=>series.map(s=>{
    const row=s.rows[index];
    return `<tr><th scope="row"><a href="#game/${row.game.id}">${row.number}경기 · ${row.game.date.slice(5).replace('-','/')}</a></th><td><span class="player-key ${s.player.color}">${s.player.name}</span>${row.played ? '' : '<small class="no-appearance">해당 손 미등판</small>'}</td>${cols.map(c=>`<td class="${c === metric ? 'selected-stat' : ''}">${row.stats?.[c] ?? '—'}</td>`).join('')}</tr>`;
  })).join('');
  app.innerHTML=`<section class="container"><p class="eyebrow">SEASON PROGRESS · 2026</p><h1>기록 추이</h1><p class="subhead">한 경기씩 쌓이는 기록, 두 선수의 변화를 함께 살펴보세요.</p>
    <div class="trend-controls">
      ${trendSelect('player','선수',[['all','두 선수 비교'],['yunjae','윤재'],['younghun','영훈']])}
      ${trendSelect('mode','분야',[['batting','타격'],['pitching','투구']])}
      ${trendSelect('basis','집계 기준',[['cumulative','경기 종료 시점 누적'],['game','그 경기만']])}
      ${mode === 'pitching' ? trendSelect('hand','투구 손',[['all','전체'],['R','우완'],['L','좌완']]) : ''}
      ${trendSelect('metric','그래프 지표',trendMetrics[mode].map(key=>[key,`${key === 'K9' ? 'K/9' : key === 'BB9' ? 'BB/9' : key} · ${trendMetricLabel(key,mode)}`]))}
    </div>
    <div class="trend-summaries">${cards}</div>
    <section class="panel trend-panel"><div class="section-heading"><h2>${trendMetricLabel(metric,mode)} · ${basisLabel}</h2><div class="chart-legend">${series.map(s=>`<span class="player-key ${s.player.color}">${s.player.name}</span>`).join('')}</div></div>${renderTrendChart(series,metric)}<p class="table-hint">점을 누르면 경기 상세로 이동합니다.${mode === 'pitching' && hand !== 'all' ? (basis === 'cumulative' ? ' 빈 점은 해당 손 미등판으로 누적 기록이 유지된 경기입니다.' : ' 해당 손으로 던지지 않은 경기에는 점을 표시하지 않습니다.') : ''}</p></section>
    <section class="panel trend-panel"><h2 class="panel-title">${basis === 'cumulative' ? '각 경기 종료 시점의 누적 기록' : '각 경기의 기록'}</h2><div class="record-table-wrap" tabindex="0" aria-label="${basisLabel} 기록 상세 표"><table class="record-table game-stats-table"><thead><tr><th scope="col">경기</th><th scope="col">선수</th>${cols.map(statHeader).join('')}</tr></thead><tbody>${tableRows}</tbody></table></div><p class="table-hint">좌우로 스크롤하면 모든 기록을 볼 수 있습니다. —는 기록 또는 계산에 필요한 분모가 없다는 뜻입니다.</p></section>
    <details class="panel stat-guide"><summary>스탯 계산 기준</summary><div class="rules"><p>AVG = 안타 ÷ 타수 · OBP = (안타 + 볼넷 + 사구) ÷ (타수 + 볼넷 + 사구 + 희생플라이) · SLG = 총 루타 ÷ 타수 · OPS = OBP + SLG</p><p>ERA = 자책점 × 27 ÷ 아웃 수 · WHIP = (피안타 + 볼넷) × 3 ÷ 아웃 수 · K/9 = 탈삼진 × 27 ÷ 아웃 수 · BB/9 = 볼넷 × 27 ÷ 아웃 수</p><p>투구 이닝은 3아웃 기준입니다. 3.1은 3⅓이닝, 3.2는 3⅔이닝입니다. 누적 비율은 경기별 비율의 평균이 아니라, 해당 시점까지의 원기록 합계로 다시 계산합니다. 좌·우완은 같은 선수의 투구 손에 따른 분류이며, 상대 타자의 타격 방향을 뜻하지 않습니다.</p></div></details>
  </section>`;
  setActive('trends');
}

function formatDate(date) { const d = new Date(`${date}T00:00:00`); return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${['일요일','월요일','화요일','수요일','목요일','금요일','토요일'][d.getDay()]}`; }
function setActive(name) { document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.route===name)); }
function navigate() {
  const [path,query='']=location.hash.slice(1).split('?');
  const [name='schedule',id]=path.split('/');
  if(name==='game') renderGame(id); else if(name==='players') renderPlayers(); else if(name==='player') renderPlayer(id); else if(name==='trends') renderTrends(query); else renderSchedule();
  if(restoreTrendFocus) { document.getElementById(restoreTrendFocus)?.focus({preventScroll:true}); restoreTrendFocus=''; }
  else window.scrollTo(0,0);
}

document.addEventListener('click', e => {
  const routeBtn = e.target.closest('[data-route]'); if(routeBtn){ route(routeBtn.dataset.route); return; }
  const gameEl = e.target.closest('[data-game]'); if(gameEl){ route('game',gameEl.dataset.game); return; }
  const playerEl = e.target.closest('[data-player]'); if(playerEl){ route('player',playerEl.dataset.player); return; }
  const mode = e.target.closest('[data-mode]'); if(mode){ recordMode=mode.dataset.mode; navigate(); return; }
});
document.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && e.target.matches('[data-game],[data-player]')) e.target.click(); });
document.addEventListener('change', e => {
  const key=e.target.dataset.trend;
  if(!['player','mode','basis','hand','metric'].includes(key)) return;
  trendState[key]=e.target.value;
  if(key==='mode') { trendState.metric=trendMetrics[trendState.mode][0]; trendState.hand='all'; }
  restoreTrendFocus=e.target.id;
  location.hash=`trends?${new URLSearchParams(trendState)}`;
});
window.addEventListener('hashchange', navigate);
navigate();
