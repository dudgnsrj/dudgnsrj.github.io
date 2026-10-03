// Run with: node baseball/tests/stats.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = { innerHTML: '' };
const listeners = {};
const context = {
  document: {
    querySelector: () => app,
    querySelectorAll: () => [],
    getElementById: () => ({ focus() {} }),
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
assert.equal(JSON.stringify(data('games')), originalData);
console.log(`PASS: ${checks} leaderboard/log combinations; cumulative denominators, periods, hand splits, sorting, routes, and original data.`);
