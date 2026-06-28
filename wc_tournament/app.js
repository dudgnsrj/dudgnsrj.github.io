const SUPABASE_URL = "https://tvhlonufurkazdykmomy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LAMJL5DR3A4gfb4vC_4nzg_BKMTvW9H";
const TOURNAMENT_PREFIX = "T";
const STORAGE_KEY = "worldcup-tournament-picks-v1";
const SELECTED_PLAYER_KEY = "worldcup-tournament-selected-player-v1";
const URL_PARAMS = new URLSearchParams(window.location.search);
const DEMO_MODE = URL_PARAMS.has("demo");
const ADMIN_MODE = URL_PARAMS.has("admin");
const TOURNAMENT_PARTICIPANT_ID_PREFIX = "person-tournament-";
const TOURNAMENT_PARTICIPANT_NAMES = new Set(["조영훈", "김병진"]);
const ROUND_POINTS = { r32: 1, r16: 1, qf: 1, sf: 1, final: 5 };

const TEAMS = {
  MEX: { ko: "멕시코", en: "Mexico", rank: 15 },
  RSA: { ko: "남아공", en: "South Africa", rank: 60 },
  CAN: { ko: "캐나다", en: "Canada", rank: 30 },
  BIH: { ko: "보스니아 헤르체고비나", en: "Bosnia and Herzegovina", rank: 65 },
  SUI: { ko: "스위스", en: "Switzerland", rank: 19 },
  BRA: { ko: "브라질", en: "Brazil", rank: 6 },
  MAR: { ko: "모로코", en: "Morocco", rank: 8 },
  USA: { ko: "미국", en: "USA", rank: 16 },
  PAR: { ko: "파라과이", en: "Paraguay", rank: 40 },
  AUS: { ko: "호주", en: "Australia", rank: 27 },
  GER: { ko: "독일", en: "Germany", rank: 10 },
  CIV: { ko: "코트디부아르", en: "Côte d'Ivoire", rank: 34 },
  ECU: { ko: "에콰도르", en: "Ecuador", rank: 23 },
  NED: { ko: "네덜란드", en: "Netherlands", rank: 7 },
  JPN: { ko: "일본", en: "Japan", rank: 18 },
  SWE: { ko: "스웨덴", en: "Sweden", rank: 38 },
  BEL: { ko: "벨기에", en: "Belgium", rank: 9 },
  EGY: { ko: "이집트", en: "Egypt", rank: 29 },
  ESP: { ko: "스페인", en: "Spain", rank: 2 },
  CPV: { ko: "카보베르데", en: "Cabo Verde", rank: 69 },
  FRA: { ko: "프랑스", en: "France", rank: 1 },
  SEN: { ko: "세네갈", en: "Senegal", rank: 14 },
  NOR: { ko: "노르웨이", en: "Norway", rank: 31 },
  ARG: { ko: "아르헨티나", en: "Argentina", rank: 3 },
  ALG: { ko: "알제리", en: "Algeria", rank: 28 },
  AUT: { ko: "오스트리아", en: "Austria", rank: 24 },
  POR: { ko: "포르투갈", en: "Portugal", rank: 5 },
  COD: { ko: "DR콩고", en: "Congo DR", rank: 46 },
  COL: { ko: "콜롬비아", en: "Colombia", rank: 13 },
  ENG: { ko: "잉글랜드", en: "England", rank: 4 },
  CRO: { ko: "크로아티아", en: "Croatia", rank: 11 },
  GHA: { ko: "가나", en: "Ghana", rank: 74 },
};

const ROUND_DEFS = [
  { id: "r32", label: "32강", short: "32강" },
  { id: "r16", label: "16강", short: "16강" },
  { id: "qf", label: "8강", short: "8강" },
  { id: "sf", label: "4강", short: "4강" },
  { id: "final", label: "결승", short: "결승" },
];

const MATCHES = [
  { id: "T73", no: 73, round: "r32", time: "6.29 04:00 KST", venue: "Los Angeles", slots: [{ team: "RSA" }, { team: "CAN" }] },
  { id: "T74", no: 74, round: "r32", time: "6.30 05:30 KST", venue: "Boston", slots: [{ team: "GER" }, { team: "PAR" }] },
  { id: "T75", no: 75, round: "r32", time: "6.30 10:00 KST", venue: "Monterrey", slots: [{ team: "NED" }, { team: "MAR" }] },
  { id: "T76", no: 76, round: "r32", time: "6.30 02:00 KST", venue: "Houston", slots: [{ team: "BRA" }, { team: "JPN" }] },
  { id: "T77", no: 77, round: "r32", time: "7.1 06:00 KST", venue: "New York/New Jersey", slots: [{ team: "FRA" }, { team: "SWE" }] },
  { id: "T78", no: 78, round: "r32", time: "7.1 02:00 KST", venue: "Dallas", slots: [{ team: "CIV" }, { team: "NOR" }] },
  { id: "T79", no: 79, round: "r32", time: "7.1 11:00 KST", venue: "Mexico City", slots: [{ team: "MEX" }, { team: "ECU" }] },
  { id: "T80", no: 80, round: "r32", time: "7.2 01:00 KST", venue: "Atlanta", slots: [{ team: "ENG" }, { team: "COD" }] },
  { id: "T81", no: 81, round: "r32", time: "7.2 09:00 KST", venue: "San Francisco Bay Area", slots: [{ team: "USA" }, { team: "BIH" }] },
  { id: "T82", no: 82, round: "r32", time: "7.2 05:00 KST", venue: "Seattle", slots: [{ team: "BEL" }, { team: "SEN" }] },
  { id: "T83", no: 83, round: "r32", time: "7.3 08:00 KST", venue: "Toronto", slots: [{ team: "POR" }, { team: "CRO" }] },
  { id: "T84", no: 84, round: "r32", time: "7.3 04:00 KST", venue: "Los Angeles", slots: [{ team: "ESP" }, { team: "AUT" }] },
  { id: "T85", no: 85, round: "r32", time: "7.3 12:00 KST", venue: "Vancouver", slots: [{ team: "SUI" }, { team: "ALG" }] },
  { id: "T86", no: 86, round: "r32", time: "7.4 07:00 KST", venue: "Miami", slots: [{ team: "ARG" }, { team: "CPV" }] },
  { id: "T87", no: 87, round: "r32", time: "7.4 10:30 KST", venue: "Kansas City", slots: [{ team: "COL" }, { team: "GHA" }] },
  { id: "T88", no: 88, round: "r32", time: "7.4 03:00 KST", venue: "Dallas", slots: [{ team: "AUS" }, { team: "EGY" }] },

  { id: "T89", no: 89, round: "r16", time: "16강", venue: "Winner 73/75", slots: [{ from: "T73" }, { from: "T75" }] },
  { id: "T90", no: 90, round: "r16", time: "16강", venue: "Winner 74/77", slots: [{ from: "T74" }, { from: "T77" }] },
  { id: "T91", no: 91, round: "r16", time: "16강", venue: "Winner 76/78", slots: [{ from: "T76" }, { from: "T78" }] },
  { id: "T92", no: 92, round: "r16", time: "16강", venue: "Winner 79/80", slots: [{ from: "T79" }, { from: "T80" }] },
  { id: "T93", no: 93, round: "r16", time: "16강", venue: "Winner 83/84", slots: [{ from: "T83" }, { from: "T84" }] },
  { id: "T94", no: 94, round: "r16", time: "16강", venue: "Winner 81/82", slots: [{ from: "T81" }, { from: "T82" }] },
  { id: "T95", no: 95, round: "r16", time: "16강", venue: "Winner 86/88", slots: [{ from: "T86" }, { from: "T88" }] },
  { id: "T96", no: 96, round: "r16", time: "16강", venue: "Winner 85/87", slots: [{ from: "T85" }, { from: "T87" }] },

  { id: "T97", no: 97, round: "qf", time: "8강", venue: "Winner 89/90", slots: [{ from: "T89" }, { from: "T90" }] },
  { id: "T98", no: 98, round: "qf", time: "8강", venue: "Winner 93/94", slots: [{ from: "T93" }, { from: "T94" }] },
  { id: "T99", no: 99, round: "qf", time: "8강", venue: "Winner 91/92", slots: [{ from: "T91" }, { from: "T92" }] },
  { id: "T100", no: 100, round: "qf", time: "8강", venue: "Winner 95/96", slots: [{ from: "T95" }, { from: "T96" }] },

  { id: "T101", no: 101, round: "sf", time: "4강", venue: "Winner 97/98", slots: [{ from: "T97" }, { from: "T98" }] },
  { id: "T102", no: 102, round: "sf", time: "4강", venue: "Winner 99/100", slots: [{ from: "T99" }, { from: "T100" }] },
  { id: "T104", no: 104, round: "final", time: "7.20 결승", venue: "New York/New Jersey", slots: [{ from: "T101" }, { from: "T102" }] },
];

const ROUND_MATCH_ORDER = {
  r32: ["T73", "T75", "T74", "T77", "T83", "T84", "T81", "T82", "T76", "T78", "T79", "T80", "T86", "T88", "T85", "T87"],
  r16: ["T89", "T90", "T93", "T94", "T91", "T92", "T95", "T96"],
  qf: ["T97", "T98", "T99", "T100"],
  sf: ["T101", "T102"],
  final: ["T104"],
};

const DEFAULT_PARTICIPANTS = [
  { id: "person-cho-younghun", name: "조영훈" },
  { id: "person-49f553c0-01c1-495a-9112-06c62e09df40", name: "김병진" },
];

const MATCH_BY_ID = new Map(MATCHES.map((match) => [match.id, match]));
const TOTAL_PICKS = MATCHES.length;

const els = {
  participantButtons: document.querySelector("#participantButtons"),
  addParticipantForm: document.querySelector("#addParticipantForm"),
  participantNameInput: document.querySelector("#participantNameInput"),
  saveStatus: document.querySelector("#saveStatus"),
  championPanel: document.querySelector("#championPanel"),
  overallPanel: document.querySelector("#overallPanel"),
  scoringNote: document.querySelector("#scoringNote"),
  scoreboardList: document.querySelector("#scoreboardList"),
  resultAdminPanel: document.querySelector("#resultAdminPanel"),
  resultAdminList: document.querySelector("#resultAdminList"),
  roundTabs: document.querySelector("#roundTabs"),
  bracketGrid: document.querySelector("#bracketGrid"),
  championSummary: document.querySelector("#championSummary"),
  participantSummary: document.querySelector("#participantSummary"),
  clearPicksBtn: document.querySelector("#clearPicksBtn"),
};

const state = {
  participants: [...DEFAULT_PARTICIPANTS],
  selectedParticipantId: localStorage.getItem(SELECTED_PLAYER_KEY) || DEFAULT_PARTICIPANTS[0].id,
  activeRound: "r32",
  picks: {},
  results: {},
  saving: false,
};

init();

async function init() {
  bindEvents();
  renderStaticTabs();
  try {
    await loadSharedState();
    setStatus(DEMO_MODE ? "데모 모드" : "동기화됨", "good");
  } catch (error) {
    console.error(error);
    loadLocalState();
    setStatus("임시 저장 모드", "bad");
  }
  ensureSelectedParticipant();
  render();
}

function bindEvents() {
  if (els.addParticipantForm) {
    els.addParticipantForm.addEventListener("submit", addParticipant);
  }
  if (els.resultAdminPanel) {
    els.resultAdminPanel.hidden = !ADMIN_MODE;
  }
  els.clearPicksBtn.addEventListener("click", clearCurrentParticipantPicks);
}

function renderStaticTabs() {
  els.roundTabs.replaceChildren();
  ROUND_DEFS.forEach((round) => {
    const button = h("button", {
      className: `round-tab${round.id === state.activeRound ? " active" : ""}`,
      type: "button",
      text: round.label,
    });
    button.addEventListener("click", () => {
      state.activeRound = round.id;
      render();
    });
    els.roundTabs.append(button);
  });
}

async function loadSharedState() {
  if (DEMO_MODE) {
    loadLocalState();
    return;
  }

  const [participants, predictions, results] = await Promise.all([
    supabaseRest("worldcup_participants?select=id,name,sort_order&order=sort_order.asc,created_at.asc"),
    supabaseRest("worldcup_predictions?select=participant_id,match_id,home_score,away_score"),
    supabaseRest("worldcup_results?select=match_id,home_score,away_score"),
  ]);

  const tournamentParticipants = participants
    .map((participant) => ({ id: participant.id, name: participant.name }))
    .filter(isTournamentParticipant);

  state.participants = tournamentParticipants.length
    ? tournamentParticipants
    : [...DEFAULT_PARTICIPANTS];
  state.picks = {};
  state.results = {};

  predictions
    .filter((prediction) => prediction.match_id.startsWith(TOURNAMENT_PREFIX))
    .forEach((prediction) => {
      const side = decodeSide(prediction.home_score, prediction.away_score);
      if (!side || !MATCH_BY_ID.has(prediction.match_id)) return;
      state.picks[prediction.participant_id] = state.picks[prediction.participant_id] || {};
      state.picks[prediction.participant_id][prediction.match_id] = side;
    });

  results
    .filter((result) => result.match_id.startsWith(TOURNAMENT_PREFIX))
    .forEach((result) => {
      const side = decodeSide(result.home_score, result.away_score);
      if (!side || !MATCH_BY_ID.has(result.match_id)) return;
      state.results[result.match_id] = side;
    });

  saveLocalState();
}

function loadLocalState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.participants) && saved.participants.length) {
      const tournamentParticipants = saved.participants.filter(isTournamentParticipant);
      state.participants = tournamentParticipants.length ? tournamentParticipants : [...DEFAULT_PARTICIPANTS];
    }
    if (saved.picks && typeof saved.picks === "object") {
      state.picks = saved.picks;
    }
    if (saved.results && typeof saved.results === "object") {
      state.results = saved.results;
    }
  } catch (error) {
    console.warn(error);
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    participants: state.participants,
    picks: state.picks,
    results: state.results,
  }));
}

async function supabaseRest(path, options = {}) {
  const headers = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error(`Supabase ${response.status}`);
  }
  if (response.status === 204) return [];
  const text = await response.text();
  return text ? JSON.parse(text) : [];
}

function eqFilter(value) {
  return `eq.${encodeURIComponent(value)}`;
}

function decodeSide(homeScore, awayScore) {
  if (homeScore > awayScore) return "a";
  if (awayScore > homeScore) return "b";
  return null;
}

function encodeSide(side) {
  return side === "a"
    ? { home_score: 1, away_score: 0 }
    : { home_score: 0, away_score: 1 };
}

function ensureSelectedParticipant() {
  if (!state.participants.some((participant) => participant.id === state.selectedParticipantId)) {
    state.selectedParticipantId = state.participants[0]?.id || DEFAULT_PARTICIPANTS[0].id;
  }
  localStorage.setItem(SELECTED_PLAYER_KEY, state.selectedParticipantId);
}

function selectedParticipant() {
  return state.participants.find((participant) => participant.id === state.selectedParticipantId) || null;
}

function picksFor(participantId) {
  state.picks[participantId] = state.picks[participantId] || {};
  return state.picks[participantId];
}

function render() {
  ensureSelectedParticipant();
  renderStaticTabs();
  renderParticipants();
  renderSummary();
  renderScoreboard();
  renderResultAdmin();
  renderBracket();
  renderReports();
}

function renderParticipants() {
  els.participantButtons.replaceChildren();
  state.participants.forEach((participant) => {
    const button = h("button", {
      className: `participant-button${participant.id === state.selectedParticipantId ? " active" : ""}`,
      type: "button",
      text: participant.name,
    });
    button.addEventListener("click", () => {
      state.selectedParticipantId = participant.id;
      localStorage.setItem(SELECTED_PLAYER_KEY, participant.id);
      render();
    });
    els.participantButtons.append(button);
  });
}

function renderSummary() {
  const participant = selectedParticipant();
  const champion = participant ? winnerForMatch("T104", participant.id) : null;
  const progress = participant ? completedCount(participant.id) : 0;

  els.championPanel.replaceChildren();
  if (champion) {
    const team = getTeam(champion);
    els.championPanel.append(
      h("div", { className: "champion-hero" }, [
        flagNode(champion),
        h("div", { className: "champion-copy" }, [
          h("p", { className: "eyebrow", text: "My Champion" }),
          h("strong", { text: team.ko }),
          h("span", { text: `${participant.name}의 우승팀 예측 · FIFA ${team.rank}위` }),
        ]),
      ]),
    );
  } else {
    els.championPanel.append(
      h("div", { className: "empty-state", text: participant ? `${participant.name}의 우승팀이 아직 정해지지 않았어.` : "참가자를 선택해줘." }),
    );
  }

  const completedPlayers = state.participants.filter((item) => completedCount(item.id) === TOTAL_PICKS).length;
  const scored = scoredMatchCount();
  els.overallPanel.replaceChildren(
    h("div", { className: "metric-grid" }, [
      metricNode(`${progress}/${TOTAL_PICKS}`, "내 예측 진행"),
      metricNode(`${completedPlayers}/${state.participants.length}`, "완성한 참가자"),
      metricNode(`${scored}/${TOTAL_PICKS}`, "채점된 경기"),
    ]),
  );
}

function renderScoreboard() {
  els.scoreboardList.replaceChildren();
  const rows = scoreboardRows();
  if (!rows.length) {
    els.scoreboardList.append(h("div", { className: "empty-state", text: "참가자 정보가 없어." }));
    return;
  }

  const scored = scoredMatchCount();
  els.scoringNote.textContent = `채점 ${scored}/${TOTAL_PICKS} · 경기당 1점 · 우승팀 5점`;

  rows.forEach((row, index) => {
    els.scoreboardList.append(
      h("button", {
        className: `scoreboard-row${row.participant.id === state.selectedParticipantId ? " selected" : ""}`,
        type: "button",
      }, [
        h("span", { className: "rank-chip", text: `${index + 1}` }),
        h("span", { className: "score-name" }, [
          h("strong", { text: row.participant.name }),
          h("em", { text: row.champion ? `우승 ${getTeam(row.champion).ko}` : "우승팀 미정" }),
        ]),
        h("span", { className: "score-points" }, [
          h("strong", { text: `${row.points}` }),
          h("em", { text: "점" }),
        ]),
        h("span", { className: "score-detail", text: `${row.correct}/${scored}` }),
      ]),
    );
    els.scoreboardList.lastElementChild.addEventListener("click", () => {
      state.selectedParticipantId = row.participant.id;
      localStorage.setItem(SELECTED_PLAYER_KEY, row.participant.id);
      render();
    });
  });
}

function renderResultAdmin() {
  if (!els.resultAdminPanel || !ADMIN_MODE) return;
  els.resultAdminPanel.hidden = false;
  els.resultAdminList.replaceChildren();
  ROUND_DEFS.forEach((round) => {
    const group = h("div", { className: "result-round" }, [
      h("div", { className: "result-round-title" }, [
        h("strong", { text: round.label }),
        h("span", { text: `${ROUND_POINTS[round.id]}점` }),
      ]),
    ]);
    ROUND_MATCH_ORDER[round.id].forEach((matchId) => {
      group.append(resultAdminCard(MATCH_BY_ID.get(matchId)));
    });
    els.resultAdminList.append(group);
  });
}

function resultAdminCard(match) {
  const result = getResult(match.id);
  const teamA = resolveActualSlot(match.slots[0]);
  const teamB = resolveActualSlot(match.slots[1]);
  const locked = !teamA || !teamB;
  const winner = actualWinnerForMatch(match.id);
  const card = h("article", {
    className: `result-card${result ? " complete" : ""}${locked ? " locked" : ""}`,
  });

  card.append(
    h("div", { className: "match-meta" }, [
      h("span", { text: `M${match.no}` }),
      h("span", { text: winner ? `승자 ${getTeam(winner).ko}` : match.time }),
    ]),
  );

  card.append(resultPickButton(match, "a", teamA));
  card.append(resultPickButton(match, "b", teamB));
  return card;
}

function resultPickButton(match, side, teamCode) {
  const result = getResult(match.id);
  if (!teamCode) {
    return h("button", {
      className: "team-pick pending",
      type: "button",
      disabled: true,
      text: "이전 실제 결과 대기",
    });
  }

  const team = getTeam(teamCode);
  const button = h("button", {
    className: `team-pick result-pick${result === side ? " selected" : ""}`,
    type: "button",
    "data-result-match-id": match.id,
    "data-side": side,
    "aria-pressed": result === side ? "true" : "false",
  }, [
    flagNode(teamCode),
    h("span", { className: "team-copy" }, [
      h("strong", { text: team.ko }),
      h("span", { text: `${team.en} · FIFA ${team.rank}위` }),
    ]),
    h("span", { className: "pick-count", text: result === side ? "승" : "" }),
  ]);

  button.addEventListener("click", () => chooseActualWinner(match.id, side));
  return button;
}

function renderBracket() {
  els.bracketGrid.replaceChildren();
  ROUND_DEFS.forEach((round) => {
    const column = h("div", {
      className: `round-column${round.id === state.activeRound ? " active-mobile" : ""}`,
    });
    column.append(
      h("div", { className: "round-column-header" }, [
        h("strong", { text: round.label }),
        h("span", { text: `${ROUND_MATCH_ORDER[round.id].length}경기` }),
      ]),
    );

    ROUND_MATCH_ORDER[round.id].forEach((matchId) => {
      column.append(matchCard(MATCH_BY_ID.get(matchId)));
    });

    els.bracketGrid.append(column);
  });
}

function matchCard(match) {
  const pick = getPick(state.selectedParticipantId, match.id);
  const teamA = resolveSlot(match.slots[0], state.selectedParticipantId);
  const teamB = resolveSlot(match.slots[1], state.selectedParticipantId);
  const complete = Boolean(pick && teamA && teamB);
  const locked = !teamA || !teamB;
  const card = h("article", {
    className: `match-card${complete ? " complete" : ""}${locked ? " locked" : ""}`,
    "data-match-id": match.id,
  });

  card.append(
    h("div", { className: "match-meta" }, [
      h("span", { text: `M${match.no}` }),
      h("span", { text: match.time }),
    ]),
  );

  card.append(teamPickButton(match, "a", teamA));
  card.append(teamPickButton(match, "b", teamB));
  return card;
}

function teamPickButton(match, side, teamCode) {
  const pick = getPick(state.selectedParticipantId, match.id);
  if (!teamCode) {
    return h("button", {
      className: "team-pick pending",
      type: "button",
      disabled: true,
      text: "이전 라운드 대기",
    });
  }

  const team = getTeam(teamCode);
  const count = pickCountForSide(match.id, side);
  const button = h("button", {
    className: `team-pick${pick === side ? " selected" : ""}`,
    type: "button",
    "data-match-id": match.id,
    "data-side": side,
    "aria-pressed": pick === side ? "true" : "false",
  }, [
    flagNode(teamCode),
    h("span", { className: "team-copy" }, [
      h("strong", { text: team.ko }),
      h("span", { text: `${team.en} · FIFA ${team.rank}위` }),
    ]),
    h("span", { className: "pick-count", text: `${count}` }),
  ]);

  button.addEventListener("click", () => chooseWinner(match.id, side));
  return button;
}

function renderReports() {
  renderChampionSummary();
  renderParticipantSummary();
}

function renderChampionSummary() {
  els.championSummary.replaceChildren();
  const standings = championStandings();
  if (!standings.length) {
    els.championSummary.append(h("div", { className: "empty-state", text: "아직 우승팀 예측이 없어." }));
    return;
  }

  standings.forEach((item) => {
    const team = getTeam(item.team);
    els.championSummary.append(
      h("div", { className: "compact-row" }, [
        flagNode(item.team),
        h("div", {}, [
          h("strong", { text: team.ko }),
          h("span", { text: item.names.join(", ") }),
        ]),
        h("span", { className: "badge", text: `${item.count}표` }),
      ]),
    );
  });
}

function renderParticipantSummary() {
  els.participantSummary.replaceChildren();
  state.participants.forEach((participant) => {
    const progress = completedCount(participant.id);
    const champion = winnerForMatch("T104", participant.id);
    els.participantSummary.append(
      h("button", {
        className: `compact-row participant-row${participant.id === state.selectedParticipantId ? " selected" : ""}`,
        type: "button",
      }, [
        h("span", { className: "badge", text: `${progress}/${TOTAL_PICKS}` }),
        h("div", {}, [
          h("strong", { text: participant.name }),
          h("span", { text: champion ? `우승 ${getTeam(champion).ko}` : "우승팀 미정" }),
        ]),
        champion ? flagNode(champion) : h("span", { className: "muted-text", text: "-" }),
      ]),
    );
    els.participantSummary.lastElementChild.addEventListener("click", () => {
      state.selectedParticipantId = participant.id;
      localStorage.setItem(SELECTED_PLAYER_KEY, participant.id);
      render();
    });
  });
}

function metricNode(value, label) {
  return h("div", { className: "metric" }, [
    h("strong", { text: value }),
    h("span", { text: label }),
  ]);
}

async function addParticipant(event) {
  event.preventDefault();
  const name = els.participantNameInput.value.trim().replace(/\s+/g, " ");
  if (!name) return;
  const duplicated = state.participants.some((participant) => participant.name.toLowerCase() === name.toLowerCase());
  if (duplicated) {
    setStatus("이미 있는 이름", "bad");
    return;
  }

  const participant = {
    id: `${TOURNAMENT_PARTICIPANT_ID_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
  };

  state.participants.push(participant);
  state.selectedParticipantId = participant.id;
  els.participantNameInput.value = "";
  saveLocalState();
  render();

  if (DEMO_MODE) {
    setStatus("데모 저장됨", "good");
    return;
  }

  try {
    setStatus("저장 중");
    await supabaseRest("worldcup_participants?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        id: participant.id,
        name: participant.name,
        sort_order: state.participants.length - 1,
      }),
    });
    setStatus("저장됨", "good");
  } catch (error) {
    console.error(error);
    setStatus("참가자 저장 실패", "bad");
  }
}

async function chooseWinner(matchId, side) {
  const participant = selectedParticipant();
  if (!participant) return;
  const match = MATCH_BY_ID.get(matchId);
  const team = resolveSlot(match.slots[side === "a" ? 0 : 1], participant.id);
  if (!team) return;

  const currentPick = getPick(participant.id, matchId);
  if (currentPick === side) return;

  const downstream = descendantIds(matchId);
  const participantPicks = picksFor(participant.id);
  downstream.forEach((id) => delete participantPicks[id]);
  participantPicks[matchId] = side;
  saveLocalState();
  render();

  if (DEMO_MODE) {
    setStatus("데모 저장됨", "good");
    return;
  }

  try {
    setStatus("저장 중");
    const writes = [
      writePick(participant.id, matchId, side),
      ...downstream.map((id) => deletePick(participant.id, id)),
    ];
    await Promise.all(writes);
    setStatus("저장됨", "good");
  } catch (error) {
    console.error(error);
    setStatus("저장 실패", "bad");
  }
}

async function chooseActualWinner(matchId, side) {
  if (!ADMIN_MODE) return;
  const match = MATCH_BY_ID.get(matchId);
  const team = resolveActualSlot(match.slots[side === "a" ? 0 : 1]);
  if (!team) return;

  const currentResult = getResult(matchId);
  if (currentResult === side) return;

  const downstream = descendantIds(matchId);
  downstream.forEach((id) => delete state.results[id]);
  state.results[matchId] = side;
  saveLocalState();
  render();

  if (DEMO_MODE) {
    setStatus("데모 결과 저장됨", "good");
    return;
  }

  try {
    setStatus("결과 저장 중");
    await Promise.all([
      writeResult(matchId, side),
      ...downstream.map((id) => deleteResult(id)),
    ]);
    setStatus("결과 저장됨", "good");
  } catch (error) {
    console.error(error);
    setStatus("결과 저장 실패", "bad");
  }
}

async function clearCurrentParticipantPicks() {
  const participant = selectedParticipant();
  if (!participant) return;
  const ids = Object.keys(picksFor(participant.id));
  state.picks[participant.id] = {};
  saveLocalState();
  render();

  if (DEMO_MODE) {
    setStatus("데모 초기화됨", "good");
    return;
  }

  try {
    setStatus("초기화 중");
    await Promise.all(ids.map((id) => deletePick(participant.id, id)));
    setStatus("초기화됨", "good");
  } catch (error) {
    console.error(error);
    setStatus("초기화 실패", "bad");
  }
}

async function writePick(participantId, matchId, side) {
  const score = encodeSide(side);
  return supabaseRest("worldcup_predictions?on_conflict=participant_id,match_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      participant_id: participantId,
      match_id: matchId,
      ...score,
    }),
  });
}

async function deletePick(participantId, matchId) {
  return supabaseRest(`worldcup_predictions?participant_id=${eqFilter(participantId)}&match_id=${eqFilter(matchId)}`, {
    method: "DELETE",
  });
}

async function writeResult(matchId, side) {
  const score = encodeSide(side);
  return supabaseRest("worldcup_results?on_conflict=match_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      match_id: matchId,
      ...score,
    }),
  });
}

async function deleteResult(matchId) {
  return supabaseRest(`worldcup_results?match_id=${eqFilter(matchId)}`, {
    method: "DELETE",
  });
}

function getPick(participantId, matchId) {
  return state.picks[participantId]?.[matchId] || null;
}

function getResult(matchId) {
  return state.results[matchId] || null;
}

function isTournamentParticipant(participant) {
  return TOURNAMENT_PARTICIPANT_NAMES.has(participant.name) || participant.id.startsWith(TOURNAMENT_PARTICIPANT_ID_PREFIX);
}

function resolveSlot(slot, participantId) {
  if (slot.team) return slot.team;
  return winnerForMatch(slot.from, participantId);
}

function winnerForMatch(matchId, participantId) {
  const match = MATCH_BY_ID.get(matchId);
  const pick = getPick(participantId, matchId);
  if (!match || !pick) return null;
  const slot = pick === "a" ? match.slots[0] : match.slots[1];
  return resolveSlot(slot, participantId);
}

function resolveActualSlot(slot) {
  if (slot.team) return slot.team;
  return actualWinnerForMatch(slot.from);
}

function actualWinnerForMatch(matchId) {
  const match = MATCH_BY_ID.get(matchId);
  const result = getResult(matchId);
  if (!match || !result) return null;
  const slot = result === "a" ? match.slots[0] : match.slots[1];
  return resolveActualSlot(slot);
}

function descendantIds(matchId) {
  const found = [];
  const queue = [matchId];
  while (queue.length) {
    const current = queue.shift();
    MATCHES.forEach((match) => {
      const dependsOnCurrent = match.slots.some((slot) => slot.from === current);
      if (dependsOnCurrent && !found.includes(match.id)) {
        found.push(match.id);
        queue.push(match.id);
      }
    });
  }
  return found;
}

function completedCount(participantId) {
  return Object.keys(state.picks[participantId] || {}).filter((id) => MATCH_BY_ID.has(id)).length;
}

function scoredMatchCount() {
  return MATCHES.filter((match) => actualWinnerForMatch(match.id)).length;
}

function scoreParticipant(participant) {
  return MATCHES.reduce((summary, match) => {
    const actualWinner = actualWinnerForMatch(match.id);
    if (!actualWinner) return summary;
    summary.scored += 1;
    const predictedWinner = winnerForMatch(match.id, participant.id);
    if (predictedWinner === actualWinner) {
      summary.correct += 1;
      summary.points += ROUND_POINTS[match.round] || 0;
    }
    return summary;
  }, { points: 0, correct: 0, scored: 0 });
}

function scoreboardRows() {
  return state.participants
    .map((participant) => ({
      participant,
      champion: winnerForMatch("T104", participant.id),
      ...scoreParticipant(participant),
    }))
    .sort((a, b) => (
      b.points - a.points
      || b.correct - a.correct
      || completedCount(b.participant.id) - completedCount(a.participant.id)
      || a.participant.name.localeCompare(b.participant.name, "ko")
    ));
}

function pickCountForSide(matchId, side) {
  return state.participants.filter((participant) => getPick(participant.id, matchId) === side).length;
}

function championStandings() {
  const map = new Map();
  state.participants.forEach((participant) => {
    const champion = winnerForMatch("T104", participant.id);
    if (!champion) return;
    const entry = map.get(champion) || { team: champion, count: 0, names: [] };
    entry.count += 1;
    entry.names.push(participant.name);
    map.set(champion, entry);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || getTeam(a.team).rank - getTeam(b.team).rank);
}

function getTeam(code) {
  return TEAMS[code] || { ko: code, en: code, rank: "-" };
}

function flagNode(code) {
  const team = getTeam(code);
  const wrapper = h("span", { className: "flag-frame" });
  const image = h("img", {
    src: `https://api.fifa.com/api/v3/picture/flags-sq-2/${code}`,
    alt: `${team.ko} 국기`,
    loading: "lazy",
  });
  image.addEventListener("error", () => {
    wrapper.classList.add("flag-fallback");
    wrapper.textContent = code;
  });
  wrapper.append(image);
  return wrapper;
}

function setStatus(text, tone = "") {
  els.saveStatus.textContent = text;
  els.saveStatus.className = `save-status${tone ? ` ${tone}` : ""}`;
}

function h(tag, props = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(props || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "className") {
      element.className = value;
    } else if (key === "text") {
      element.textContent = value;
    } else if (key in element && key !== "role") {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  const childList = Array.isArray(children) ? children : [children];
  childList.forEach((child) => {
    if (child === undefined || child === null) return;
    element.append(child);
  });
  return element;
}
