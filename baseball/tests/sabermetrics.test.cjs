// Run with: node baseball/tests/sabermetrics.test.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const app={innerHTML:''};
const ctx={URLSearchParams,location:{hash:'#parks'},window:{addEventListener(){},scrollTo(){}},document:{querySelector:()=>app,querySelectorAll:()=>[],addEventListener(){}}};
vm.createContext(ctx);
for(const name of ['sabermetrics.js','app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
const data=s=>JSON.parse(JSON.stringify(run(s)));
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
close(run('virtualOffense(SABER.leagueWOBA).wrc'),100);
assert(run('virtualOffense(SABER.leagueWOBA,1.1).wrc')<100);
assert(run('virtualOffense(SABER.leagueWOBA,.9).wrc')>100);
assert(run('virtualOffense(0).wrc')<0);
assert.equal(run('virtualOffense(null)'),null);
assert.equal(run('weightedBatting([]).woba'),null);
close(run("weightedBatting([{AB:5,H:4,'2B':1,'3B':1,HR:1,BB:2,IBB:1,HBP:1,SF:1,SH:1}]).woba"),(.761+.791+.923+1.340+1.683+1.982)/8);
assert.equal(run("advancedBatting('younghun',[])['wRC+']"),'—');
assert.deepEqual(data('estimateParks([])'),[]);
assert(run("estimateParks(games.filter(g=>g.venue==='208동 놀이터')).every(p=>p.factor===1)"));
assert(run('estimateParks(games).every(p=>p.eligible||p.factor===1)'));
assert(run('estimateParks(games).every(p=>p.factor>=.8&&p.factor<=1.2&&p.weight<1)'));
assert(app.innerHTML.includes('KBO 기준 가상'));
assert(!/NaN|undefined|Infinity/.test(app.innerHTML));

// Larger identical samples increase the influence of observed park differences.
run(`const fixture=(v,i,h)=>({id:v+i,date:'2026-01-01',venue:v,away:{player:'a',batting:{AB:100,H:h}},home:{player:'b',batting:{AB:50,H:h/2}}});
const small=Array.from({length:3},(_,i)=>fixture('A',i,40)).concat(Array.from({length:3},(_,i)=>fixture('B',i,20)));
const large=Array.from({length:30},(_,i)=>fixture('A',i,40)).concat(Array.from({length:30},(_,i)=>fixture('B',i,20)));`);
assert(run("estimateParks(small).find(p=>p.venue==='A').factor>1"));
assert(run("estimateParks(small).find(p=>p.venue==='B').factor<1"));
assert(run('estimateParks(large)[0].weight>estimateParks(small)[0].weight'));
assert(run('estimateParks(large)[0].factor>=estimateParks(small)[0].factor'));
assert(run("estimateParks(small.map(g=>({...g,away:{...g.away,batting:{AB:100,H:30}},home:{...g.home,batting:{AB:50,H:15}}}))).every(p=>p.factor===1)"));
assert(run("estimateParks([{...small[0],venue:undefined},...small]).length===2"));
// Order, repeated rendering, and later games cannot leak into historical rows.
const raw=data('games');
const before=data("buildHistory('younghun','batting','cumulative')");
run("games.push({...games[0],id:'20990101-99',date:'2099-01-01',away:{...games[0].away,batting:{AB:100,H:100,HR:100}},home:{...games[0].home,batting:{AB:100,H:0}}})");
assert.deepEqual(data("buildHistory('younghun','batting','cumulative').slice(0,-1)"),before);
run('games.pop()');
assert.deepEqual(data('games'),raw);
for(const park of data('estimateParks(games)')) {
  const reversed=data('estimateParks(games.slice().reverse())').find(p=>p.venue===park.venue);
  close(park.factor,reversed.factor);
  close(park.raw,reversed.raw);
}
for(const id of ['younghun','yunjae']) {
  const last=data(`buildHistory('${id}','batting','cumulative').at(-1).stats`);
  const current=data(`advancedBatting('${id}',games)`);
  for(const key of Object.keys(current)) assert.equal(last[key],current[key]);
  for(const basis of ['game','cumulative','gamelog']) {
    run(`renderTrends('player=${id}&view=expanded&basis=${basis}&metric=wRC%2B')`);
    assert(app.innerHTML.includes('가상'));
    assert(!/NaN|undefined|Infinity/.test(app.innerHTML));
  }
}
const chart=run("trendState={mode:'batting',basis:'cumulative'};renderTrendChart([{player:players.younghun,color:'#000',rows:[{game:games[0],number:1,played:true,stats:{'wRC+':-100}},{game:games[1],number:2,played:true,stats:{'wRC+':200}}]}],'wRC+')");
const ys=[...chart.matchAll(/cy="([\d.]+)"/g)].map(m=>Number(m[1]));
assert.equal(ys.length,2);
assert(ys.every(y=>y>=26&&y<=298));
assert(ys[0]>ys[1]);
console.log('PASS: virtual baseline, weights, park shrinkage, sample gates, bounds, missing data, no future leakage, and historical integration.');
console.log(JSON.stringify(data('({parks:estimateParks(games),younghun:advancedBatting("younghun",games),yunjae:advancedBatting("yunjae",games)})'),null,2));
