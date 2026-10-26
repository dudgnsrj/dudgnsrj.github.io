'use strict';
// 어린이 화면은 ../data.js의 games·computeAchievements만 읽는다. 숫자를 따로 복사하지 않는다.
const KID = 'yunjae', DAD = 'younghun';
const NAMES = { yunjae: '윤재', younghun: '아빠' };
const IMG = { yunjae: 'assets/yunjae.webp', younghun: 'assets/dad.webp' };
const CLS = { yunjae: 'yun', younghun: 'dad' };
const DATA_NAME = { 윤재: 'yunjae', 영훈: 'younghun' };
const view = document.getElementById('kid');
const overlay = document.getElementById('overlay');
const titleEl = document.getElementById('screenTitle');
const ordered = games.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
const latest = ordered[ordered.length - 1];
const sideOf = (g, id) => g.away.player === id ? g.away : g.home;
const rival = id => id === KID ? DAD : KID;
const md = date => { const [, m, d] = date.split('-').map(Number); return `${m}월 ${d}일`; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ro = n => (n % 10 === 0 && n > 0) || [0, 3, 6].includes(n % 10) ? `${n}으로` : `${n}로`;

let soundOn = localStorage.getItem('kids-sound') === 'on';
let audioCtx = null;
function speak(text) {
  if (!soundOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.rate = 0.95; u.pitch = 1.1;
  speechSynthesis.speak(u);
}
function blip(freq = 660) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!soundOn || !Ctx) return;
  audioCtx = audioCtx || new Ctx();
  const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.2);
}
function paintSound() {
  const btn = document.getElementById('soundBtn');
  btn.setAttribute('aria-pressed', String(soundOn));
  btn.classList.toggle('is-on', soundOn);
  document.getElementById('soundLabel').textContent = soundOn ? '소리 켬' : '소리 끔';
}

function totals(id) {
  const t = { G: 0, W: 0, T: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, R: 0, BB: 0, K: 0 };
  for (const g of ordered) {
    const s = sideOf(g, id), o = sideOf(g, rival(id)), b = s.batting;
    t.G++; if (s.R > o.R) t.W++; if (s.R === o.R) t.T++;
    t.H += b.H; t['2B'] += b['2B'] || 0; t['3B'] += b['3B'] || 0; t.HR += b.HR; t.RBI += b.RBI; t.R += b.R; t.BB += (b.BB || 0) + (b.HBP || 0);
    t.K += s.pitching.SO;
  }
  return t;
}
function bestGame(id, pick) {
  let best = null;
  for (const g of ordered) { const v = pick(sideOf(g, id)); if (!best || v > best.v) best = { v, g }; }
  return best;
}
const ballRow = (n, cls) => `<span class="balls ${cls}" aria-hidden="true">${'<i class="ball"></i>'.repeat(Math.min(n, 10))}${n > 10 ? `<em>+${n - 10}</em>` : ''}</span>`;
const resultText = g => { const k = sideOf(g, KID).R, d = sideOf(g, DAD).R; return k > d ? '윤재 승리!' : k < d ? '아빠 승리' : '비겼어요'; };

function classify(token) {
  const t = token.replace(/\(.*?\)/g, '').trim();
  const table = {
    '안타': ['single', '안타!'], '내야안타': ['single', '내야 안타!'], '번트안타': ['single', '번트 안타!'], '끝내기 안타': ['single', '끝내기 안타!'],
    '2루타': ['double', '2루타!'], '3루타': ['triple', '3루타!'], '홈런': ['homer', '홈런!'],
    '볼넷': ['walk', '볼넷!'], '사구': ['walk', '몸에 맞는 공'], '몸맞는 공': ['walk', '몸에 맞는 공'],
    '삼진': ['strikeout', '삼진!'], '쓰리번트': ['strikeout', '쓰리번트 삼진'],
    '땅볼': ['ground', '땅볼 아웃'], '투수땅볼': ['ground', '투수 땅볼 아웃'], '병살': ['dp', '병살! 아웃 2개'],
    '뜬공': ['fly', '뜬공 아웃'], '내야플라이': ['fly', '내야 뜬공 아웃'], '내야뜬공': ['fly', '내야 뜬공 아웃'],
    '파울플라이': ['fly', '파울 뜬공 아웃'], '포수 파울플라이': ['fly', '포수 뜬공 아웃'],
    '직선타': ['line', '직선타 아웃'], '직선타 아웃': ['line', '직선타 아웃'], '희생플라이': ['sacfly', '희생 플라이!'],
    '실책 출루': ['error', '실책! 1루 세이프'], '실책': ['error', '실책! 1루 세이프']
  };
  if (table[t]) return { kind: table[t][0], label: table[t][1], walkoff: t.startsWith('끝내기') };
  if (t.startsWith('폭투')) return { kind: 'wild', label: '폭투! 한 베이스 더' };
  const sw = t.match(/^(윤재|영훈) (좌완|우완) 전환$/);
  if (sw) return { kind: 'switch', label: `${NAMES[DATA_NAME[sw[1]]]} ${sw[2] === '좌완' ? '왼손' : '오른손'} 투수!` };
  return null;
}
// 괄호 속 점수 메모는 순서가 경기마다 달라서, 이미 정해진 상대 점수로 내 점수를 고른다.
function noteScore(raw, batter, opp, cur, end) {
  for (const [, inner] of raw.matchAll(/\(([^)]*)\)/g)) {
    const s = inner.trim().match(/^(?:(윤재|영훈)\s*)?(\d+)\s*[–-]\s*(\d+)(?:\s*(윤재|영훈))?$/);
    if (!s) continue;
    const a = Number(s[2]), b = Number(s[3]);
    let mine = null;
    if (s[1] && s[4]) mine = DATA_NAME[s[1]] === batter ? a : b;
    else if (a === opp && b !== opp) mine = b;
    else if (b === opp && a !== opp) mine = a;
    else if (a === opp && b === opp) mine = a;
    else { const c = [a, b].filter(v => v >= cur && v <= end); mine = c.length === 1 ? c[0] : null; }
    if (mine !== null && mine >= cur && mine <= end) return mine;
  }
  return null;
}
const sumRuns = (runs, n) => runs.slice(0, n).reduce((s, r) => s + (Number(r) || 0), 0);
const OUTFIELD = [[160, 175], [300, 100], [440, 175], [215, 125], [385, 125]];
const INFIELD = [[235, 290], [365, 290], [300, 262], [400, 330], [200, 330]];
function buildHalf(g, k) {
  const [innLabel, who, text] = g.plays[k];
  const batter = DATA_NAME[who], pitcher = rival(batter);
  const idx = parseInt(innLabel, 10) - 1;
  const bSide = sideOf(g, batter), pSide = sideOf(g, pitcher), top = g.away.player === batter;
  const start = sumRuns(bSide.runs, idx), opp = sumRuns(pSide.runs, top ? idx : idx + 1);
  const halfRuns = Number(bSide.runs[idx]) || 0, end = start + halfRuns;
  let score = start, outs = 0, bases = [false, false, false];
  const scenes = [], tokens = text.split(' · ');
  tokens.forEach((raw, i) => {
    const ev = classify(raw) || { kind: 'other', label: raw.replace(/\(.*?\)/g, '').trim() };
    const occ = [3, 2, 1].filter(b => bases[b - 1]);
    let moves = [], addOuts = 0;
    const adv = (n, batterTo) => { moves = occ.map(b => ({ from: b, to: Math.min(b + n, 4) })); moves.push({ from: 0, to: batterTo }); };
    switch (ev.kind) {
      case 'single': case 'error': adv(1, 1); break;
      case 'double': adv(2, 2); break;
      case 'triple': adv(3, 3); break;
      case 'homer': adv(4, 4); break;
      case 'walk': {
        moves = [{ from: 0, to: 1 }];
        if (bases[0]) { moves.push({ from: 1, to: 2 }); if (bases[1]) { moves.push({ from: 2, to: 3 }); if (bases[2]) moves.push({ from: 3, to: 4 }); } }
        break;
      }
      case 'ground': addOuts = 1; moves = [{ from: 0, to: 1, out: true }]; break;
      case 'dp': { addOuts = 2; const lead = bases[0] ? 1 : occ[0]; moves = [{ from: 0, to: 1, out: true }]; if (lead) moves.push({ from: lead, to: Math.min(lead + 1, 3), out: true }); break; }
      case 'sacfly': addOuts = 1; if (bases[2]) moves = [{ from: 3, to: 4 }]; break;
      case 'strikeout': case 'fly': case 'line': addOuts = 1; break;
      case 'wild': moves = occ.map(b => ({ from: b, to: Math.min(b + 1, 4) })); break;
      default: break;
    }
    const note = noteScore(raw, batter, opp, score, end);
    const want = note === null ? 0 : note - score;
    let home = moves.filter(m => m.to === 4 && !m.out).length;
    if (want > home) {
      for (const m of moves.filter(x => x.to < 4 && x.from > 0 && !x.out).sort((a, b) => b.to - a.to)) { if (home >= want) break; m.to = 4; home++; }
      for (const b of occ) { if (home >= want) break; if (!moves.some(m => m.from === b)) { moves.push({ from: b, to: 4 }); home++; } }
    } else if (want < home) {
      for (const m of moves.filter(x => x.to === 4).sort((a, b) => a.from - b.from)) { if (home <= want) break; m.to = 3; home--; }
    }
    const runs = Math.min(Math.max(want, home), end - score);
    const before = bases.slice(), scoreBefore = score, outsBefore = outs;
    const nb = [false, false, false];
    occ.filter(b => !moves.some(m => m.from === b)).forEach(b => { nb[b - 1] = true; });
    moves.filter(m => !m.out && m.to >= 1 && m.to <= 3).forEach(m => { nb[m.to - 1] = true; });
    bases = nb; score += runs; outs += addOuts;
    const target = /fly|line|sacfly|single|double|triple/.test(ev.kind) ? OUTFIELD[(k * 3 + i) % 5] : INFIELD[(k * 2 + i) % 5];
    scenes.push({ ev, raw, i, moves, before, after: bases.slice(), scoreBefore, scoreAfter: score, runs, outsBefore, outsAfter: outs, target });
  });
  const last = k === g.plays.length - 1;
  scenes.push({ ev: { kind: 'end', label: last ? '경기 끝!' : '공수 교대!' }, moves: [], before: bases.slice(), after: [false, false, false], scoreBefore: score, scoreAfter: end, runs: end - score, outsBefore: outs, outsAfter: outs, target: null });
  return { g, k, batter, pitcher, inning: idx + 1, top, start, opp, end, halfRuns, scenes, tokens, outsTotal: outs, last };
}
window.kidsReplay = { classify, buildHalf };

function renderHome() {
  const t = totals(KID), stickers = computeAchievements(KID, games).filter(b => b.unlocked).length;
  return `<section class="home">
    <div class="hero">
      <img class="hero-kid" src="${IMG[KID]}" alt="야구 방망이를 든 윤재 그림">
      <div class="hero-text"><p class="hello">윤재야, 야구하자!</p><p class="hero-sub">지금까지 <b data-stat="G">${t.G}</b>경기 · 안타 <b>${t.H}</b>개</p></div>
      <img class="hero-dad" src="${IMG[DAD]}" alt="공을 던지는 아빠 그림">
    </div>
    <nav class="home-grid" aria-label="메뉴">
      <button class="kid-btn tile t-today" data-go="today" type="button"><img src="assets/trophy.webp" alt=""><span class="tile-label">오늘 경기</span><small>${md(latest.date)}</small></button>
      <button class="kid-btn tile t-games" data-go="games" type="button">${calendarSvg()}<span class="tile-label">우리 경기</span><small>${ordered.length}경기</small></button>
      <button class="kid-btn tile t-stickers" data-go="stickers" type="button">${starSvg()}<span class="tile-label">스티커북</span><small>${stickers} / ${badgeDefs.length}</small></button>
      <button class="kid-btn tile t-me" data-go="me" type="button"><img src="assets/mascot.webp" alt=""><span class="tile-label">내 기록</span><small>홈런 ${t.HR}개</small></button>
    </nav>
  </section>`;
}
const calendarSvg = () => `<svg class="tile-icon" viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="12" width="48" height="44" rx="10" fill="#fff" stroke="#1F2A4D" stroke-width="4"/><path d="M8 26h48" stroke="#1F2A4D" stroke-width="4"/><rect x="8" y="12" width="48" height="14" rx="8" fill="#FF8A1F"/><path d="M20 6v12M44 6v12" stroke="#1F2A4D" stroke-width="5" stroke-linecap="round"/><circle cx="22" cy="38" r="4" fill="#3BA9EE"/><circle cx="32" cy="38" r="4" fill="#3BA9EE"/><circle cx="42" cy="38" r="4" fill="#3BA9EE"/><circle cx="22" cy="48" r="4" fill="#3BA9EE"/><circle cx="32" cy="48" r="4" fill="#FFC53D"/></svg>`;
const starSvg = () => `<svg class="tile-icon" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z" fill="#FFC53D" stroke="#1F2A4D" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="31" r="3" fill="#1F2A4D"/><circle cx="39" cy="31" r="3" fill="#1F2A4D"/><path d="M26 39c4 4 8 4 12 0" fill="none" stroke="#1F2A4D" stroke-width="3" stroke-linecap="round"/></svg>`;

function praiseList(g) {
  const b = sideOf(g, KID).batting, p = sideOf(g, KID).pitching, out = [];
  if (b.HR) out.push(`홈런 ${b.HR}개`);
  if (b['3B']) out.push(`3루타 ${b['3B']}개`);
  if (b['2B']) out.push(`2루타 ${b['2B']}개`);
  if (b.H) out.push(`안타 ${b.H}개`);
  if (b.RBI) out.push(`타점 ${b.RBI}개`);
  if (p.SO) out.push(`삼진 ${p.SO}개 잡기`);
  if ((b.BB || 0) + (b.HBP || 0)) out.push(`볼넷 ${(b.BB || 0) + (b.HBP || 0)}개 골라내기`);
  const fresh = computeAchievements(KID, games).filter(a => a.game && a.game.id === g.id);
  return { items: out, fresh };
}
function scoreTeam(g, id) {
  const r = sideOf(g, id).R;
  return `<div class="team ${CLS[id]}"><img src="${IMG[id]}" alt="${NAMES[id]} 그림"><span class="team-name">${NAMES[id]}</span><b class="score" data-score="${id}">${r}</b>${ballRow(r, CLS[id])}</div>`;
}
function lineScore(g) {
  const cols = Array.from({ length: g.innings }, (_, i) => i);
  const row = id => { const s = sideOf(g, id); return `<tr class="${CLS[id]}"><th scope="row">${NAMES[id]}</th>${cols.map(i => `<td>${s.runs[i] === 'X' ? '-' : s.runs[i]}</td>`).join('')}<td class="tot">${s.R}</td></tr>`; };
  return `<div class="line-wrap"><table class="line"><thead><tr><th></th>${cols.map(i => `<th scope="col">${i + 1}회</th>`).join('')}<th class="tot">점수</th></tr></thead><tbody>${row(g.away.player)}${row(g.home.player)}</tbody></table></div>`;
}
function renderToday() {
  const g = latest, k = sideOf(g, KID).R, d = sideOf(g, DAD).R, { items, fresh } = praiseList(g);
  const headline = k > d ? `윤재가 ${k}점 내고 이겼어요!` : k ? `윤재가 ${k}점이나 냈어요!` : '윤재가 끝까지 열심히 했어요!';
  const result = k > d ? `윤재 ${k} : ${d} 아빠 · 윤재 승리` : k < d ? `윤재 ${k} : ${d} 아빠 · 다음엔 윤재 차례!` : `윤재 ${k} : ${d} 아빠 · 비겼어요`;
  return `<section class="today">
    <p class="chip">${md(g.date)} · ${esc(g.venue || '')} · ${g.innings}이닝</p>
    <div class="versus">${scoreTeam(g, KID)}<span class="vs">:</span>${scoreTeam(g, DAD)}</div>
    <div class="head-box"><p class="headline">${headline}</p><p class="result-line">${result}</p></div>
    <div class="praise"><p class="praise-title">윤재가 잘한 것</p><ul>${items.map(x => `<li>${starMini()}${x}</li>`).join('')}${fresh.map(a => `<li class="new-sticker">${starMini()}새 스티커: ${esc(a.title)}</li>`).join('')}</ul></div>
    ${lineScore(g)}
    <div class="cta-row"><button class="kid-btn cta" data-go="replay/${g.id}/0" type="button">${playSvg()}<span>처음부터 보기</span></button><button class="kid-btn cta alt" data-go="game/${g.id}" type="button">${gridSvg()}<span>이닝 고르기</span></button></div>
  </section>`;
}
const starMini = () => '<svg class="star-mini" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21l1.5-7L2 9.3l7-.8z"/></svg>';
const playSvg = () => '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M15 9l25 15-25 15z"/></svg>';
const pauseSvg = () => '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="9" width="9" height="30" rx="3"/><rect x="28" y="9" width="9" height="30" rx="3"/></svg>';
const restartSvg = () => '<svg class="ic stroke" viewBox="0 0 48 48" aria-hidden="true"><path d="M11 24a13 13 0 1 0 4-9.4"/><path d="M10 7v9h9"/></svg>';
const nextSvg = () => '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10l17 14-17 14zM25 10l17 14-17 14z"/></svg>';
const gridSvg = () => '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="14" height="14" rx="4"/><rect x="27" y="7" width="14" height="14" rx="4"/><rect x="7" y="27" width="14" height="14" rx="4"/><rect x="27" y="27" width="14" height="14" rx="4"/></svg>';
const arrowSvg = dir => `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="${dir < 0 ? 'M31 8 13 24l18 16z' : 'M17 8l18 16-18 16z'}"/></svg>`;

const PER_PAGE = 3;
function renderGames(query) {
  const list = ordered.slice().reverse(), pages = Math.ceil(list.length / PER_PAGE);
  const p = Math.min(Math.max(Number(new URLSearchParams(query).get('p')) || 0, 0), pages - 1);
  const cards = list.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE).map(g => {
    const k = sideOf(g, KID).R, d = sideOf(g, DAD).R, res = k > d ? 'win' : k < d ? 'lose' : 'tie';
    return `<button class="kid-btn game-card ${res}" data-go="game/${g.id}" type="button">
      <span class="gc-date">${md(g.date)}</span><span class="gc-no">${g.no.replace('GAME ', '')}번째 경기</span>
      <span class="gc-score"><span class="yun"><img src="${IMG[KID]}" alt=""><b>${k}</b></span><i>:</i><span class="dad"><b>${d}</b><img src="${IMG[DAD]}" alt=""></span></span>
      <span class="gc-result">${resultText(g)}</span></button>`;
  }).join('');
  const dots = Array.from({ length: pages }, (_, i) => `<i class="${i === p ? 'on' : ''}"></i>`).join('');
  return `<section class="games">
    <div class="pager">
      <button class="kid-btn arrow" data-go="games?p=${p - 1}" type="button" aria-label="앞 경기" ${p === 0 ? 'disabled' : ''}>${arrowSvg(-1)}</button>
      <div class="cards">${cards}</div>
      <button class="kid-btn arrow" data-go="games?p=${p + 1}" type="button" aria-label="뒤 경기" ${p >= pages - 1 ? 'disabled' : ''}>${arrowSvg(1)}</button>
    </div>
    <p class="dots" aria-label="${pages}쪽 중 ${p + 1}쪽">${dots}</p>
  </section>`;
}

function renderGame(id) {
  const g = games.find(x => x.id === id) || latest;
  const halves = g.plays.map((p, k) => ({ k, inning: parseInt(p[0], 10), batter: DATA_NAME[p[1]] }));
  const cols = Array.from({ length: g.innings }, (_, i) => i + 1).map(n => {
    const btns = [g.away.player, g.home.player].map(pid => {
      const h = halves.find(x => x.inning === n && x.batter === pid);
      const r = sideOf(g, pid).runs[n - 1];
      if (!h) return `<span class="half none">안 했어요</span>`;
      return `<button class="kid-btn half ${CLS[pid]}" data-go="replay/${g.id}/${h.k}" type="button"><img src="${IMG[pid]}" alt=""><span>${NAMES[pid]}</span><b>${Number(r) || 0}점</b></button>`;
    }).join('');
    return `<div class="inning-col"><p class="inning-no">${n}회</p>${btns}</div>`;
  }).join('');
  return `<section class="game">
    <div class="game-head"><p class="chip">${md(g.date)} · ${g.no.replace('GAME ', '')}번째 경기</p><p class="mini-score"><span class="yun">윤재 <b>${sideOf(g, KID).R}</b></span> : <span class="dad"><b>${sideOf(g, DAD).R}</b> 아빠</span></p></div>
    <p class="hint">보고 싶은 이닝을 눌러요</p>
    <div class="innings">${cols}</div>
    <div class="cta-row"><button class="kid-btn cta" data-go="replay/${g.id}/0" type="button">${playSvg()}<span>처음부터 보기</span></button><button class="kid-btn cta alt" data-go="games" type="button">${gridSvg()}<span>다른 경기</span></button></div>
  </section>`;
}

const HOME = [300, 452], BASES = [HOME, [445, 307], [300, 162], [155, 307], HOME], MOUND = [300, 318];
const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const onPath = s => { const i = Math.min(Math.floor(s), 3); return lerp(BASES[i], BASES[i + 1], s - i); };
const SCENE_MS = 1000, GAP_MS = 350;
let R = null;
function fieldSvg(half) {
  const ar = id => id === KID ? 0.652 : 0.655;
  const bh = 150, ph = 120;
  return `<svg id="field" class="field" viewBox="0 0 600 520" role="img" aria-label="야구장">
    <path class="outfield" d="M300 488 L28 216 A385 385 0 0 1 572 216 Z"/>
    <path class="fence" d="M28 216 A385 385 0 0 1 572 216" fill="none"/>
    <path class="dirt" d="M300 482 L478 307 L300 132 L122 307 Z"/>
    <path class="infield" d="M300 430 L420 307 L300 186 L180 307 Z"/>
    <path class="foul" d="M300 452 L28 180 M300 452 L572 180"/>
    <circle class="mound" cx="300" cy="318" r="24"/>
    ${[1, 2, 3].map(b => `<rect class="base" id="base${b}" x="${BASES[b][0] - 13}" y="${BASES[b][1] - 13}" width="26" height="26" transform="rotate(45 ${BASES[b][0]} ${BASES[b][1]})"/>`).join('')}
    <path class="plate" d="M288 446h24v10l-12 10-12-10z"/>
    <image href="${IMG[half.pitcher]}" x="${300 - ph * ar(half.pitcher) / 2}" y="${318 - ph + 18}" width="${ph * ar(half.pitcher)}" height="${ph}"/>
    <image id="batterFig" href="${IMG[half.batter]}" x="${300 - 40 - bh * ar(half.batter)}" y="${452 - bh + 40}" width="${bh * ar(half.batter)}" height="${bh}"/>
    <g id="runners"></g>
    <g id="fireworks" class="fireworks" transform="translate(300 120)">${Array.from({ length: 12 }, (_, i) => `<path d="M0 0 L0 -46" transform="rotate(${i * 30})" class="fw c${i % 3}"/>`).join('')}<circle r="10" class="fw-core"/></g>
    <circle id="ball" class="ball" r="9" cx="300" cy="318"/>
    <g id="strikes" class="strikes" transform="translate(40 40)"><text x="0" y="12">S</text>${[0, 1, 2].map(i => `<circle cx="${40 + i * 40}" cy="0" r="14" class="s-light"/>`).join('')}</g>
  </svg>`;
}
function renderReplay(id, k) {
  const g = games.find(x => x.id === id) || latest;
  const kk = Math.min(Math.max(Number(k) || 0, 0), g.plays.length - 1);
  const half = buildHalf(g, kk);
  const chips = half.scenes.slice(0, -1).map((s, i) => `<li data-chip="${i}">${esc(s.ev.label.replace(/!$/, ''))}</li>`).join('');
  const html = `<section class="replay">
    <div class="field-wrap">${fieldSvg(half)}<div class="float-label" id="floatLabel" aria-hidden="true"></div></div>
    <aside class="panel">
      <p class="chip">${md(g.date)} · ${half.inning}회 ${half.top ? '초' : '말'} · <span class="${CLS[half.batter]}">${NAMES[half.batter]} 공격</span></p>
      <div class="board">
        <div class="b yun ${half.batter === KID ? 'bat' : ''}"><img src="${IMG[KID]}" alt=""><span>윤재</span><b id="score-${KID}"></b></div>
        <div class="b dad ${half.batter === DAD ? 'bat' : ''}"><img src="${IMG[DAD]}" alt=""><span>아빠</span><b id="score-${DAD}"></b></div>
      </div>
      <div class="event" aria-live="polite"><p class="event-label" id="evLabel">준비!</p><p class="event-sub" id="evSub">${NAMES[half.batter]} 타석이에요</p></div>
      <div class="outs-row"><span>아웃</span><span id="outs" class="outs"></span></div>
      <ol class="chips" id="chips">${chips}</ol>
      <div class="controls">
        <button class="kid-btn ctl" id="btnRestart" type="button">${restartSvg()}<span>처음부터</span></button>
        <button class="kid-btn ctl main" id="btnPlay" type="button">${pauseSvg()}<span>멈춤</span></button>
        <button class="kid-btn ctl" id="btnNext" type="button">${nextSvg()}<span>${half.last ? '경기 목록' : '다음 이닝'}</span></button>
      </div>
    </aside>
  </section>`;
  return { html, half };
}
function startReplay(half) {
  R = { half, clock: 0, last: null, playing: true, scene: -1, raf: 0 };
  document.getElementById('btnRestart').onclick = () => { blip(); R.clock = 0; R.scene = -1; document.getElementById('btnNext').classList.remove('ready'); setPlaying(true); };
  document.getElementById('btnPlay').onclick = () => { blip(); if (R.clock >= totalMs()) { R.clock = 0; R.scene = -1; } setPlaying(!R.playing); };
  document.getElementById('btnNext').onclick = () => { blip(); const g = half.g; go(half.last ? 'games' : `replay/${g.id}/${half.k + 1}`); };
  drawState(half.scenes[0], 0, true);
  setPlaying(true);
}
const totalMs = () => R.half.scenes.length * (SCENE_MS + GAP_MS) - GAP_MS;
function setPlaying(on) {
  R.playing = on; R.last = null;
  const btn = document.getElementById('btnPlay');
  btn.innerHTML = on ? `${pauseSvg()}<span>멈춤</span>` : `${playSvg()}<span>${R.clock >= totalMs() ? '다시 보기' : '계속'}</span>`;
  btn.classList.toggle('paused', !on);
  cancelAnimationFrame(R.raf);
  if (on) R.raf = requestAnimationFrame(tick);
}
function stopReplay() { if (R) { cancelAnimationFrame(R.raf); R = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); }
function tick(now) {
  if (!R || !R.playing) return;
  if (R.last !== null) R.clock += now - R.last;
  R.last = now;
  const span = SCENE_MS + GAP_MS, i = Math.min(Math.floor(R.clock / span), R.half.scenes.length - 1);
  const t = Math.min((R.clock - i * span) / SCENE_MS, 1);
  if (i !== R.scene) { R.scene = i; enterScene(R.half.scenes[i], i); }
  drawState(R.half.scenes[i], t, false);
  if (R.clock >= totalMs()) { R.clock = totalMs(); setPlaying(false); document.getElementById('btnNext').classList.add('ready'); return; }
  R.raf = requestAnimationFrame(tick);
}
function sceneText(half, s) {
  const b = half.batter, kind = s.ev.kind, kidBat = b === KID;
  const good = ['single', 'double', 'triple', 'homer', 'walk', 'error', 'sacfly'].includes(kind);
  const out = ['strikeout', 'ground', 'dp', 'fly', 'line'].includes(kind);
  let sub = '';
  if (kind === 'end') sub = half.last ? finalLine(half.g) : `${NAMES[b]} ${half.halfRuns}점 냈어요`;
  else if (kind === 'switch' || kind === 'wild' || kind === 'other') sub = '';
  else if (good) sub = kidBat ? (kind === 'walk' ? '공을 잘 골랐어요!' : '윤재 최고!') : '아빠도 잘 치네!';
  else if (out) sub = kidBat ? (kind === 'strikeout' ? '괜찮아, 다음 공을 보자!' : '괜찮아, 다음에 또 치자!') : (kind === 'strikeout' ? '윤재가 삼진 잡았다!' : '윤재가 잡았어요!');
  if (s.runs > 0 && kind !== 'end') sub = `${s.runs}점! ${sub}`;
  const say = kind === 'end' ? `${s.ev.label.replace('!', '')}. ${sub}` : `${NAMES[b]}, ${s.ev.label.replace(/!/g, '')}`;
  return { sub, say, tone: kind === 'end' ? 'end' : good ? (kidBat ? 'good-kid' : 'good') : out ? (kidBat ? 'calm' : 'good-kid') : 'neutral' };
}
function finalLine(g) { const k = sideOf(g, KID).R, d = sideOf(g, DAD).R; return k > d ? `윤재가 ${k} 대 ${ro(d)} 이겼어요!` : k < d ? `아빠가 ${d} 대 ${ro(k)} 이겼어요` : `${k} 대 ${d} 비겼어요!`; }
function enterScene(s, i) {
  const half = R.half, txt = sceneText(half, s);
  const label = document.getElementById('evLabel');
  label.textContent = s.ev.label; label.className = `event-label tone-${txt.tone} pop`;
  document.getElementById('evSub').textContent = txt.sub;
  document.querySelectorAll('#chips li').forEach(li => { const n = Number(li.dataset.chip); li.className = n < i ? 'done' : n === i ? 'now' : ''; });
  const chips = document.getElementById('chips'), now = chips.querySelector('li.now');
  if (now) chips.scrollTop = Math.max(0, now.offsetTop - chips.offsetTop - 8);
  const fl = document.getElementById('floatLabel');
  fl.textContent = s.ev.kind === 'homer' ? '홈런!' : '';
  fl.className = `float-label ${s.ev.kind === 'homer' ? 'show' : ''}`;
  speak(txt.say);
  if (s.ev.kind === 'homer' || (s.runs > 0)) blip(880);
}
function drawState(s, t, reset) {
  const half = R.half, b = half.batter;
  const curScore = t >= 0.85 ? s.scoreAfter : s.scoreBefore;
  document.getElementById(`score-${b}`).textContent = curScore;
  document.getElementById(`score-${half.pitcher}`).textContent = half.opp;
  const outsNow = t >= 0.8 ? s.outsAfter : s.outsBefore, slots = Math.max(half.outsTotal, 3);
  document.getElementById('outs').innerHTML = Array.from({ length: slots }, (_, i) => `<i class="${i < outsNow ? 'on' : ''}"></i>`).join('');
  const tokens = [];
  const moving = new Set(s.moves.map(m => m.from));
  for (let base = 1; base <= 3; base++) if (s.before[base - 1] && !moving.has(base)) tokens.push({ p: BASES[base], o: 1 });
  const u = ease(Math.min(Math.max((t - 0.32) / 0.6, 0), 1));
  for (const m of s.moves) {
    const to = m.out ? Math.max(m.to, m.from + 0.6) : m.to;
    const pos = onPath(m.from + (to - m.from) * u);
    const o = m.out ? (t > 0.75 ? Math.max(0, 1 - (t - 0.75) * 4) : 1) : m.to === 4 && t > 0.92 ? Math.max(0, 1 - (t - 0.92) * 12) : 1;
    if (m.from === 0 && t < 0.3 && s.ev.kind !== 'walk') continue;
    tokens.push({ p: pos, o });
  }
  if (s.ev.kind === 'end') tokens.length = 0;
  document.getElementById('runners').innerHTML = tokens.map(x => `<g class="runner ${CLS[b]}" transform="translate(${x.p[0].toFixed(1)} ${x.p[1].toFixed(1)})" opacity="${x.o.toFixed(2)}"><circle r="17"/><text y="7">${NAMES[b][0]}</text></g>`).join('');
  [1, 2, 3].forEach(n => document.getElementById(`base${n}`).classList.toggle('lit', (t >= 0.9 ? s.after : s.before)[n - 1]));
  const ball = document.getElementById('ball'), bp = ballAt(s, t);
  ball.style.display = bp ? '' : 'none';
  if (bp) { ball.setAttribute('cx', bp.p[0].toFixed(1)); ball.setAttribute('cy', bp.p[1].toFixed(1)); ball.setAttribute('r', bp.r.toFixed(1)); }
  const strikes = document.getElementById('strikes');
  const lit = s.ev.kind === 'strikeout' ? (t >= 0.9 ? 3 : t >= 0.58 ? 2 : t >= 0.25 ? 1 : 0) : 0;
  strikes.classList.toggle('show', s.ev.kind === 'strikeout');
  strikes.querySelectorAll('.s-light').forEach((c, i) => c.classList.toggle('on', i < lit));
  const fw = document.getElementById('fireworks');
  const f = s.ev.kind === 'homer' && t > 0.62 ? Math.min((t - 0.62) / 0.38, 1) : 0;
  fw.style.opacity = f ? String(1 - f * 0.6) : '0';
  fw.setAttribute('transform', `translate(300 120) scale(${(0.3 + f * 0.9).toFixed(2)})`);
  document.getElementById('batterFig').style.opacity = s.moves.some(m => m.from === 0) && t > 0.35 && !s.moves.find(m => m.from === 0).out ? '0.55' : '1';
  if (reset) { document.getElementById('evLabel').textContent = '준비!'; }
}
function ballAt(s, t) {
  const k = s.ev.kind, catcher = [300, 478];
  if (['switch', 'other', 'end'].includes(k)) return null;
  if (k === 'wild') return t < 0.4 ? { p: lerp(MOUND, [340, 490], t / 0.4), r: 8 } : { p: [352, 500], r: 8 };
  if (k === 'strikeout') { const f = (t * 3) % 1; return t >= 0.99 ? { p: catcher, r: 8 } : { p: lerp(MOUND, catcher, Math.min(f / 0.7, 1)), r: 8 }; }
  if (t < 0.28) return { p: lerp(MOUND, [300, 440], t / 0.28), r: 8 };
  if (k === 'walk') return { p: lerp([300, 440], catcher, Math.min((t - 0.28) / 0.2, 1)), r: 8 };
  const u = Math.min((t - 0.28) / 0.52, 1), from = [300, 440];
  if (k === 'homer') return { p: lerp(from, [300, -30], ease(u)), r: 8 + 12 * Math.sin(Math.PI * u * 0.7) };
  if (k === 'ground' || k === 'dp' || k === 'error') { const p = lerp(from, s.target, u); p[1] -= Math.abs(Math.sin(u * Math.PI * 3)) * 16 * (1 - u); return { p, r: 8 }; }
  const lift = k === 'fly' || k === 'sacfly' ? 14 : k === 'line' ? 2 : 7;
  return { p: lerp(from, s.target, ease(u)), r: 8 + lift * Math.sin(Math.PI * u) };
}

const CAT_COLOR = { batting: '#FFC53D', pitching: '#4CC38A', game: '#9B7BEA', career: '#FF7BAC' };
const KID_MARK = { H: '안타', '2B': '2루타', '3B': '3루타', HR: '홈런', '2H': '안타2', '3H': '안타3', RBI: '타점3', '0K': '삼진0', K: '삼진', '5K': '삼진5', '10K': '삼진10', '0BB': '볼넷0', '0R': '0점', W: '승리', '3G': '무패3', '9': '9회', '50H': '안타50', '100H': '안타100', '3HR': '홈런3', '5HR': '홈런5', '10HR': '홈런10', '10G': '10경기', '20G': '20경기' };
function stickerSvg(b) {
  const mark = KID_MARK[b.mark] || b.mark, size = mark.length > 3 ? 24 : mark.length > 2 ? 28 : 36;
  return `<svg class="sticker-art" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#1F2A4D" stroke-width="3"/><circle cx="60" cy="60" r="49" fill="${CAT_COLOR[b.category]}"/><circle cx="60" cy="60" r="37" fill="#FFFDF7"/><path d="M60 8l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#fff" opacity=".9"/><text x="60" y="${60 + size * 0.36}" text-anchor="middle" font-size="${size}" fill="#1F2A4D">${esc(mark)}</text></svg>`;
}
const lockedSvg = () => '<svg class="sticker-art locked" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="#E9E1D0" stroke="#D3C8B2" stroke-width="4"/><path d="M34 26c10 14 10 54 0 68M86 26c-10 14-10 54 0 68" fill="none" stroke="#D3C8B2" stroke-width="4" stroke-dasharray="6 6"/><text x="60" y="76" text-anchor="middle" font-size="44" fill="#BDB09A">?</text></svg>';
const UNIT = { 'hits-50': ['안타', '개'], 'hits-100': ['안타', '개'], 'hr-3': ['홈런', '개'], 'hr-5': ['홈런', '개'], 'hr-10': ['홈런', '개'], 'games-10': ['경기', '번'], 'games-20': ['경기', '번'], 'venues-4': ['새 경기장', '곳'] };
function lockedHint(b) {
  const u = UNIT[b.id];
  if (u && b.progress) return `${u[0]} ${b.progress.target - b.progress.value}${u[1]} 더 모으면 열려요`;
  if (b.progress) return `${b.desc} 지금 최고 ${b.progress.value}${b.id.startsWith('k-') ? '개' : ''}!`;
  return `${b.desc.replace(/\.$/, '')}! 그러면 열려요`;
}
function progressBalls(b) {
  if (!b.progress) return '';
  const { value, target } = b.progress, per = target > 20 ? target / 10 : 1, n = Math.round(target / per), f = Math.floor(value / per);
  return `<p class="pballs" aria-label="${value} / ${target}">${Array.from({ length: n }, (_, i) => `<i class="${i < f ? 'on' : ''}"></i>`).join('')}<span>${value} / ${target}</span></p>`;
}
let stickerList = [];
function renderStickers() {
  stickerList = computeAchievements(KID, games);
  const done = stickerList.filter(b => b.unlocked).length, next = sortAchievements(stickerList).find(b => !b.unlocked);
  const slots = stickerList.map(b => b.unlocked
    ? `<button class="kid-btn slot on" data-sticker="${b.id}" type="button">${stickerSvg(b)}<span class="slot-name">${esc(b.title)}</span></button>`
    : `<button class="kid-btn slot off ${next && next.id === b.id ? 'next' : ''}" data-sticker="${b.id}" type="button">${lockedSvg()}<span class="slot-name">${next && next.id === b.id ? `${starMini()}다음 목표` : ''}</span></button>`).join('');
  return `<section class="stickers">
    <div class="book-head"><p class="book-count">스티커 <b data-stat="stickers">${done}</b>개 모았어요!</p>${next ? `<p class="book-next">${starMini()}다음 목표: ${esc(next.title)}</p>` : ''}</div>
    <div class="book">${slots}</div>
  </section>`;
}
function openSticker(id) {
  const b = stickerList.find(x => x.id === id);
  if (!b) return;
  if (b.unlocked) {
    const when = `${md(b.game.date)} ${b.game.no.replace('GAME ', '')}번째 경기에서 받았어요`;
    showOverlay(`<div class="sheet sticker-sheet"><div class="big-sticker pop-big">${stickerSvg(b)}<div class="burst" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i style="--a:${i * 36}deg"></i>`).join('')}</div></div>
      <p class="sheet-title">${esc(b.title)}</p><p class="sheet-desc">${esc(b.desc)}</p><p class="sheet-when">${when}${b.count > 1 ? ` · ${b.count}번 했어요!` : ''}</p>
      <button class="kid-btn close" data-close type="button">좋아요!</button></div>`);
    speak(`${b.title} 스티커!`);
  } else {
    const hint = lockedHint(b);
    showOverlay(`<div class="sheet sticker-sheet"><div class="big-sticker soft">${lockedSvg()}</div><p class="sheet-title">아직 비밀 스티커</p><p class="sheet-desc">${esc(hint)}</p>${progressBalls(b)}
      <button class="kid-btn close" data-close type="button">알았어요</button></div>`);
    speak(hint);
  }
}

const LADDER = [5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 1000];
function milestone(v, badgeTargets) {
  const steps = [...new Set([...(badgeTargets || []), ...LADDER])].sort((a, b) => a - b);
  const next = steps.find(x => x > v) || v + 100, prev = [0, ...steps].filter(x => x <= v).pop();
  return { next, prev, pct: Math.round((v - prev) / (next - prev) * 100) };
}
function renderMe() {
  const t = totals(KID), ach = computeAchievements(KID, games), goal = sortAchievements(ach).find(a => !a.unlocked);
  const badgeFor = (prefix, target) => ach.find(a => a.id === `${prefix}-${target}`);
  const tiles = [
    ['G', '경기', t.G, '번', [10, 20], 'games'], ['W', '이긴 경기', t.W, '번', null], ['H', '안타', t.H, '개', [50, 100], 'hits'],
    ['HR', '홈런', t.HR, '개', [3, 5, 10], 'hr'], ['RBI', '타점', t.RBI, '개', null], ['2B', '2루타', t['2B'], '개', null],
    ['K', '삼진 잡기', t.K, '개', null], ['BB', '볼넷 골라내기', t.BB, '개', null]
  ].map(([key, label, v, unit, targets, prefix]) => {
    const m = milestone(v, targets), badge = prefix && targets.includes(m.next) ? badgeFor(prefix, m.next) : null;
    return `<div class="stat-tile s-${key}"><p class="st-label">${label}</p><p class="st-num"><b data-stat="${key}">${v}</b>${unit}</p>
      <div class="st-bar" role="progressbar" aria-valuemin="${m.prev}" aria-valuemax="${m.next}" aria-valuenow="${v}"><span style="width:${m.pct}%"></span></div>
      <p class="st-next">${m.next}${unit}까지 <b>${m.next - v}</b>${unit} 남았어요${badge ? ` · ${starMini()}스티커` : ''}</p></div>`;
  }).join('');
  const bests = [['한 경기 안타', s => s.batting.H, '개'], ['한 경기 타점', s => s.batting.RBI, '개'], ['한 경기 삼진 잡기', s => s.pitching.SO, '개']]
    .map(([label, pick, unit]) => { const b = bestGame(KID, pick); return `<li><span>${label}</span><b>${b.v}${unit}</b><small>${md(b.g.date)}</small></li>`; }).join('');
  return `<section class="me">
    <div class="me-head"><img src="${IMG[KID]}" alt="윤재 그림"><div><p class="me-title">윤재 기록</p><p class="me-sub">${t.G}경기 동안 이만큼 했어요!</p></div></div>
    ${goal ? `<div class="goal-banner">${starMini()}<span>다음 스티커 <b>${esc(goal.title)}</b>: ${esc(lockedHint(goal))}</span></div>` : ''}
    <div class="stat-grid">${tiles}</div>
    <div class="bests"><p class="bests-title">${starMini()}최고 기록</p><ul>${bests}</ul></div>
  </section>`;
}

function showOverlay(html) {
  overlay.innerHTML = `<div class="backdrop" data-close></div>${html}`;
  overlay.hidden = false;
}
function closeOverlay() { overlay.hidden = true; overlay.innerHTML = ''; gate = null; }
let gate = null;
function openGate() {
  if (R && R.playing) setPlaying(false);
  const a = 100 + Math.floor(Math.random() * 400), b = 100 + Math.floor(Math.random() * 400);
  gate = { a, b, input: '' };
  speak('부모님 확인 화면이에요');
  paintGate('');
}
function paintGate(msg) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];
  showOverlay(`<div class="sheet gate" role="dialog" aria-label="부모님 확인">
    <p class="sheet-title">부모님 확인</p><p class="gate-q">${gate.a} + ${gate.b} = <span class="gate-in">${gate.input || '?'}</span></p>
    <p class="gate-msg">${msg}</p>
    <div class="keypad">${keys.map(k => `<button class="kid-btn key ${k === 'ok' ? 'ok' : ''}" data-key="${k}" type="button">${k === 'del' ? '지우기' : k === 'ok' ? '확인' : k}</button>`).join('')}</div>
    <button class="kid-btn close" data-close type="button">닫기</button></div>`);
}
function gateKey(k) {
  if (k === 'del') gate.input = gate.input.slice(0, -1);
  else if (k === 'ok') {
    if (Number(gate.input) === gate.a + gate.b) { paintParent(); return; }
    gate.input = ''; paintGate('다시 해 볼까요?');
    overlay.querySelector('.gate').classList.add('wiggle');
    return;
  } else if (gate.input.length < 4) gate.input += k;
  paintGate('');
}
function paintParent() {
  gate = null;
  showOverlay(`<div class="sheet parent" role="dialog" aria-label="부모님 메뉴">
    <p class="sheet-title">부모님 메뉴</p><p class="sheet-desc">어른용 기록실에서 자세한 표와 통계를 볼 수 있어요.</p>
    <a class="kid-btn cta" href="../">어른용 기록실 열기</a>
    <button class="kid-btn close" data-close type="button">어린이 화면으로</button></div>`);
}

const homeBtn = document.getElementById('homeBtn');
let holdTimer = 0, held = false;
homeBtn.addEventListener('pointerdown', () => {
  held = false; homeBtn.classList.add('holding');
  holdTimer = setTimeout(() => { held = true; homeBtn.classList.remove('holding'); openGate(); }, 2000);
});
const cancelHold = () => { clearTimeout(holdTimer); homeBtn.classList.remove('holding'); };
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => homeBtn.addEventListener(ev, cancelHold));
homeBtn.addEventListener('contextmenu', e => e.preventDefault());
homeBtn.addEventListener('click', () => { if (held) { held = false; return; } blip(520); closeOverlay(); go('home'); });
document.getElementById('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn; localStorage.setItem('kids-sound', soundOn ? 'on' : 'off'); paintSound();
  if (soundOn) { blip(); speak('소리를 켰어요'); } else if ('speechSynthesis' in window) speechSynthesis.cancel();
});

let idleTimer = 0;
function armIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (R && R.playing) setPlaying(false);
    showOverlay('<div class="sheet rest"><img src="assets/mascot.webp" alt=""><p class="sheet-title">잠깐 쉬어 갈까요?</p><button class="kid-btn close" data-close type="button">계속 놀기</button></div>');
  }, 5 * 60 * 1000);
}
document.addEventListener('pointerdown', armIdle, true);

function go(hash) { if (location.hash.slice(1) === hash) render(); else location.hash = hash; }
const TITLES = { home: '윤재의 야구장', today: '오늘 경기', games: '우리 경기', game: '이닝 고르기', replay: '다시 보기', stickers: '스티커북', me: '내 기록' };
function render() {
  stopReplay(); closeOverlay();
  const [path, query = ''] = location.hash.slice(1).split('?');
  const [name0, a, b] = path.split('/'), name = TITLES[name0] ? name0 : 'home';
  document.body.dataset.screen = name;
  titleEl.textContent = TITLES[name];
  let replayHalf = null;
  if (name === 'today') view.innerHTML = renderToday();
  else if (name === 'games') view.innerHTML = renderGames(query);
  else if (name === 'game') view.innerHTML = renderGame(a);
  else if (name === 'replay') { const r = renderReplay(a, b); view.innerHTML = r.html; replayHalf = r.half; }
  else if (name === 'stickers') view.innerHTML = renderStickers();
  else if (name === 'me') view.innerHTML = renderMe();
  else view.innerHTML = renderHome();
  window.scrollTo(0, 0);
  if (replayHalf) startReplay(replayHalf);
}
document.addEventListener('click', e => {
  const goEl = e.target.closest('[data-go]');
  if (goEl && !goEl.disabled) { blip(); go(goEl.dataset.go); return; }
  const st = e.target.closest('[data-sticker]');
  if (st) { blip(760); openSticker(st.dataset.sticker); return; }
  const key = e.target.closest('[data-key]');
  if (key && gate) { blip(600); gateKey(key.dataset.key); return; }
  if (e.target.closest('[data-close]')) { blip(520); closeOverlay(); }
});
window.addEventListener('hashchange', render);
paintSound();
armIdle();
render();
