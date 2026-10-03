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
  '20261001-06':'어린이집 풋살장', '20261003-07':'208동 놀이터'
};
for (const [id, venue] of Object.entries(expectedVenues)) {
  assert.equal(allGames.find(g=>g.id===id).venue,venue);
  run(`renderGame('${id}')`);
  assert(app.innerHTML.includes(`<span>경기장</span>${venue}`));
}
assert(run('renderVenue({})').includes('미등록'));
const originalData = JSON.stringify(allGames);
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
assert.equal(JSON.stringify(data('games')), originalData);
console.log(`PASS: ${checks} leaderboard/log combinations plus ${allGames.length} scorecards; totals, chronological records, line scores, links, routes, and original data.`);
