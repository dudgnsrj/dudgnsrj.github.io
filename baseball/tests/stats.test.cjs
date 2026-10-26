// Run with: node baseball/tests/stats.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = { innerHTML: '' };
const listeners = {};
let scrolledElement = '';
const context = {
  document: {
    querySelector: () => app,
    querySelectorAll: () => [],
    getElementById: id => ({ focus() {}, scrollIntoView() { scrolledElement = id; } }),
    addEventListener: (type, handler) => { listeners[type] = handler; }
  },
  window: { addEventListener() {}, scrollTo() {} },
  location: { hash: '#players' },
  URLSearchParams
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../sabermetrics.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8'), context);
const run = expression => vm.runInContext(expression, context);
const data = expression => JSON.parse(JSON.stringify(run(expression)));
const periods = data('periodOptions().map(([value])=>value)');
const modes = ['batting', 'pitching'];
const ids = ['yunjae', 'younghun'];
const allGames = data('games');
const expectedVenues = {
  '20260823-01':'208동 놀이터', '20260830-02':'208동 놀이터', '20260906-03':'KIMM',
  '20260920-04':'서당골근린공원', '20260927-05':'서당골근린공원',
  '20261001-06':'어린이집 풋살장', '20261003-07':'208동 놀이터',
  '20261004-08':'208동 놀이터', '20261009-09':'서당골근린공원', '20261025-10':'208동 놀이터'
};
for (const [id, venue] of Object.entries(expectedVenues)) {
  assert.equal(allGames.find(g=>g.id===id).venue,venue);
  run(`renderGame('${id}')`);
  assert(app.innerHTML.includes(`<span>경기장</span>${venue}`));
}
assert(run('renderVenue({})').includes('미등록'));
const originalData = JSON.stringify(allGames);
// 2026-10-04: four outs per top half, two per bottom half; 1–1 after three.
const october4=allGames.find(g=>g.id==='20261004-08');
assert.equal(october4.innings,3);
assert.equal(october4.away.player,'yunjae');
assert.equal(october4.home.player,'younghun');
assert.deepEqual(october4.away.runs,[0,0,1]);
assert.deepEqual(october4.home.runs,[0,1,0]);
assert.deepEqual(october4.away.batting,{AB:15,R:1,H:3,'2B':0,HR:0,RBI:1,BB:2,HBP:0,SO:7});
assert.deepEqual(october4.home.batting,{AB:9,R:1,H:3,'2B':1,HR:0,RBI:1,BB:3,HBP:0,SO:1});
for(const [key,outs,strikeouts,walks] of [['away',6,1,3],['home',12,7,2]]) {
  const p=october4[key].pitching;
  assert.equal(run(`inningsToOuts('${p.IP}')`),outs);
  assert.equal(p.SO,strikeouts);
  assert.equal(p.BB,walks);
  assert.equal(p.H,3);
  assert.equal(p.R,1);
  assert.equal(p.ER,1);
}
assert.equal(october4.plays.length,6);
// 2026-10-09: Younghun bats top (2 outs), Yunjae bottom (4 outs); Yunjae wins 6–4, bottom 6th not played.
const october9=allGames.find(g=>g.id==='20261009-09');
assert.equal(october9.innings,6);
assert.equal(october9.away.player,'younghun');
assert.equal(october9.home.player,'yunjae');
assert.deepEqual(october9.away.runs,[0,0,0,0,1,3]);
assert.deepEqual(october9.home.runs,[0,0,2,2,2,'X']);
assert.deepEqual(october9.away.batting,{AB:20,R:4,H:9,'2B':5,'3B':1,HR:1,RBI:4,BB:1,HBP:0,SO:2,SF:1});
assert.deepEqual(october9.home.batting,{AB:30,R:6,H:9,'2B':3,HR:1,RBI:6,BB:3,HBP:1,SO:7});
for (const [key,outs,strikeouts,walks,hits,runs,earned] of [['away',20,7,3,9,6,5],['home',12,2,1,9,4,4]]) {
  const p=october9[key].pitching;
  assert.equal(run(`inningsToOuts('${p.IP}')`),outs);
  assert.equal(p.SO,strikeouts); assert.equal(p.BB,walks); assert.equal(p.H,hits); assert.equal(p.R,runs); assert.equal(p.ER,earned);
}
for (const key of ['away','home']) assert.equal(october9[key].runs.filter(r=>typeof r==='number').reduce((a,b)=>a+b,0),october9[key].R);
assert.equal(october9.plays.length,11);
run(`renderGame('20261009-09')`);
assert(app.innerHTML.includes('<td class="">X</td>'));
// 2026-10-25: Younghun bats top (2 outs), Yunjae bottom (4 outs); Younghun wins 4–3 on a bases-loaded walk in the 3rd.
const october25=allGames.find(g=>g.id==='20261025-10');
assert.equal(october25.innings,3);
assert.equal(october25.away.player,'younghun');
assert.equal(october25.home.player,'yunjae');
assert.deepEqual(october25.away.runs,[3,0,1]);
assert.deepEqual(october25.home.runs,[3,0,0]);
assert.deepEqual(october25.away.batting,{AB:11,R:4,H:5,'2B':0,HR:0,RBI:4,BB:7,HBP:0,SO:0});
assert.deepEqual(october25.home.batting,{AB:15,R:3,H:3,'2B':0,HR:1,RBI:3,BB:2,HBP:0,SO:8});
for (const [key,outs,strikeouts,walks,hits,runs,earned] of [['away',12,8,2,3,3,3],['home',6,0,7,5,4,4]]) {
  const p=october25[key].pitching;
  assert.equal(run(`inningsToOuts('${p.IP}')`),outs);
  assert.equal(p.SO,strikeouts); assert.equal(p.BB,walks); assert.equal(p.H,hits); assert.equal(p.R,runs); assert.equal(p.ER,earned);
}
for (const key of ['away','home']) assert.equal(october25[key].runs.reduce((a,b)=>a+b,0),october25[key].R);
assert.equal(october25.plays.length,6);
let checks = 0;

for (const id of ids) {
  for (const mode of modes) {
    const aggregate = data(`aggregateRecords('${id}','${mode}','all',games)`);
    const season = data(`players.${id}.${mode}`);
    for (const [key, value] of Object.entries(season)) assert.equal(aggregate[key], value, `${id} ${mode} ${key}`);
  }
}
assert.equal(run("aggregateRecords('younghun','pitching','L',games).IP"), '1.2');
assert.equal(run("aggregateRecords('younghun','pitching','L',games).G"), 1);
assert.equal(run("aggregateRecords('younghun','pitching','L',games).W"), '—');
assert.equal(run("aggregateRecords('yunjae','pitching','L',games)"), null);

for (const mode of modes) for (const view of ['standard', 'expanded']) {
  const columns = data(`leaderColumns.${mode}.${view}`);
  for (const period of periods) for (const hand of mode === 'pitching' ? ['all', 'R', 'L'] : ['all']) {
    for (const sort of columns) for (const dir of ['asc', 'desc']) {
      const query = new URLSearchParams({mode, view, period, hand, sort, dir}).toString();
      run(`renderPlayers('${query}')`);
      const rows = data('rankedLeaders(leadersState)');
      assert.equal(rows.length, 2);
      assert(!/undefined|NaN/.test(app.innerHTML));
      const values = rows.map(row => row.stats?.[sort]).filter(v => v != null && v !== '—').map(Number);
      if (values.length === 2) assert(dir === 'asc' ? values[0] <= values[1] : values[0] >= values[1]);
      if (!rows[0].stats) assert.equal(rows[1].stats, null);
      assert(app.innerHTML.includes(`aria-sort="${dir === 'asc' ? 'ascending' : 'descending'}"`));
      checks++;
    }
  }
}

for (const mode of modes) for (const basis of ['gamelog', 'cumulative', 'game']) {
  for (const period of periods) for (const hand of mode === 'pitching' ? ['all', 'R', 'L'] : ['all']) {
    for (const id of ids) {
      const rows = data(`buildLogSeries('${id}','${mode}','${basis}','${hand}','${period}')`);
      const cumulative = data(`buildHistory('${id}','${mode}','cumulative','${hand}')`);
      const selectedGames = data(`periodGames('${period}')`);
      assert.equal(rows.length, selectedGames.length);
      for (const row of rows) {
        const cumulativeRow = cumulative.find(r => r.game.id === row.game.id);
        const side = row.game.away.player === id ? row.game.away : row.game.home;
        assert.equal(row.game.id, selectedGames[rows.indexOf(row)].id);
        if (basis === 'gamelog') {
          const rates = mode === 'batting' ? ['AVG', 'OBP', 'SLG', 'OPS'] : ['ERA', 'WHIP', 'K9', 'BB9'];
          for (const key of rates) assert.equal(row.stats?.[key] ?? '—', cumulativeRow.stats?.[key] ?? '—');
          if (mode === 'batting') assert.equal(row.stats.AB, side.batting.AB);
          else assert.equal(row.stats?.IP, row.gameStats?.IP);
        } else assert.deepEqual(row.stats && {...row.stats, TB: undefined}, (basis === 'cumulative' ? cumulativeRow.stats : row.gameStats) && {...(basis === 'cumulative' ? cumulativeRow.stats : row.gameStats), TB: undefined});
      }
    }
    for (const player of ['all', ...ids]) for (const view of ['standard', 'expanded']) {
      for (const metric of data(`trendMetrics.${mode}`)) {
        const query = new URLSearchParams({mode, basis, period, hand, player, view, metric}).toString();
        run(`renderTrends('${query}')`);
        assert(!/undefined|NaN/.test(app.innerHTML));
        const tables = [...app.innerHTML.matchAll(/<table[^>]+aria-labelledby="trend-table-(\w+)">([\s\S]*?)<\/table>/g)];
        assert.deepEqual(tables.map(t => t[1]), player === 'all' ? ids : [player]);
        const expected = data(`periodGames('${period}').map(g=>g.id).reverse()`);
        for (const table of tables) {
          assert.deepEqual([...table[2].matchAll(/data-log-game="([^"]+)"/g)].map(m => m[1]), expected);
          assert(table[2].includes('월 합계'));
          assert(table[2].includes('결과'));
        }
        checks++;
      }
    }
  }
}

// October filtering must retain September's left-handed cumulative rates.
const leftOctober = data("buildLogSeries('younghun','pitching','gamelog','L','2026-10')");
assert(leftOctober.every(row => !row.played && row.stats.ERA === '5.40' && row.stats.IP === undefined));
assert.equal(run("readTrendState('mode=bad&basis=bad&period=bad&player=bad').basis"), 'gamelog');
assert.equal(run("readLeaderState('sort=bad&period=bad').sort"), 'AVG');

// Event wiring: sort toggles and URL state are retained on filter changes.
run('renderPlayers()');
const target = {closest: selector => selector === '[data-stat-sort]' ? {dataset:{statSort:'AVG'},id:'sort-AVG'} : null};
listeners.click({target});
assert(context.location.hash.includes('dir=asc'));
listeners.change({target:{dataset:{leaders:'period'},value:'last3',id:'leaders-period'}});
assert(context.location.hash.includes('period=last3'));
run('renderTrends()');
listeners.change({target:{dataset:{trend:'player'},value:'younghun',id:'trend-player'}});
assert(context.location.hash.includes('player=younghun'));

for (const game of allGames) { run(`renderGame('${game.id}')`); assert(!/undefined|NaN/.test(app.innerHTML)); }
for (const id of ids) for (const mode of modes) { run(`recordMode='${mode}'; renderPlayer('${id}')`); assert(!/undefined|NaN/.test(app.innerHTML)); }
run('renderSchedule()');
const orderedGames = [...allGames].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
assert.deepEqual([...app.innerHTML.matchAll(/data-score-game="([^"]+)"/g)].map(m=>m[1]), orderedGames.map(g=>g.id));
assert.equal((app.innerHTML.match(/class="score-card"/g)||[]).length, allGames.length);
for (const game of allGames) {
  const card = run(`gameCard(games.find(g=>g.id==='${game.id}'))`);
  assert(card.includes(`href="#game/${game.id}"`));
  assert(card.includes(`href="#game/${game.id}?view=plays"`));
  assert(card.includes(`FINAL / ${game.innings}`));
  assert(card.includes(`<span>경기장</span>${game.venue || '미등록'}`));
  assert(!card.includes('role="button"')); // Native links and disclosures remain independently operable.
  const tableRows = [...card.match(/<table class="card-score-table">([\s\S]*?)<\/table>/)[1].matchAll(/<tr class="score-team ([^"]+)">([\s\S]*?)<\/tr>/g)];
  assert.equal(tableRows.length,2);
  ['away','home'].forEach((key,index)=>{
    const side=game[key],opponent=game[key==='away'?'home':'away'];
    assert.deepEqual([...tableRows[index][2].matchAll(/<td[^>]*>(\d+)<\/td>/g)].map(m=>Number(m[1])),[side.R,side.H,side.E]);
    assert.equal(tableRows[index][1],side.R>opponent.R?'win':side.R<opponent.R?'loss':'draw');
    assert(card.includes(`${side.pitching.IP} IP · ${side.pitching.SO} K`));
    const actual=data(`recordAtGame('${side.player}',games.find(g=>g.id==='${game.id}'))`);
    const expected={W:0,L:0,T:0};
    for(const prior of allGames.filter(g=>g.date<game.date||(g.date===game.date&&g.id<=game.id))) {
      const self=prior.away.player===side.player?prior.away:prior.home,other=self===prior.away?prior.home:prior.away;
      expected[self.R>other.R?'W':self.R<other.R?'L':'T']++;
    }
    assert.deepEqual(actual,expected);
  });
  const lines=run(`resultLinescore(games.find(g=>g.id==='${game.id}'))`);
  assert.equal((lines.match(/scope="col"/g)||[]).length,game.innings+4);
  assert.equal((lines.match(/scope="row"/g)||[]).length,2);
}
context.location.hash=`#game/${allGames.at(-1).id}?view=plays`;
run('navigate()');
assert.equal(scrolledElement,'game-plays');

// 도전과제: facts hand-checked against the recorded games.
const badgesOf = id => Object.fromEntries(data(`computeAchievements('${id}',games)`).map(b=>[b.id,b]));
const yunjaeBadges = badgesOf('yunjae'), younghunBadges = badgesOf('younghun');
for (const list of [yunjaeBadges, younghunBadges]) assert(Object.keys(list).length >= 20 && Object.keys(list).length <= 28);
assert.equal(yunjaeBadges['first-hr'].game.no, 'GAME 01'); // 윤재 1회 선두 홈런.
assert.equal(younghunBadges['first-hr'].game.no, 'GAME 02'); // 영훈 5회 홈런(2–5).
assert.equal(younghunBadges['first-triple'].game.no, 'GAME 09'); // 유일한 3루타.
assert.equal(yunjaeBadges['first-triple'].unlocked, false);
assert.equal(yunjaeBadges['no-strikeout'].unlocked, false); // 윤재는 모든 경기에서 삼진이 있었다.
assert.equal(yunjaeBadges['k-10'].unlocked, false);
assert.equal(yunjaeBadges.comeback.game.no, 'GAME 04'); // 4회말 2–3으로 뒤진 뒤 5회초 4–3.
assert.equal(younghunBadges.comeback.unlocked, false);
assert.equal(yunjaeBadges['walk-off'].game.no, 'GAME 03');
assert.equal(yunjaeBadges['hit-chain'].game.no, 'GAME 01'); // 2회 안타 · 안타.
assert.equal(yunjaeBadges['hits-100'].progress.value, 89);
for (const [id, list] of [['yunjae', yunjaeBadges], ['younghun', younghunBadges]]) {
  const sides = allGames.map(g => g.away.player === id ? [g.away, g.home] : [g.home, g.away]);
  assert.equal(list['hits-100'].progress.value, Math.min(100, sides.reduce((t, [s]) => t + s.batting.H, 0)));
  assert.equal(list['hr-10'].progress.value, Math.min(10, sides.reduce((t, [s]) => t + s.batting.HR, 0)));
  assert.equal(list['first-win'].count, sides.filter(([s, o]) => s.R > o.R).length);
  assert.equal(list['games-10'].game.no, 'GAME 10');
  assert.equal(list['games-20'].unlocked, false);
  const sorted = data(`sortAchievements(computeAchievements('${id}',games))`);
  const firstLocked = sorted.findIndex(b => !b.unlocked);
  assert(sorted.slice(firstLocked).every(b => !b.unlocked));
  for (let i = 1; i < firstLocked; i++) assert(sorted[i - 1].game.date >= sorted[i].game.date);
  run(`renderBadges('player=${id}')`);
  assert(!/undefined|NaN|null/.test(app.innerHTML));
  assert.deepEqual([...app.innerHTML.matchAll(/data-badge="([^"]+)"/g)].map(m => m[1]), sorted.map(b => b.id));
  assert(app.innerHTML.includes(`달성 ${firstLocked}/${sorted.length} (${Math.round(firstLocked / sorted.length * 100)}%)`));
  assert(app.innerHTML.includes(`href="#badges?player=${id}" class="active"`));
}
run(`renderBadges('player=yunjae')`);
assert(app.innerHTML.includes('GAME 04 · 9월 20일 달성'));
assert(app.innerHTML.includes('89/100'));
context.location.hash = '#badges';
run('navigate()');
assert(app.innerHTML.includes('href="#badges?player=yunjae" class="active"'));
assert.equal(JSON.stringify(data('games')), originalData);

// Phone layout (max-width 600px): the same records rendered as cards, without wide tables.
const phoneApp = { innerHTML: '' };
const phoneListeners = {};
const phoneContext = {
  document: { querySelector: () => phoneApp, querySelectorAll: () => [], getElementById: () => null, addEventListener: (type, handler) => { phoneListeners[type] = handler; } },
  window: { addEventListener() {}, scrollTo() {}, matchMedia: query => ({ matches: query === '(max-width: 600px)', addEventListener() {} }) },
  location: { hash: '#schedule' },
  URLSearchParams
};
vm.createContext(phoneContext);
for (const name of ['data.js', 'sabermetrics.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', name), 'utf8'), phoneContext);
const phoneRun = expression => vm.runInContext(expression, phoneContext);
const phoneHtml = expression => { phoneRun(expression); const html = phoneApp.innerHTML; assert(!/undefined|NaN|Infinity/.test(html), expression); assert(!html.includes('<table class="record-table') && !html.includes('box-table'), expression); return html; };
const phoneSchedule = phoneHtml('renderSchedule()');
assert.deepEqual([...phoneSchedule.matchAll(/data-score-game="([^"]+)"/g)].map(m=>m[1]), orderedGames.map(g=>g.id));
for (const game of allGames) {
  assert(phoneSchedule.includes(`<a class="m-game-card" href="#game/${game.id}"`));
  const html = phoneHtml(`renderGame('${game.id}')`);
  const linescore = html.match(/<table class="m-linescore"[\s\S]*?<\/table>/)[0];
  assert.equal((linescore.match(/scope="col"/g)||[]).length, game.innings+4);
  for (const key of ['away','home']) assert(linescore.includes(`<td class="m-total run-total">${game[key].R}</td>`));
  assert.equal((html.match(/<details class="m-inning">/g)||[]).length, new Set(game.plays.map(p=>p[0])).size);
  assert(html.includes('id="game-plays"') && html.includes(`<span>경기장</span>${game.venue}`));
}
for (const id of ids) for (const mode of modes) assert.equal((phoneHtml(`recordMode='${mode}'; renderPlayer('${id}')`).match(/class="m-log-head"/g)||[]).length, allGames.length);
for (const mode of modes) for (const view of ['standard', 'expanded']) assert.equal((phoneHtml(`renderPlayers('mode=${mode}&view=${view}')`).match(/<li class="m-card">/g)||[]).length, 2);
phoneListeners.change({target:{dataset:{leaders:'sort'},value:'ERA',id:'leaders-sort'}});
assert(phoneContext.location.hash.includes('sort=ERA') && phoneContext.location.hash.includes('dir=asc'));
for (const mode of modes) for (const basis of ['gamelog', 'cumulative', 'game']) for (const player of ['all', ...ids]) {
  const html = phoneHtml(`renderTrends('${new URLSearchParams({mode, basis, player})}')`);
  const expected = allGames.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id)).map(g=>g.id).reverse();
  assert.deepEqual([...html.matchAll(/data-log-game="([^"]+)"/g)].map(m=>m[1]), (player === 'all' ? ids : [player]).flatMap(() => expected));
}
assert.equal((phoneHtml('renderParks()').match(/<li class="m-card">/g)||[]).length, phoneRun('estimateParks(games).length'));
for (const id of ids) assert.equal((phoneHtml(`renderBadges('player=${id}')`).match(/data-badge="/g)||[]).length, phoneRun(`computeAchievements('${id}',games).length`));
assert.equal(JSON.stringify(JSON.parse(JSON.stringify(phoneRun('games')))), originalData);
console.log(`PASS: ${checks} leaderboard/log combinations plus ${allGames.length} scorecards; totals, chronological records, line scores, links, routes, and original data.`);
