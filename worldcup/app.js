const STORAGE_KEY = "worldcup-god-pickem-v5";
const API_BASE = "/api";
const SYNC_INTERVAL_MS = 5000;
const RANKING_AS_OF = "2026-04-01";
const IS_ADMIN = new URLSearchParams(window.location.search).get("admin") === "1";
const SUPABASE_URL = "https://tvhlonufurkazdykmomy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LAMJL5DR3A4gfb4vC_4nzg_BKMTvW9H";
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

const TEAMS = {
  MEX: { ko: "멕시코", en: "Mexico", rank: 15 },
  RSA: { ko: "남아프리카공화국", en: "South Africa", rank: 60 },
  KOR: { ko: "대한민국", en: "Korea Republic", rank: 25 },
  CZE: { ko: "체코", en: "Czechia", rank: 41 },
  CAN: { ko: "캐나다", en: "Canada", rank: 30 },
  BIH: { ko: "보스니아 헤르체고비나", en: "Bosnia and Herzegovina", rank: 65 },
  QAT: { ko: "카타르", en: "Qatar", rank: 55 },
  SUI: { ko: "스위스", en: "Switzerland", rank: 19 },
  BRA: { ko: "브라질", en: "Brazil", rank: 6 },
  MAR: { ko: "모로코", en: "Morocco", rank: 8 },
  HAI: { ko: "아이티", en: "Haiti", rank: 83 },
  SCO: { ko: "스코틀랜드", en: "Scotland", rank: 43 },
  USA: { ko: "미국", en: "USA", rank: 16 },
  PAR: { ko: "파라과이", en: "Paraguay", rank: 40 },
  AUS: { ko: "호주", en: "Australia", rank: 27 },
  TUR: { ko: "튀르키예", en: "Türkiye", rank: 22 },
  GER: { ko: "독일", en: "Germany", rank: 10 },
  CUW: { ko: "퀴라소", en: "Curaçao", rank: 82 },
  CIV: { ko: "코트디부아르", en: "Côte d'Ivoire", rank: 34 },
  ECU: { ko: "에콰도르", en: "Ecuador", rank: 23 },
  NED: { ko: "네덜란드", en: "Netherlands", rank: 7 },
  JPN: { ko: "일본", en: "Japan", rank: 18 },
  SWE: { ko: "스웨덴", en: "Sweden", rank: 38 },
  TUN: { ko: "튀니지", en: "Tunisia", rank: 44 },
  BEL: { ko: "벨기에", en: "Belgium", rank: 9 },
  EGY: { ko: "이집트", en: "Egypt", rank: 29 },
  IRN: { ko: "이란", en: "IR Iran", rank: 21 },
  NZL: { ko: "뉴질랜드", en: "New Zealand", rank: 85 },
  ESP: { ko: "스페인", en: "Spain", rank: 2 },
  CPV: { ko: "카보베르데", en: "Cabo Verde", rank: 69 },
  KSA: { ko: "사우디아라비아", en: "Saudi Arabia", rank: 61 },
  URU: { ko: "우루과이", en: "Uruguay", rank: 17 },
  FRA: { ko: "프랑스", en: "France", rank: 1 },
  SEN: { ko: "세네갈", en: "Senegal", rank: 14 },
  IRQ: { ko: "이라크", en: "Iraq", rank: 57 },
  NOR: { ko: "노르웨이", en: "Norway", rank: 31 },
  ARG: { ko: "아르헨티나", en: "Argentina", rank: 3 },
  ALG: { ko: "알제리", en: "Algeria", rank: 28 },
  AUT: { ko: "오스트리아", en: "Austria", rank: 24 },
  JOR: { ko: "요르단", en: "Jordan", rank: 63 },
  POR: { ko: "포르투갈", en: "Portugal", rank: 5 },
  COD: { ko: "콩고민주공화국", en: "Congo DR", rank: 46 },
  UZB: { ko: "우즈베키스탄", en: "Uzbekistan", rank: 50 },
  COL: { ko: "콜롬비아", en: "Colombia", rank: 13 },
  ENG: { ko: "잉글랜드", en: "England", rank: 4 },
  CRO: { ko: "크로아티아", en: "Croatia", rank: 11 },
  GHA: { ko: "가나", en: "Ghana", rank: 74 },
  PAN: { ko: "파나마", en: "Panama", rank: 33 },
};

const GROUPS = [
  { id: "A", teams: ["MEX", "RSA", "KOR", "CZE"] },
  { id: "B", teams: ["CAN", "BIH", "QAT", "SUI"] },
  { id: "C", teams: ["BRA", "MAR", "HAI", "SCO"] },
  { id: "D", teams: ["USA", "PAR", "AUS", "TUR"] },
  { id: "E", teams: ["GER", "CUW", "CIV", "ECU"] },
  { id: "F", teams: ["NED", "JPN", "SWE", "TUN"] },
  { id: "G", teams: ["BEL", "EGY", "IRN", "NZL"] },
  { id: "H", teams: ["ESP", "CPV", "KSA", "URU"] },
  { id: "I", teams: ["FRA", "SEN", "IRQ", "NOR"] },
  { id: "J", teams: ["ARG", "ALG", "AUT", "JOR"] },
  { id: "K", teams: ["POR", "COD", "UZB", "COL"] },
  { id: "L", teams: ["ENG", "CRO", "GHA", "PAN"] },
];

const MATCHES = [
  { id: "M1", no: 1, group: "A", date: "2026-06-11", time: "1:00 p.m. UTC-6", home: "MEX", away: "RSA", venue: "Estadio Azteca", city: "Mexico City" },
  { id: "M2", no: 2, group: "A", date: "2026-06-11", time: "8:00 p.m. UTC-6", home: "KOR", away: "CZE", venue: "Estadio Akron", city: "Zapopan" },
  { id: "M25", no: 25, group: "A", date: "2026-06-18", time: "12:00 p.m. UTC-4", home: "CZE", away: "RSA", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "M28", no: 28, group: "A", date: "2026-06-18", time: "7:00 p.m. UTC-6", home: "MEX", away: "KOR", venue: "Estadio Akron", city: "Zapopan" },
  { id: "M53", no: 53, group: "A", date: "2026-06-24", time: "7:00 p.m. UTC-6", home: "CZE", away: "MEX", venue: "Estadio Azteca", city: "Mexico City" },
  { id: "M54", no: 54, group: "A", date: "2026-06-24", time: "7:00 p.m. UTC-6", home: "RSA", away: "KOR", venue: "Estadio BBVA", city: "Guadalupe" },

  { id: "M3", no: 3, group: "B", date: "2026-06-12", time: "3:00 p.m. UTC-4", home: "CAN", away: "BIH", venue: "BMO Field", city: "Toronto" },
  { id: "M8", no: 8, group: "B", date: "2026-06-13", time: "12:00 p.m. UTC-7", home: "QAT", away: "SUI", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: "M26", no: 26, group: "B", date: "2026-06-18", time: "12:00 p.m. UTC-7", home: "SUI", away: "BIH", venue: "SoFi Stadium", city: "Inglewood" },
  { id: "M27", no: 27, group: "B", date: "2026-06-18", time: "3:00 p.m. UTC-7", home: "CAN", away: "QAT", venue: "BC Place", city: "Vancouver" },
  { id: "M51", no: 51, group: "B", date: "2026-06-24", time: "12:00 p.m. UTC-7", home: "SUI", away: "CAN", venue: "BC Place", city: "Vancouver" },
  { id: "M52", no: 52, group: "B", date: "2026-06-24", time: "12:00 p.m. UTC-7", home: "BIH", away: "QAT", venue: "Lumen Field", city: "Seattle" },

  { id: "M7", no: 7, group: "C", date: "2026-06-13", time: "6:00 p.m. UTC-4", home: "BRA", away: "MAR", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: "M5", no: 5, group: "C", date: "2026-06-13", time: "9:00 p.m. UTC-4", home: "HAI", away: "SCO", venue: "Gillette Stadium", city: "Foxborough" },
  { id: "M30", no: 30, group: "C", date: "2026-06-19", time: "6:00 p.m. UTC-4", home: "SCO", away: "MAR", venue: "Gillette Stadium", city: "Foxborough" },
  { id: "M29", no: 29, group: "C", date: "2026-06-19", time: "8:30 p.m. UTC-4", home: "BRA", away: "HAI", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "M49", no: 49, group: "C", date: "2026-06-24", time: "6:00 p.m. UTC-4", home: "SCO", away: "BRA", venue: "Hard Rock Stadium", city: "Miami Gardens" },
  { id: "M50", no: 50, group: "C", date: "2026-06-24", time: "6:00 p.m. UTC-4", home: "MAR", away: "HAI", venue: "Mercedes-Benz Stadium", city: "Atlanta" },

  { id: "M4", no: 4, group: "D", date: "2026-06-12", time: "6:00 p.m. UTC-7", home: "USA", away: "PAR", venue: "SoFi Stadium", city: "Inglewood" },
  { id: "M6", no: 6, group: "D", date: "2026-06-13", time: "9:00 p.m. UTC-7", home: "AUS", away: "TUR", venue: "BC Place", city: "Vancouver" },
  { id: "M32", no: 32, group: "D", date: "2026-06-19", time: "12:00 p.m. UTC-7", home: "USA", away: "AUS", venue: "Lumen Field", city: "Seattle" },
  { id: "M31", no: 31, group: "D", date: "2026-06-19", time: "8:00 p.m. UTC-7", home: "TUR", away: "PAR", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: "M59", no: 59, group: "D", date: "2026-06-25", time: "7:00 p.m. UTC-7", home: "TUR", away: "USA", venue: "SoFi Stadium", city: "Inglewood" },
  { id: "M60", no: 60, group: "D", date: "2026-06-25", time: "7:00 p.m. UTC-7", home: "PAR", away: "AUS", venue: "Levi's Stadium", city: "Santa Clara" },

  { id: "M10", no: 10, group: "E", date: "2026-06-14", time: "12:00 p.m. UTC-5", home: "GER", away: "CUW", venue: "NRG Stadium", city: "Houston" },
  { id: "M9", no: 9, group: "E", date: "2026-06-14", time: "7:00 p.m. UTC-4", home: "CIV", away: "ECU", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "M33", no: 33, group: "E", date: "2026-06-20", time: "4:00 p.m. UTC-4", home: "GER", away: "CIV", venue: "BMO Field", city: "Toronto" },
  { id: "M34", no: 34, group: "E", date: "2026-06-20", time: "7:00 p.m. UTC-5", home: "ECU", away: "CUW", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "M55", no: 55, group: "E", date: "2026-06-25", time: "4:00 p.m. UTC-4", home: "CUW", away: "CIV", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "M56", no: 56, group: "E", date: "2026-06-25", time: "4:00 p.m. UTC-4", home: "ECU", away: "GER", venue: "MetLife Stadium", city: "East Rutherford" },

  { id: "M11", no: 11, group: "F", date: "2026-06-14", time: "3:00 p.m. UTC-5", home: "NED", away: "JPN", venue: "AT&T Stadium", city: "Arlington" },
  { id: "M12", no: 12, group: "F", date: "2026-06-14", time: "8:00 p.m. UTC-6", home: "SWE", away: "TUN", venue: "Estadio BBVA", city: "Guadalupe" },
  { id: "M35", no: 35, group: "F", date: "2026-06-20", time: "12:00 p.m. UTC-5", home: "NED", away: "SWE", venue: "NRG Stadium", city: "Houston" },
  { id: "M36", no: 36, group: "F", date: "2026-06-20", time: "10:00 p.m. UTC-6", home: "TUN", away: "JPN", venue: "Estadio BBVA", city: "Guadalupe" },
  { id: "M57", no: 57, group: "F", date: "2026-06-25", time: "6:00 p.m. UTC-5", home: "JPN", away: "SWE", venue: "AT&T Stadium", city: "Arlington" },
  { id: "M58", no: 58, group: "F", date: "2026-06-25", time: "6:00 p.m. UTC-5", home: "TUN", away: "NED", venue: "Arrowhead Stadium", city: "Kansas City" },

  { id: "M16", no: 16, group: "G", date: "2026-06-15", time: "12:00 p.m. UTC-7", home: "BEL", away: "EGY", venue: "Lumen Field", city: "Seattle" },
  { id: "M15", no: 15, group: "G", date: "2026-06-15", time: "6:00 p.m. UTC-7", home: "IRN", away: "NZL", venue: "SoFi Stadium", city: "Inglewood" },
  { id: "M39", no: 39, group: "G", date: "2026-06-21", time: "12:00 p.m. UTC-7", home: "BEL", away: "IRN", venue: "SoFi Stadium", city: "Inglewood" },
  { id: "M40", no: 40, group: "G", date: "2026-06-21", time: "6:00 p.m. UTC-7", home: "NZL", away: "EGY", venue: "BC Place", city: "Vancouver" },
  { id: "M63", no: 63, group: "G", date: "2026-06-26", time: "8:00 p.m. UTC-7", home: "EGY", away: "IRN", venue: "Lumen Field", city: "Seattle" },
  { id: "M64", no: 64, group: "G", date: "2026-06-26", time: "8:00 p.m. UTC-7", home: "NZL", away: "BEL", venue: "BC Place", city: "Vancouver" },

  { id: "M14", no: 14, group: "H", date: "2026-06-15", time: "12:00 p.m. UTC-4", home: "ESP", away: "CPV", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "M13", no: 13, group: "H", date: "2026-06-15", time: "6:00 p.m. UTC-4", home: "KSA", away: "URU", venue: "Hard Rock Stadium", city: "Miami Gardens" },
  { id: "M38", no: 38, group: "H", date: "2026-06-21", time: "12:00 p.m. UTC-4", home: "ESP", away: "KSA", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "M37", no: 37, group: "H", date: "2026-06-21", time: "6:00 p.m. UTC-4", home: "URU", away: "CPV", venue: "Hard Rock Stadium", city: "Miami Gardens" },
  { id: "M65", no: 65, group: "H", date: "2026-06-26", time: "7:00 p.m. UTC-5", home: "CPV", away: "KSA", venue: "NRG Stadium", city: "Houston" },
  { id: "M66", no: 66, group: "H", date: "2026-06-26", time: "6:00 p.m. UTC-6", home: "URU", away: "ESP", venue: "Estadio Akron", city: "Zapopan" },

  { id: "M17", no: 17, group: "I", date: "2026-06-16", time: "3:00 p.m. UTC-4", home: "FRA", away: "SEN", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: "M18", no: 18, group: "I", date: "2026-06-16", time: "6:00 p.m. UTC-4", home: "IRQ", away: "NOR", venue: "Gillette Stadium", city: "Foxborough" },
  { id: "M42", no: 42, group: "I", date: "2026-06-22", time: "5:00 p.m. UTC-4", home: "FRA", away: "IRQ", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "M41", no: 41, group: "I", date: "2026-06-22", time: "8:00 p.m. UTC-4", home: "NOR", away: "SEN", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: "M61", no: 61, group: "I", date: "2026-06-26", time: "3:00 p.m. UTC-4", home: "NOR", away: "FRA", venue: "Gillette Stadium", city: "Foxborough" },
  { id: "M62", no: 62, group: "I", date: "2026-06-26", time: "3:00 p.m. UTC-4", home: "SEN", away: "IRQ", venue: "BMO Field", city: "Toronto" },

  { id: "M19", no: 19, group: "J", date: "2026-06-16", time: "8:00 p.m. UTC-5", home: "ARG", away: "ALG", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "M20", no: 20, group: "J", date: "2026-06-16", time: "9:00 p.m. UTC-7", home: "AUT", away: "JOR", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: "M43", no: 43, group: "J", date: "2026-06-22", time: "12:00 p.m. UTC-5", home: "ARG", away: "AUT", venue: "AT&T Stadium", city: "Arlington" },
  { id: "M44", no: 44, group: "J", date: "2026-06-22", time: "8:00 p.m. UTC-7", home: "JOR", away: "ALG", venue: "Levi's Stadium", city: "Santa Clara" },
  { id: "M69", no: 69, group: "J", date: "2026-06-27", time: "9:00 p.m. UTC-5", home: "ALG", away: "AUT", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "M70", no: 70, group: "J", date: "2026-06-27", time: "9:00 p.m. UTC-5", home: "JOR", away: "ARG", venue: "AT&T Stadium", city: "Arlington" },

  { id: "M23", no: 23, group: "K", date: "2026-06-17", time: "12:00 p.m. UTC-5", home: "POR", away: "COD", venue: "NRG Stadium", city: "Houston" },
  { id: "M24", no: 24, group: "K", date: "2026-06-17", time: "8:00 p.m. UTC-6", home: "UZB", away: "COL", venue: "Estadio Azteca", city: "Mexico City" },
  { id: "M47", no: 47, group: "K", date: "2026-06-23", time: "12:00 p.m. UTC-5", home: "POR", away: "UZB", venue: "NRG Stadium", city: "Houston" },
  { id: "M48", no: 48, group: "K", date: "2026-06-23", time: "8:00 p.m. UTC-6", home: "COL", away: "COD", venue: "Estadio Akron", city: "Zapopan" },
  { id: "M71", no: 71, group: "K", date: "2026-06-27", time: "7:30 p.m. UTC-4", home: "COL", away: "POR", venue: "Hard Rock Stadium", city: "Miami Gardens" },
  { id: "M72", no: 72, group: "K", date: "2026-06-27", time: "7:30 p.m. UTC-4", home: "COD", away: "UZB", venue: "Mercedes-Benz Stadium", city: "Atlanta" },

  { id: "M22", no: 22, group: "L", date: "2026-06-17", time: "3:00 p.m. UTC-5", home: "ENG", away: "CRO", venue: "AT&T Stadium", city: "Arlington" },
  { id: "M21", no: 21, group: "L", date: "2026-06-17", time: "7:00 p.m. UTC-4", home: "GHA", away: "PAN", venue: "BMO Field", city: "Toronto" },
  { id: "M45", no: 45, group: "L", date: "2026-06-23", time: "4:00 p.m. UTC-4", home: "ENG", away: "GHA", venue: "Gillette Stadium", city: "Foxborough" },
  { id: "M46", no: 46, group: "L", date: "2026-06-23", time: "7:00 p.m. UTC-4", home: "PAN", away: "CRO", venue: "BMO Field", city: "Toronto" },
  { id: "M67", no: 67, group: "L", date: "2026-06-27", time: "5:00 p.m. UTC-4", home: "PAN", away: "ENG", venue: "MetLife Stadium", city: "East Rutherford" },
  { id: "M68", no: 68, group: "L", date: "2026-06-27", time: "5:00 p.m. UTC-4", home: "CRO", away: "GHA", venue: "Lincoln Financial Field", city: "Philadelphia" },
];

const AI_PARTICIPANT = Object.freeze({ id: "person-ai-worldcup-god", name: "AI 승부의신", isAi: true });
const AI_PREDICTIONS = buildAiPredictions();

const els = {
  workspace: document.querySelector("#workspace"),
  startPanel: document.querySelector("#startPanel"),
  groupsGrid: document.querySelector("#groupsGrid"),
  selectedGroupEyebrow: document.querySelector("#selectedGroupEyebrow"),
  selectedGroupTitle: document.querySelector("#selectedGroupTitle"),
  selectedTeams: document.querySelector("#selectedTeams"),
  groupProgress: document.querySelector("#groupProgress"),
  scheduleList: document.querySelector("#scheduleList"),
  predictionPanel: document.querySelector("#predictionPanel"),
  matchPredictionsPanel: document.querySelector("#matchPredictionsPanel"),
  resultPanel: document.querySelector("#resultPanel"),
  saveStatus: document.querySelector("#saveStatus"),
  resultSaveStatus: document.querySelector("#resultSaveStatus"),
  participantForm: document.querySelector("#participantForm"),
  participantName: document.querySelector("#participantName"),
  participantSelect: document.querySelector("#participantSelect"),
  removeParticipantBtn: document.querySelector("#removeParticipantBtn"),
  adminActions: document.querySelector("#adminActions"),
  resultCard: document.querySelector("#resultCard"),
  pickedStat: document.querySelector("#pickedStat"),
  resultStat: document.querySelector("#resultStat"),
  rankingList: document.querySelector("#rankingList"),
  participantProgress: document.querySelector("#participantProgress"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  resetBtn: document.querySelector("#resetBtn"),
};

let state = loadState();
let serverOnline = false;
let lastSyncAt = null;
normaliseState();
render();
syncFromServer();
setInterval(syncFromServer, SYNC_INTERVAL_MS);

function defaultState() {
  return {
    participants: [
      { id: "person-cho-younghun", name: "조영훈" },
      { id: "person-cho-sihun", name: "조시훈" },
      { id: "person-kim-hyunsung", name: "김현성" },
    ],
    selectedParticipantId: "",
    selectedGroup: "A",
    selectedMatchId: "M1",
    predictions: { [AI_PARTICIPANT.id]: { ...AI_PREDICTIONS } },
    results: {},
  };
}

function createId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return defaultState();
    return { ...defaultState(), ...saved, selectedParticipantId: "" };
  } catch {
    return defaultState();
  }
}

function normaliseState() {
  const seenParticipants = new Set();
  state.participants = Array.isArray(state.participants)
    ? state.participants
      .filter((participant) => participant?.id && participant?.name)
      .map((participant) => (
        participant.id === AI_PARTICIPANT.id
          ? { ...AI_PARTICIPANT }
          : { id: participant.id, name: participant.name }
      ))
      .filter((participant) => {
        if (seenParticipants.has(participant.id)) return false;
        seenParticipants.add(participant.id);
        return true;
      })
    : [];
  state.predictions = state.predictions && typeof state.predictions === "object" ? state.predictions : {};
  state.results = state.results && typeof state.results === "object" ? state.results : {};
  state.participants = state.participants.filter((participant) => participant.id !== AI_PARTICIPANT.id);
  state.participants.push({ ...AI_PARTICIPANT });
  state.predictions[AI_PARTICIPANT.id] = { ...AI_PREDICTIONS };

  if (!GROUPS.some((group) => group.id === state.selectedGroup)) {
    state.selectedGroup = "A";
  }

  if (!MATCHES.some((match) => match.id === state.selectedMatchId && match.group === state.selectedGroup)) {
    state.selectedMatchId = matchesForGroup(state.selectedGroup)[0]?.id || MATCHES[0].id;
  }

  if (!state.participants.some((participant) => participant.id === state.selectedParticipantId)) {
    state.selectedParticipantId = "";
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sharedState() {
  return {
    participants: state.participants.filter((participant) => !participantIsAi(participant.id)),
    predictions: persistablePredictions(),
    results: state.results,
  };
}

function persistablePredictions() {
  return Object.fromEntries(
    Object.entries(state.predictions || {}).filter(([participantId]) => !participantIsAi(participantId)),
  );
}

function applySharedState(shared) {
  if (!shared || typeof shared !== "object") return;
  state.participants = Array.isArray(shared.participants) ? shared.participants : state.participants;
  state.predictions = shared.predictions && typeof shared.predictions === "object" ? shared.predictions : state.predictions;
  state.results = shared.results && typeof shared.results === "object" ? shared.results : state.results;
  lastSyncAt = shared.updatedAt || new Date().toISOString();
  normaliseState();
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
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

async function supabaseReadState() {
  const [participants, predictions, results] = await Promise.all([
    supabaseRest("worldcup_participants?select=id,name,sort_order&order=sort_order.asc,created_at.asc"),
    supabaseRest("worldcup_predictions?select=participant_id,match_id,home_score,away_score,updated_at"),
    supabaseRest("worldcup_results?select=match_id,home_score,away_score,updated_at"),
  ]);

  const shared = {
    participants: participants.map((participant) => ({ id: participant.id, name: participant.name })),
    predictions: {},
    results: {},
    updatedAt: new Date().toISOString(),
  };

  predictions.forEach((prediction) => {
    shared.predictions[prediction.participant_id] = shared.predictions[prediction.participant_id] || {};
    shared.predictions[prediction.participant_id][prediction.match_id] = {
      home: prediction.home_score,
      away: prediction.away_score,
    };
  });

  results.forEach((result) => {
    shared.results[result.match_id] = {
      home: result.home_score,
      away: result.away_score,
    };
  });

  return shared;
}

async function supabaseWrite(path, options = {}) {
  const method = options.method || "GET";
  const body = options.body ? JSON.parse(options.body) : {};
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

  if (method === "POST" && path === "/participants") {
    const nextOrder = state.participants.findIndex((participant) => participant.id === body.id);
    await supabaseRest("worldcup_participants?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        id: body.id,
        name: body.name,
        sort_order: nextOrder >= 0 ? nextOrder : state.participants.length,
      }),
    });
  } else if (method === "DELETE" && parts[0] === "participants" && parts[1]) {
    await supabaseRest(`worldcup_participants?id=${eqFilter(parts[1])}`, { method: "DELETE" });
  } else if ((method === "PUT" || method === "DELETE") && parts[0] === "predictions" && parts[1] && parts[2]) {
    if (method === "DELETE") {
      await supabaseRest(`worldcup_predictions?participant_id=${eqFilter(parts[1])}&match_id=${eqFilter(parts[2])}`, { method: "DELETE" });
    } else {
      await supabaseRest("worldcup_predictions?on_conflict=participant_id,match_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          participant_id: parts[1],
          match_id: parts[2],
          home_score: body.home,
          away_score: body.away,
        }),
      });
    }
  } else if ((method === "PUT" || method === "DELETE") && parts[0] === "results" && parts[1]) {
    if (method === "DELETE") {
      await supabaseRest(`worldcup_results?match_id=${eqFilter(parts[1])}`, { method: "DELETE" });
    } else {
      await supabaseRest("worldcup_results?on_conflict=match_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          match_id: parts[1],
          home_score: body.home,
          away_score: body.away,
        }),
      });
    }
  } else if (method === "POST" && path === "/import") {
    await supabaseImport(body);
  } else if (method === "POST" && path === "/reset") {
    await supabaseReset();
  }

  return supabaseReadState();
}

async function supabaseImport(imported) {
  if (Array.isArray(imported.participants) && imported.participants.length) {
    await supabaseRest("worldcup_participants?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(imported.participants.map((participant, index) => ({
        id: participant.id,
        name: participant.name,
        sort_order: index,
      }))),
    });
  }

  const predictionRows = [];
  Object.entries(imported.predictions || {}).forEach(([participantId, picks]) => {
    Object.entries(picks || {}).forEach(([matchId, score]) => {
      if (!hasAnyScore(score)) return;
      predictionRows.push({
        participant_id: participantId,
        match_id: matchId,
        home_score: score.home,
        away_score: score.away,
      });
    });
  });
  if (predictionRows.length) {
    await supabaseRest("worldcup_predictions?on_conflict=participant_id,match_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(predictionRows),
    });
  }

  const resultRows = Object.entries(imported.results || {})
    .filter(([, score]) => hasAnyScore(score))
    .map(([matchId, score]) => ({
      match_id: matchId,
      home_score: score.home,
      away_score: score.away,
    }));
  if (resultRows.length) {
    await supabaseRest("worldcup_results?on_conflict=match_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(resultRows),
    });
  }
}

async function supabaseReset() {
  await supabaseRest("worldcup_predictions?participant_id=neq.__never__", { method: "DELETE" });
  await supabaseRest("worldcup_results?match_id=neq.__never__", { method: "DELETE" });
  await supabaseRest("worldcup_participants?id=neq.__never__", { method: "DELETE" });

  const defaults = defaultState().participants.map((participant, index) => ({
    id: participant.id,
    name: participant.name,
    sort_order: index,
  }));
  await supabaseRest("worldcup_participants", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(defaults),
  });
}

async function syncFromServer() {
  if (document.activeElement?.classList?.contains("score-input")) return;
  try {
    let shared;
    try {
      shared = USE_SUPABASE ? await supabaseReadState() : await apiRequest("/state");
    } catch (error) {
      if (!USE_SUPABASE) throw error;
      shared = await apiRequest("/state");
    }
    serverOnline = true;
    applySharedState(shared);
    render();
  } catch {
    serverOnline = false;
  }
}

async function pushSharedState(path, options, renderOnSuccess = true) {
  try {
    let shared;
    try {
      shared = USE_SUPABASE ? await supabaseWrite(path, options) : await apiRequest(path, options);
    } catch (error) {
      if (!USE_SUPABASE) throw error;
      shared = await apiRequest(path, options);
    }
    serverOnline = true;
    if (shared) {
      applySharedState(shared);
      if (renderOnSuccess) render();
      else saveState();
    }
  } catch {
    serverOnline = false;
    flashSharedSaveFailure(path);
  }
}

function render() {
  normaliseState();
  renderMode();
  renderParticipantSelect();
  renderStats();
  renderLeaderboard();
  renderParticipantProgress();
  const hasSelectedParticipant = Boolean(currentParticipant());
  renderEntryState(hasSelectedParticipant);
  if (hasSelectedParticipant) {
    renderGroups();
    renderSelectedGroup();
    renderSchedule();
    renderPredictionPanel();
    renderMatchPredictionsPanel();
    if (IS_ADMIN) renderResultPanel();
  }
  saveState();
}

function renderMode() {
  els.adminActions.hidden = !IS_ADMIN;
  els.participantForm.hidden = false;
  els.removeParticipantBtn.hidden = !IS_ADMIN;
  els.resultCard.hidden = !IS_ADMIN;
}

function renderParticipantSelect() {
  const selected = state.selectedParticipantId;
  els.participantSelect.replaceChildren();

  if (!state.participants.length) {
    els.participantSelect.append(optionNode("", "참가자 없음"));
    els.participantSelect.disabled = true;
    els.removeParticipantBtn.disabled = true;
    return;
  }

  els.participantSelect.disabled = false;
  els.removeParticipantBtn.disabled = !IS_ADMIN || !selected || participantIsAi(selected);
  els.participantSelect.append(optionNode("", "참가자 선택"));
  state.participants.forEach((participant) => {
    els.participantSelect.append(optionNode(participant.id, participant.name));
  });
  els.participantSelect.value = selected;
}

function renderEntryState(hasSelectedParticipant) {
  els.startPanel.hidden = hasSelectedParticipant;
  els.workspace.hidden = !hasSelectedParticipant;
}

function renderStats() {
  const picked = countPredictions(state.selectedParticipantId);
  const results = countResults();
  els.pickedStat.textContent = `${picked}/${MATCHES.length}`;
  els.resultStat.textContent = `${results}/${MATCHES.length}`;
}

function renderGroups() {
  els.groupsGrid.replaceChildren();
  GROUPS.forEach((group) => {
    const card = h("button", {
      className: `group-card${group.id === state.selectedGroup ? " active" : ""}`,
      type: "button",
      "aria-pressed": String(group.id === state.selectedGroup),
    });
    card.addEventListener("click", () => selectGroup(group.id));

    const header = h("div", { className: "group-card-header" }, [
      h("span", { className: "group-letter", text: group.id }),
      h("span", { className: "group-card-title", text: `Group ${group.id}` }),
      h("span", { className: "mini-progress", text: `${countGroupPredictions(group.id, state.selectedParticipantId)}/6` }),
    ]);

    const teamList = h("div", { className: "group-team-list" });
    group.teams.forEach((code) => teamList.append(teamRow(code, "compact")));
    card.append(header, teamList);
    els.groupsGrid.append(card);
  });
}

function renderSelectedGroup() {
  const group = currentGroup();
  const progress = countGroupPredictions(group.id, state.selectedParticipantId);
  els.selectedGroupEyebrow.textContent = `Group ${group.id}`;
  els.selectedGroupTitle.textContent = `${group.id}조 일정`;
  els.groupProgress.textContent = `${progress}/6`;
  els.selectedTeams.replaceChildren();
  group.teams.forEach((code) => els.selectedTeams.append(teamRow(code, "large")));
}

function renderSchedule() {
  els.scheduleList.replaceChildren();
  matchesForGroup(state.selectedGroup).forEach((match) => {
    const pick = getPrediction(state.selectedParticipantId, match.id);
    const result = getResult(match.id);
    const selected = match.id === state.selectedMatchId;
    const row = h("button", {
      className: `fixture-row${selected ? " active" : ""}`,
      type: "button",
      "aria-pressed": String(selected),
    });
    row.addEventListener("click", () => selectMatch(match.id));

    row.append(
      h("div", { className: "fixture-meta" }, [
        h("span", { text: `Match ${match.no}` }),
        h("span", { text: formatKoreaDate(match) }),
        h("span", { text: formatKoreaTime(match) }),
      ]),
      h("div", { className: "fixture-teams" }, [
        fixtureTeam(match.home),
        h("span", { className: "versus", text: "vs" }),
        fixtureTeam(match.away),
      ]),
      h("div", { className: "fixture-bottom" }, [
        h("span", { text: `${match.venue}, ${match.city}` }),
        h("strong", { text: fixtureStatusText(pick, result) }),
      ]),
    );
    els.scheduleList.append(row);
  });
}

function renderPredictionPanel() {
  const participant = currentParticipant();
  const match = currentMatch();
  const pick = getPrediction(participant?.id, match.id);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const locked = participantIsAi(participant?.id);
  els.predictionPanel.replaceChildren();
  els.saveStatus.textContent = locked ? "AI 예측" : "자동 저장";

  const panel = h("div", { className: "prediction-inner" });
  const header = h("div", { className: "prediction-match-meta" }, [
    h("span", { text: `Match ${match.no}` }),
    h("span", { text: `${formatKoreaDate(match)} · ${formatKoreaTime(match)}` }),
    h("span", { text: `${match.venue}, ${match.city}` }),
  ]);

  const homeInput = scoreInput(pick?.home);
  const awayInput = scoreInput(pick?.away);
  homeInput.disabled = !participant || locked;
  awayInput.disabled = !participant || locked;

  const saveCurrentPrediction = () => {
    if (!participant || locked) return;
    const score = normaliseScore(homeInput.value, awayInput.value);
    setPrediction(participant.id, match.id, score);
    flashSaved(hasScore(score) ? "저장됨" : "비어 있음");
    renderStats();
    renderGroups();
    renderSelectedGroup();
    renderSchedule();
    renderMatchPredictionsPanel();
    renderParticipantProgress();
  };

  homeInput.addEventListener("input", saveCurrentPrediction);
  awayInput.addEventListener("input", saveCurrentPrediction);

  const scoreBoard = h("div", { className: "score-board" }, [
    predictionTeam(match.home, "home"),
    h("div", { className: "score-entry" }, [
      homeInput,
      h("span", { text: ":" }),
      awayInput,
    ]),
    predictionTeam(match.away, "away"),
  ]);

  const actions = h("div", { className: "prediction-actions" });
  const clear = h("button", { className: "ghost-button", type: "button", text: "예측 지우기" });
  clear.disabled = !participant || !pick || locked;
  clear.addEventListener("click", () => {
    if (!participant || locked) return;
    deletePrediction(participant.id, match.id);
    render();
    flashSaved("삭제됨");
  });
  actions.append(clear);

  const helper = h("p", {
    className: "prediction-helper",
    text: locked
      ? `${participant.name}의 랭킹 기반 자동 예측입니다.`
      : participant
      ? `${participant.name}님의 ${home.ko} vs ${away.ko} 예상 스코어를 입력하세요.`
      : "참가자를 추가하면 경기별 예상 스코어를 저장할 수 있습니다.",
  });

  panel.append(header, scoreBoard, actions, helper);
  els.predictionPanel.append(panel);
}

function renderResultPanel() {
  const match = currentMatch();
  const result = getResult(match.id);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  els.resultPanel.replaceChildren();
  els.resultSaveStatus.textContent = "자동 저장";

  const panel = h("div", { className: "prediction-inner" });
  const header = h("div", { className: "prediction-match-meta" }, [
    h("span", { text: `Match ${match.no}` }),
    h("span", { text: `${formatKoreaDate(match)} · ${formatKoreaTime(match)}` }),
    h("span", { text: `${match.venue}, ${match.city}` }),
  ]);

  const homeInput = scoreInput(result?.home);
  const awayInput = scoreInput(result?.away);

  const saveCurrentResult = () => {
    const score = normaliseScore(homeInput.value, awayInput.value);
    setResult(match.id, score);
    flashResultSaved(hasScore(score) ? "저장됨" : "비어 있음");
    renderStats();
    renderSchedule();
    renderMatchPredictionsPanel();
    renderLeaderboard();
    renderParticipantProgress();
  };

  homeInput.addEventListener("input", saveCurrentResult);
  awayInput.addEventListener("input", saveCurrentResult);

  const scoreBoard = h("div", { className: "score-board compact-score-board" }, [
    predictionTeam(match.home, "home"),
    h("div", { className: "score-entry" }, [
      homeInput,
      h("span", { text: ":" }),
      awayInput,
    ]),
    predictionTeam(match.away, "away"),
  ]);

  const actions = h("div", { className: "prediction-actions" });
  const clear = h("button", { className: "ghost-button", type: "button", text: "결과 지우기" });
  clear.disabled = !result;
  clear.addEventListener("click", () => {
    deleteResult(match.id);
    render();
    flashResultSaved("삭제됨");
  });
  actions.append(clear);

  const helper = h("p", {
    className: "prediction-helper",
    text: `${home.ko} vs ${away.ko} 실제 결과를 입력하면 순위표가 바로 계산됩니다.`,
  });

  panel.append(header, scoreBoard, actions, helper);
  els.resultPanel.append(panel);
}

function renderMatchPredictionsPanel() {
  const match = currentMatch();
  const result = getResult(match.id);
  els.matchPredictionsPanel.replaceChildren();

  const list = h("div", { className: "match-picks-list" });
  state.participants.forEach((participant) => {
    const pick = getPrediction(participant.id, match.id);
    const score = scorePrediction(pick, result);
    const isCurrent = participant.id === state.selectedParticipantId;
    const card = h("article", {
      className: `match-pick-card${isCurrent ? " current" : ""}${participantIsAi(participant.id) ? " ai-card" : ""}`,
    });

    card.append(
      h("div", { className: "match-pick-heading" }, [
        h("strong", { text: participant.name }),
        h("span", { text: matchPickStatusText(pick, result, score) }),
      ]),
      readOnlyScoreBoard(match, pick),
    );
    list.append(card);
  });

  els.matchPredictionsPanel.append(list);
}

function renderLeaderboard() {
  els.rankingList.replaceChildren();
  const rows = getLeaderboard();
  if (!rows.length) {
    els.rankingList.append(emptyState("참가자가 없습니다.", "참가자를 추가하면 순위표가 표시됩니다."));
    return;
  }

  rows.forEach((row, index) => {
    const rankCard = h("article", { className: `rank-card${index === 0 ? " top" : ""}${participantIsAi(row.id) ? " ai-card" : ""}` }, [
      h("div", { className: "rank-number", text: index + 1 }),
      h("div", { className: "rank-main" }, [
        h("strong", { text: row.name }),
        h("span", { text: `${row.picked}/${MATCHES.length} 예측 · ${row.scoredMatches}경기 채점` }),
      ]),
      h("div", { className: "rank-score" }, [
        h("strong", { text: `${row.points}점` }),
        h("span", { text: `정확 ${row.exact} · 승무패 ${row.outcome}` }),
      ]),
    ]);
    els.rankingList.append(rankCard);
  });
}

function renderParticipantProgress() {
  els.participantProgress.replaceChildren();
  if (!state.participants.length) {
    els.participantProgress.append(emptyState("참가자가 없습니다.", "친구 이름을 추가하면 예측 현황이 표시됩니다."));
    return;
  }

  state.participants.forEach((participant) => {
    const picked = countPredictions(participant.id);
    const rank = getLeaderboard().find((entry) => entry.id === participant.id);
    const percent = Math.round((picked / MATCHES.length) * 100);
    const row = h("article", { className: `progress-card${participantIsAi(participant.id) ? " ai-card" : ""}` }, [
      h("div", { className: "progress-card-top" }, [
        h("strong", { text: participant.name }),
        h("span", { text: `${rank?.points || 0}점` }),
      ]),
      h("div", { className: "progress-track" }, [
        h("span", { className: "progress-fill", style: `width: ${percent}%` }),
      ]),
      h("p", { text: `${picked}/${MATCHES.length} 예측 · ${percent}% 완료` }),
    ]);
    els.participantProgress.append(row);
  });
}

function selectGroup(groupId) {
  state.selectedGroup = groupId;
  state.selectedMatchId = matchesForGroup(groupId)[0].id;
  render();
}

function selectMatch(matchId) {
  state.selectedMatchId = matchId;
  renderSchedule();
  renderPredictionPanel();
  renderMatchPredictionsPanel();
  if (IS_ADMIN) renderResultPanel();
}

function addParticipant(name) {
  const cleanName = name.trim();
  if (!cleanName) return;
  const duplicated = state.participants.some((participant) => participant.name.toLowerCase() === cleanName.toLowerCase());
  if (duplicated) return;
  const participant = { id: createId("person"), name: cleanName };
  state.participants.push(participant);
  state.selectedParticipantId = participant.id;
  render();
  pushSharedState("/participants", {
    method: "POST",
    body: JSON.stringify({ id: participant.id, name: participant.name }),
  });
}

function removeCurrentParticipant() {
  if (!IS_ADMIN) return;
  const participant = currentParticipant();
  if (!participant) return;
  if (participantIsAi(participant.id)) return;
  const ok = window.confirm(`${participant.name}님과 해당 예측을 삭제할까요?`);
  if (!ok) return;
  state.participants = state.participants.filter((item) => item.id !== participant.id);
  delete state.predictions[participant.id];
  state.selectedParticipantId = "";
  render();
  pushSharedState(`/participants/${encodeURIComponent(participant.id)}`, { method: "DELETE" });
}

function currentGroup() {
  return GROUPS.find((group) => group.id === state.selectedGroup) || GROUPS[0];
}

function currentMatch() {
  return MATCHES.find((match) => match.id === state.selectedMatchId) || MATCHES[0];
}

function currentParticipant() {
  return state.participants.find((participant) => participant.id === state.selectedParticipantId) || null;
}

function participantIsAi(participantId) {
  return participantId === AI_PARTICIPANT.id;
}

function matchesForGroup(groupId) {
  return MATCHES.filter((match) => match.group === groupId);
}

function getTeam(code) {
  return TEAMS[code];
}

function getPrediction(participantId, matchId) {
  if (!participantId) return null;
  return state.predictions[participantId]?.[matchId] || null;
}

function getResult(matchId) {
  return state.results[matchId] || null;
}

function setPrediction(participantId, matchId, score) {
  if (participantIsAi(participantId)) return;
  state.predictions[participantId] = state.predictions[participantId] || {};
  if (!hasAnyScore(score)) {
    delete state.predictions[participantId][matchId];
    pushSharedState(`/predictions/${encodeURIComponent(participantId)}/${encodeURIComponent(matchId)}`, { method: "DELETE" }, false);
  } else {
    state.predictions[participantId][matchId] = score;
    pushSharedState(`/predictions/${encodeURIComponent(participantId)}/${encodeURIComponent(matchId)}`, {
      method: "PUT",
      body: JSON.stringify(score),
    }, false);
  }
  saveState();
}

function setResult(matchId, score) {
  if (!IS_ADMIN) return;
  if (!hasAnyScore(score)) {
    delete state.results[matchId];
    pushSharedState(`/results/${encodeURIComponent(matchId)}`, { method: "DELETE" }, false);
  } else {
    state.results[matchId] = score;
    pushSharedState(`/results/${encodeURIComponent(matchId)}`, {
      method: "PUT",
      body: JSON.stringify(score),
    }, false);
  }
  saveState();
}

function deletePrediction(participantId, matchId) {
  if (participantIsAi(participantId)) return;
  if (state.predictions[participantId]) {
    delete state.predictions[participantId][matchId];
    saveState();
    pushSharedState(`/predictions/${encodeURIComponent(participantId)}/${encodeURIComponent(matchId)}`, { method: "DELETE" }, false);
  }
}

function deleteResult(matchId) {
  if (!IS_ADMIN) return;
  delete state.results[matchId];
  saveState();
  pushSharedState(`/results/${encodeURIComponent(matchId)}`, { method: "DELETE" }, false);
}

function countPredictions(participantId) {
  if (!participantId || !state.predictions[participantId]) return 0;
  return Object.values(state.predictions[participantId]).filter(hasScore).length;
}

function countResults() {
  return Object.values(state.results).filter(hasScore).length;
}

function countGroupPredictions(groupId, participantId) {
  if (!participantId) return 0;
  return matchesForGroup(groupId).filter((match) => hasScore(getPrediction(participantId, match.id))).length;
}

function getLeaderboard() {
  return state.participants
    .map((participant, order) => {
      const summary = MATCHES.reduce(
        (acc, match) => {
          const pick = getPrediction(participant.id, match.id);
          const result = getResult(match.id);
          const score = scorePrediction(pick, result);
          acc.points += score.points;
          acc.exact += score.exact ? 1 : 0;
          acc.outcome += score.outcome ? 1 : 0;
          acc.picked += hasScore(pick) ? 1 : 0;
          acc.scoredMatches += hasScore(pick) && hasScore(result) ? 1 : 0;
          return acc;
        },
        { points: 0, exact: 0, outcome: 0, picked: 0, scoredMatches: 0 },
      );
      return { ...participant, order, ...summary };
    })
    .sort((a, b) => {
      return b.points - a.points || b.exact - a.exact || b.outcome - a.outcome || b.picked - a.picked || a.order - b.order;
    });
}

function scorePrediction(pick, result) {
  if (!hasScore(pick) || !hasScore(result)) {
    return { points: 0, exact: false, outcome: false };
  }
  const exact = pick.home === result.home && pick.away === result.away;
  const outcomeMatch = outcome(pick) === outcome(result);
  if (exact) {
    return { points: 3, exact: true, outcome: true };
  }
  if (outcomeMatch) {
    return { points: 1, exact: false, outcome: true };
  }
  return { points: 0, exact: false, outcome: false };
}

function outcome(score) {
  if (score.home > score.away) return "home";
  if (score.home < score.away) return "away";
  return "draw";
}

function fixtureStatusText(pick, result) {
  const pickText = hasScore(pick) ? `예측 ${pick.home}-${pick.away}` : "예측 전";
  const resultText = hasScore(result) ? `결과 ${result.home}-${result.away}` : "결과 전";
  return `${pickText} · ${resultText}`;
}

function matchPickStatusText(pick, result, score) {
  if (!hasScore(pick)) return "예측 전";
  if (!hasScore(result)) return `예측 ${pick.home}-${pick.away}`;
  if (score.exact) return `정확한 스코어 · ${score.points}점`;
  if (score.outcome) return `승무패 적중 · ${score.points}점`;
  return "0점";
}

function readOnlyScoreBoard(match, score) {
  const hasPick = hasScore(score);
  return h("div", { className: "score-board compact-score-board readonly-score-board" }, [
    predictionTeam(match.home, "home"),
    h("div", { className: "score-entry readonly-score" }, [
      h("strong", { text: hasPick ? score.home : "-" }),
      h("span", { text: ":" }),
      h("strong", { text: hasPick ? score.away : "-" }),
    ]),
    predictionTeam(match.away, "away"),
  ]);
}

function buildAiPredictions() {
  return Object.fromEntries(MATCHES.map((match) => [match.id, aiScoreForMatch(match)]));
}

function aiScoreForMatch(match) {
  const hosts = new Set(["CAN", "MEX", "USA"]);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const homeBoost = hosts.has(match.home) ? 8 : 0;
  const awayBoost = hosts.has(match.away) ? 8 : 0;
  const diff = away.rank - home.rank + homeBoost - awayBoost;
  const pulse = (stableHash(`${match.id}-${match.home}-${match.away}`) % 5) - 2;
  const signal = diff + pulse;

  if (signal >= 42) return { home: 3, away: 0 };
  if (signal >= 24) return { home: 2, away: 0 };
  if (signal >= 9) return { home: 2, away: 1 };
  if (signal > -9) return { home: 1, away: 1 };
  if (signal > -24) return { home: 1, away: 2 };
  if (signal > -42) return { home: 0, away: 2 };
  return { home: 0, away: 3 };
}

function stableHash(value) {
  return [...value].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7);
}

function normaliseScore(home, away) {
  return { home: toScore(home), away: toScore(away) };
}

function toScore(value) {
  if (value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(99, Math.floor(number));
}

function hasScore(score) {
  return Number.isInteger(score?.home) && Number.isInteger(score?.away);
}

function hasAnyScore(score) {
  return Number.isInteger(score?.home) || Number.isInteger(score?.away);
}

function scoreInput(value) {
  const input = h("input", {
    className: "score-input",
    type: "number",
    min: "0",
    max: "99",
    inputmode: "numeric",
    "aria-label": "예상 득점",
  });
  input.value = Number.isInteger(value) ? String(value) : "";
  return input;
}

function teamRow(code, size = "compact") {
  const team = getTeam(code);
  return h("div", { className: `team-row ${size}` }, [
    flagNode(code),
    h("div", { className: "team-copy" }, [
      h("strong", { text: team.ko }),
      h("span", { text: `${team.en} · FIFA ${team.rank}위` }),
    ]),
  ]);
}

function fixtureTeam(code) {
  const team = getTeam(code);
  return h("span", { className: "fixture-team" }, [
    flagNode(code),
    h("span", { text: team.ko }),
  ]);
}

function predictionTeam(code, side) {
  const team = getTeam(code);
  return h("div", { className: `prediction-team ${side}` }, [
    flagNode(code),
    h("strong", { text: team.ko }),
    h("span", { text: `${team.en}` }),
    h("em", { text: `FIFA ${team.rank}위` }),
  ]);
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

function optionNode(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function emptyState(title, body) {
  return h("div", { className: "empty-state" }, [
    h("strong", { text: title }),
    h("p", { text: body }),
  ]);
}

function formatKoreaDate(match) {
  const date = koreaDateFromMatch(match);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function formatKoreaTime(match) {
  return `${new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(koreaDateFromMatch(match))} KST`;
}

function koreaDateFromMatch(match) {
  const [year, month, day] = match.date.split("-").map(Number);
  const parsed = match.time.match(/^(\d{1,2}):(\d{2})\s*([ap])\.m\.\s*UTC([+-]\d+)$/i);
  if (!parsed) return new Date(year, month - 1, day);

  let hour = Number(parsed[1]);
  const minute = Number(parsed[2]);
  const meridiem = parsed[3].toLowerCase();
  const offsetHours = Number(parsed[4]);
  if (meridiem === "p" && hour !== 12) hour += 12;
  if (meridiem === "a" && hour === 12) hour = 0;

  return new Date(Date.UTC(year, month - 1, day, hour - offsetHours, minute));
}

function flashSaved(text) {
  els.saveStatus.textContent = text;
  els.saveStatus.classList.remove("pulse");
  void els.saveStatus.offsetWidth;
  els.saveStatus.classList.add("pulse");
}

function flashResultSaved(text) {
  els.resultSaveStatus.textContent = text;
  els.resultSaveStatus.classList.remove("pulse");
  void els.resultSaveStatus.offsetWidth;
  els.resultSaveStatus.classList.add("pulse");
}

function flashSharedSaveFailure(path) {
  if (path.startsWith("/results")) {
    flashResultSaved("공유 저장 실패");
    return;
  }
  flashSaved("공유 저장 실패");
}

function exportState() {
  const payload = {
    app: "월드컵 승부의신",
    exportedAt: new Date().toISOString(),
    rankingAsOf: RANKING_AS_OF,
    participants: state.participants,
    predictions: state.predictions,
    results: state.results,
    selectedParticipantId: state.selectedParticipantId,
    selectedGroup: state.selectedGroup,
    selectedMatchId: state.selectedMatchId,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `worldcup-god-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importState(file) {
  if (!IS_ADMIN) return;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(String(reader.result));
      mergeImportedState(imported);
      render();
    } catch {
      window.alert("불러올 수 없는 파일입니다.");
    } finally {
      els.importInput.value = "";
    }
  });
  reader.readAsText(file);
}

function mergeImportedState(imported) {
  const idMap = new Map();
  const importedParticipants = Array.isArray(imported.participants) ? imported.participants : [];

  importedParticipants.forEach((participant) => {
    if (!participant?.id || !participant?.name) return;
    let existing = state.participants.find((item) => item.id === participant.id);
    if (!existing) {
      existing = state.participants.find((item) => item.name === participant.name);
    }
    if (!existing) {
      existing = { id: participant.id, name: participant.name };
      state.participants.push(existing);
    }
    idMap.set(participant.id, existing.id);
  });

  if (imported.predictions && typeof imported.predictions === "object") {
    Object.entries(imported.predictions).forEach(([participantId, picks]) => {
      const targetId = idMap.get(participantId) || participantId;
      if (!state.participants.some((participant) => participant.id === targetId) || !picks || typeof picks !== "object") return;
      state.predictions[targetId] = state.predictions[targetId] || {};
      Object.entries(picks).forEach(([matchId, score]) => {
        if (!MATCHES.some((match) => match.id === matchId) || !hasAnyScore(score)) return;
        state.predictions[targetId][matchId] = {
          home: Number.isInteger(score.home) ? score.home : null,
          away: Number.isInteger(score.away) ? score.away : null,
        };
      });
    });
  }

  if (imported.results && typeof imported.results === "object") {
    Object.entries(imported.results).forEach(([matchId, score]) => {
      if (!MATCHES.some((match) => match.id === matchId) || !hasAnyScore(score)) return;
      state.results[matchId] = {
        home: Number.isInteger(score.home) ? score.home : null,
        away: Number.isInteger(score.away) ? score.away : null,
      };
    });
  }

  state.selectedParticipantId = idMap.get(imported.selectedParticipantId) || state.selectedParticipantId;
  if (GROUPS.some((group) => group.id === imported.selectedGroup)) {
    state.selectedGroup = imported.selectedGroup;
  }
  if (MATCHES.some((match) => match.id === imported.selectedMatchId)) {
    state.selectedMatchId = imported.selectedMatchId;
  }
  pushSharedState("/import", {
    method: "POST",
    body: JSON.stringify(sharedState()),
  });
}

function resetState() {
  if (!IS_ADMIN) return;
  const ok = window.confirm("모든 참가자와 예측을 초기화할까요?");
  if (!ok) return;
  state = defaultState();
  render();
  pushSharedState("/reset", { method: "POST" });
}

function h(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === false || value === null || value === undefined) return;
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "style") node.setAttribute("style", value);
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value);
  });
  const childList = Array.isArray(children) ? children : [children];
  childList.forEach((child) => {
    if (child === null || child === undefined) return;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return node;
}

els.participantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addParticipant(els.participantName.value);
  els.participantName.value = "";
  els.participantName.focus();
});

els.participantSelect.addEventListener("change", () => {
  state.selectedParticipantId = els.participantSelect.value;
  render();
});

els.removeParticipantBtn.addEventListener("click", removeCurrentParticipant);
els.exportBtn.addEventListener("click", exportState);
els.importInput.addEventListener("change", (event) => importState(event.target.files[0]));
els.resetBtn.addEventListener("click", resetState);
