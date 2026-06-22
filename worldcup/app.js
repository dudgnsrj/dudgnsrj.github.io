const STORAGE_KEY = "worldcup-god-pickem-v5";
const API_BASE = "/api";
const SYNC_INTERVAL_MS = 5000;
const RANKING_AS_OF = "2026-04-01";
const IS_ADMIN = new URLSearchParams(window.location.search).get("admin") === "1";
const PREDICTIONS_LOCKED = true;
const DEFAULT_VIEW = "leaderboard";
const VIEW_IDS = new Set(["leaderboard", "trend", "special", "personal", "groups", "next"]);
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
const REMOVED_AI_PARTICIPANT_IDS = new Set(["person-ai-favorite-god", "person-ai-underdog-god"]);

const els = {
  viewTabs: document.querySelectorAll(".view-tab"),
  rankingSection: document.querySelector(".ranking-section"),
  workspace: document.querySelector("#workspace"),
  startPanel: document.querySelector("#startPanel"),
  participantReportPage: document.querySelector("#participantReportPage"),
  participantReportTitle: document.querySelector("#participantReportTitle"),
  participantReportSummary: document.querySelector("#participantReportSummary"),
  participantReportList: document.querySelector("#participantReportList"),
  closeReportBtn: document.querySelector("#closeReportBtn"),
  matchReportPage: document.querySelector("#matchReportPage"),
  matchReportEyebrow: document.querySelector("#matchReportEyebrow"),
  matchReportTitle: document.querySelector("#matchReportTitle"),
  matchReportSummary: document.querySelector("#matchReportSummary"),
  matchReportPredictions: document.querySelector("#matchReportPredictions"),
  editMatchPredictionBtn: document.querySelector("#editMatchPredictionBtn"),
  closeMatchReportBtn: document.querySelector("#closeMatchReportBtn"),
  participantStrip: document.querySelector(".participant-strip"),
  groupsPanel: document.querySelector(".groups-panel"),
  detailPanel: document.querySelector(".detail-panel"),
  groupsGrid: document.querySelector("#groupsGrid"),
  selectedGroupEyebrow: document.querySelector("#selectedGroupEyebrow"),
  selectedGroupTitle: document.querySelector("#selectedGroupTitle"),
  selectedTeams: document.querySelector("#selectedTeams"),
  groupProgress: document.querySelector("#groupProgress"),
  backToGroupsBtn: document.querySelector("#backToGroupsBtn"),
  scheduleList: document.querySelector("#scheduleList"),
  predictionPanel: document.querySelector("#predictionPanel"),
  matchPredictionsPanel: document.querySelector("#matchPredictionsPanel"),
  resultPanel: document.querySelector("#resultPanel"),
  predictionCard: document.querySelector(".prediction-card"),
  matchPicksCard: document.querySelector(".match-picks-card"),
  saveStatus: document.querySelector("#saveStatus"),
  resultSaveStatus: document.querySelector("#resultSaveStatus"),
  participantButtons: document.querySelector("#participantButtons"),
  participantForm: document.querySelector("#participantForm"),
  participantName: document.querySelector("#participantName"),
  removeParticipantBtn: document.querySelector("#removeParticipantBtn"),
  adminActions: document.querySelector("#adminActions"),
  resultCard: document.querySelector("#resultCard"),
  rankingList: document.querySelector("#rankingList"),
  rankTrendSection: document.querySelector("#rankTrendSection"),
  rankTrendChart: document.querySelector("#rankTrendChart"),
  rankTrendLegend: document.querySelector("#rankTrendLegend"),
  specialRankingSection: document.querySelector("#specialRankingSection"),
  specialRankings: document.querySelector("#specialRankings"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  resetBtn: document.querySelector("#resetBtn"),
};

let state = loadState();
let serverOnline = false;
let lastSyncAt = null;
let activeView = DEFAULT_VIEW;
let activeReportParticipantId = "";
let activeMatchReportId = "";
let activeGroupPageId = "";
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
      .filter((participant) => participant?.id && participant?.name && !REMOVED_AI_PARTICIPANT_IDS.has(participant.id))
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
  REMOVED_AI_PARTICIPANT_IDS.forEach((participantId) => delete state.predictions[participantId]);
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
    Object.entries(state.predictions || {}).filter(([participantId]) => !participantIsAi(participantId) && !REMOVED_AI_PARTICIPANT_IDS.has(participantId)),
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
  renderLeaderboard();
  renderViewTabs();
  if (activeReportParticipantId && !participantById(activeReportParticipantId)) {
    activeReportParticipantId = "";
  }
  if (activeMatchReportId && !matchById(activeMatchReportId)) {
    activeMatchReportId = "";
  }
  if (activeGroupPageId && !GROUPS.some((group) => group.id === activeGroupPageId)) {
    activeGroupPageId = "";
  }
  hideViewPanels();

  if (activeMatchReportId) {
    els.matchReportPage.hidden = false;
    renderMatchReport(activeMatchReportId);
  } else if (activeView === "leaderboard") {
    els.rankingSection.hidden = false;
  } else if (activeView === "trend") {
    els.rankTrendSection.hidden = false;
    renderRankTrend();
  } else if (activeView === "special") {
    els.specialRankingSection.hidden = false;
    renderSpecialRankings();
  } else if (activeView === "personal") {
    els.participantStrip.hidden = false;
    ensurePersonalReportParticipant();
    els.participantReportPage.hidden = false;
    els.closeReportBtn.hidden = true;
    renderParticipantReport();
  } else if (activeView === "groups") {
    const isGroupPage = Boolean(activeGroupPageId);
    els.workspace.hidden = false;
    els.workspace.classList.toggle("group-overview-mode", !isGroupPage);
    els.workspace.classList.toggle("group-detail-mode", isGroupPage);
    els.groupsPanel.hidden = isGroupPage;
    els.detailPanel.hidden = !isGroupPage;
    els.predictionCard.hidden = true;
    els.matchPicksCard.hidden = true;
    els.resultCard.hidden = true;
    renderGroups();
    if (isGroupPage) {
      state.selectedGroup = activeGroupPageId;
      if (!MATCHES.some((match) => match.id === state.selectedMatchId && match.group === state.selectedGroup)) {
        state.selectedMatchId = matchesForGroup(state.selectedGroup)[0]?.id || MATCHES[0].id;
      }
      renderSelectedGroup();
      renderSchedule();
    }
  } else if (activeView === "next") {
    els.matchReportPage.hidden = false;
    renderNextMatchesPage();
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
  els.participantButtons.replaceChildren();

  if (!state.participants.length) {
    els.participantButtons.append(h("p", { className: "participant-empty", text: "참가자 없음" }));
    els.removeParticipantBtn.disabled = true;
    return;
  }

  const summaries = new Map(getLeaderboard().map((participant) => [participant.id, participant]));
  els.removeParticipantBtn.disabled = !IS_ADMIN || !selected || participantIsAi(selected);
  state.participants.forEach((participant) => {
    const summary = summaries.get(participant.id);
    const isSelected = participant.id === selected;
    const button = h("button", {
      className: `participant-button${isSelected ? " active" : ""}${participantIsAi(participant.id) ? " ai-card" : ""}`,
      type: "button",
      "aria-pressed": String(isSelected),
      title: `${participant.name} 예측 리포트 보기`,
    }, [
      h("strong", { text: participant.name }),
      h("span", { text: `${summary?.points || 0}점` }),
    ]);
    button.addEventListener("click", () => selectParticipant(participant.id));
    els.participantButtons.append(button);
  });
}

function setActiveView(viewId) {
  if (!VIEW_IDS.has(viewId)) return;
  activeView = viewId;
  activeMatchReportId = "";
  activeGroupPageId = "";
  if (viewId !== "personal") activeReportParticipantId = "";
  render();
}

function ensurePersonalReportParticipant() {
  if (activeReportParticipantId && participantById(activeReportParticipantId)) return;
  const selected = currentParticipant();
  const fallback = state.participants.find((participant) => !participantIsAi(participant.id)) || state.participants[0];
  const participant = selected || fallback;
  if (!participant) return;
  activeReportParticipantId = participant.id;
  state.selectedParticipantId = participant.id;
  renderParticipantSelect();
}

function renderViewTabs() {
  els.viewTabs.forEach((tab) => {
    const selected = tab.dataset.view === activeView;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
}

function hideViewPanels() {
  els.rankingSection.hidden = true;
  els.rankTrendSection.hidden = true;
  els.specialRankingSection.hidden = true;
  els.participantStrip.hidden = true;
  els.participantReportPage.hidden = true;
  els.matchReportPage.hidden = true;
  els.startPanel.hidden = true;
  els.workspace.hidden = true;
  els.workspace.classList.remove("group-overview-mode", "group-detail-mode");
  els.groupsPanel.hidden = false;
  els.detailPanel.hidden = false;
  els.closeReportBtn.hidden = false;
  els.predictionCard.hidden = false;
  els.matchPicksCard.hidden = false;
}

function renderGroups() {
  els.groupsGrid.replaceChildren();
  GROUPS.forEach((group) => {
    const isOpen = group.id === activeGroupPageId;
    const card = h("button", {
      className: `group-card${isOpen ? " active" : ""}`,
      type: "button",
      "aria-pressed": String(isOpen),
      "aria-label": `${group.id}조 경기 일정 열기`,
    });
    card.addEventListener("click", () => selectGroup(group.id));

    const header = h("div", { className: "group-card-header" }, [
      h("span", { className: "group-letter", text: group.id }),
      h("span", { className: "group-card-title", text: `${group.id}조` }),
      h("span", { className: "mini-progress", text: `${matchesForGroup(group.id).length}경기` }),
    ]);

    const teamList = h("div", { className: "group-flag-grid" });
    group.teams.forEach((code) => teamList.append(groupFlagChip(code)));
    card.append(header, teamList);
    els.groupsGrid.append(card);
  });
}

function renderSelectedGroup() {
  const group = currentGroup();
  els.selectedGroupEyebrow.textContent = `Group ${group.id}`;
  els.selectedGroupTitle.textContent = `${group.id}조 일정`;
  els.groupProgress.textContent = `${matchesForGroup(group.id).length}경기`;
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
      className: `fixture-row${selected ? " active" : ""}${predictionResultClass(pick, result)}`,
      type: "button",
      "aria-pressed": String(selected),
    });
    row.addEventListener("click", () => openMatchReport(match.id));

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
        h("strong", { text: fixtureScheduleStatus(match, result) }),
      ]),
    );
    els.scheduleList.append(row);
  });
}

function renderPredictionPanel() {
  const participant = currentParticipant();
  const match = currentMatch();
  const pick = getPrediction(participant?.id, match.id);
  const result = getResult(match.id);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const locked = participantIsAi(participant?.id);
  els.predictionPanel.replaceChildren();
  els.saveStatus.textContent = locked ? "AI 예측" : "예측 잠금";

  const panel = h("div", { className: "prediction-inner" });
  const header = h("div", { className: "prediction-match-meta" }, [
    h("span", { text: `Match ${match.no}` }),
    h("span", { text: `${formatKoreaDate(match)} · ${formatKoreaTime(match)}` }),
    h("span", { text: `${match.venue}, ${match.city}` }),
  ]);

  const scoreBoard = readOnlyScoreBoard(match, pick, result);

  const helper = h("p", {
    className: "prediction-helper",
    text: locked
      ? `${participant.name}의 랭킹 기반 자동 예측입니다.`
      : participant
      ? `${participant.name}님의 ${home.ko} vs ${away.ko} 예측은 대회 시작으로 잠겼습니다.`
      : "대회 시작으로 예측 입력이 잠겼습니다.",
  });

  panel.append(header, scoreBoard, helper);
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
    renderSchedule();
    renderMatchPredictionsPanel();
    renderLeaderboard();
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
  els.matchPredictionsPanel.replaceChildren();
  els.matchPredictionsPanel.append(matchPredictionsList(match));
}

function matchPredictionsList(match) {
  const list = h("div", { className: "match-picks-list" });
  state.participants.forEach((participant) => {
    list.append(matchPickCard(match, participant));
  });
  return list;
}

function matchPickCard(match, participant) {
  const result = getResult(match.id);
  const pick = getPrediction(participant.id, match.id);
  const score = scorePrediction(pick, result);
  const isCurrent = participant.id === state.selectedParticipantId;
  const card = h("article", {
    className: `match-pick-card compact-pick-card${isCurrent ? " current" : ""}${participantIsAi(participant.id) ? " ai-card" : ""}${predictionResultClass(pick, result)}`,
  });

  card.append(
    h("div", { className: "compact-pick-main" }, [
      h("strong", { text: participant.name }),
      h("span", { text: matchPickStatusText(pick, result, score) }),
    ]),
    h("div", { className: "compact-pick-score" }, [
      h("span", { text: getTeam(match.home).ko }),
      h("strong", { text: formatScore(pick, "-") }),
      h("span", { text: getTeam(match.away).ko }),
    ]),
  );
  return card;
}

function renderLeaderboard() {
  els.rankingList.replaceChildren();
  const rows = getLeaderboard();
  if (!rows.length) {
    els.rankingList.append(emptyState("참가자가 없습니다.", "참가자를 추가하면 순위표가 표시됩니다."));
    return;
  }

  rows.forEach((row, index) => {
    const rankCard = h("button", {
      className: `rank-card${index === 0 ? " top" : ""}${participantIsAi(row.id) ? " ai-card" : ""}`,
      type: "button",
      title: `${row.name} 예측 리포트 보기`,
    }, [
      h("div", { className: "rank-number", text: index + 1 }),
      h("div", { className: "rank-main" }, [
        h("strong", { text: row.name }),
      ]),
      h("div", { className: "rank-score" }, [
        h("strong", { text: `${row.points}점` }),
        h("span", { text: `스코어 ${formatAccuracy(row.exact, row.scoredMatches)}` }),
        h("span", { text: `승무패 ${formatAccuracy(row.outcome, row.scoredMatches)}` }),
      ]),
    ]);
    rankCard.addEventListener("click", () => openParticipantReport(row.id));
    els.rankingList.append(rankCard);
  });
}

function renderRankTrend() {
  els.rankTrendChart.replaceChildren();
  els.rankTrendLegend.replaceChildren();

  const history = rankHistoryByDate();
  if (!history.length) {
    els.rankTrendChart.append(emptyState("그래프를 만들 결과가 없습니다.", "경기 결과가 입력되면 날짜별 누적 점수가 표시됩니다."));
    return;
  }

  const participants = getLeaderboard();
  const width = 900;
  const height = 330;
  const pad = { top: 28, right: 28, bottom: 48, left: 48 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const maxPoints = Math.max(3, ...history.flatMap((day) => day.rows.map((row) => row.points)));
  const tickStep = Math.max(1, Math.ceil(maxPoints / 5));
  const topScore = Math.ceil(maxPoints / tickStep) * tickStep;
  const xFor = (index) => pad.left + (history.length === 1 ? chartWidth / 2 : (chartWidth * index) / (history.length - 1));
  const yFor = (points) => pad.top + chartHeight - (points / topScore) * chartHeight;
  const colors = ["#126c5a", "#285f9f", "#c33e4b", "#d7a629", "#6b4aa1", "#0f766e", "#9b4d1f", "#334155"];

  const svg = s("svg", {
    class: "rank-trend-svg",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": "날짜별 누적 점수 변화 그래프",
  });

  for (let score = 0; score <= topScore; score += tickStep) {
    const y = yFor(score);
    svg.append(
      s("line", { class: "rank-grid-line", x1: pad.left, y1: y, x2: width - pad.right, y2: y }),
      s("text", { class: "rank-axis-label", x: pad.left - 12, y: y + 4, "text-anchor": "end", text: `${score}점` }),
    );
  }

  history.forEach((day, index) => {
    const x = xFor(index);
    svg.append(
      s("line", { class: "rank-date-line", x1: x, y1: pad.top, x2: x, y2: height - pad.bottom }),
      s("text", { class: "rank-date-label", x, y: height - 17, "text-anchor": "middle", text: formatDateKeyShort(day.dateKey) }),
    );
  });

  participants.forEach((participant, participantIndex) => {
    const color = colors[participantIndex % colors.length];
    const points = history
      .map((day, index) => {
        const row = day.rows.find((entry) => entry.id === participant.id);
        return row ? { x: xFor(index), y: yFor(row.points), rank: row.rank, points: row.points } : null;
      })
      .filter(Boolean);
    if (!points.length) return;

    const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    svg.append(s("path", { class: "rank-line", d: pathData, style: `--line-color: ${color}` }));
    points.forEach((point) => {
      svg.append(
        s("circle", { class: "rank-dot", cx: point.x, cy: point.y, r: 4.2, style: `--line-color: ${color}` }),
        s("title", { text: `${participant.name} · ${point.points}점 · ${point.rank}위` }),
      );
    });
  });

  els.rankTrendChart.append(svg);

  participants.forEach((participant, index) => {
    const color = colors[index % colors.length];
    const latest = history[history.length - 1].rows.find((entry) => entry.id === participant.id);
    els.rankTrendLegend.append(
      h("article", { className: `rank-trend-legend-item${participantIsAi(participant.id) ? " ai-card" : ""}` }, [
        h("span", { className: "legend-swatch", style: `--swatch: ${color}` }),
        h("div", {}, [
          h("strong", { text: participant.name }),
          h("span", { text: latest ? `${latest.points}점 · ${latest.rank}위` : "기록 없음" }),
        ]),
      ]),
    );
  });
}

function renderSpecialRankings() {
  els.specialRankings.replaceChildren();
  const categories = specialRankingCategories();
  if (!categories.length) {
    els.specialRankings.append(emptyState("이색 순위를 만들 참가자가 없습니다.", "일반 참가자 예측과 경기 결과가 쌓이면 이곳에 표시됩니다."));
    return;
  }
  categories.forEach((category) => els.specialRankings.append(specialRankingCard(category)));
}

function specialRankingCard(category) {
  const winners = category.winners;
  const hasWinner = winners.length > 0;
  const title = hasWinner
    ? winners.map((winner) => winner.name).join(" · ")
    : "아직 없음";
  const unit = category.unit || "회";
  const count = hasWinner ? `${winners[0].count}${unit}` : `0${unit}`;
  const card = h("article", { className: `special-card ${category.id}` }, [
    h("div", { className: "special-card-head" }, [
      h("span", { className: "special-badge", text: category.badge }),
      h("div", {}, [
        h("h3", { text: category.title }),
        h("p", { text: category.description }),
      ]),
    ]),
    h("div", { className: "special-winner" }, [
      h("strong", { text: title }),
      h("span", { text: count }),
    ]),
  ]);

  const examples = hasWinner ? [...new Set(winners.flatMap((winner) => winner.examples.slice(-2)))].slice(-3) : [];
  if (examples.length) {
    const list = h("div", { className: "special-examples" }, [
      h("span", { text: category.exampleLabel || "대표 경기" }),
    ]);
    examples.forEach((example) => list.append(h("em", { text: example })));
    card.append(list);
  }

  return card;
}

function renderParticipantReport() {
  const participant = participantById(activeReportParticipantId);
  if (!participant) return;
  const summary = getLeaderboard().find((entry) => entry.id === participant.id);
  els.participantReportTitle.textContent = `${participant.name} 예측 리포트`;
  els.participantReportSummary.replaceChildren(
    reportStat("총점", `${summary?.points || 0}점`),
    reportStat("스코어", formatAccuracy(summary?.exact || 0, summary?.scoredMatches || 0)),
    reportStat("승무패", formatAccuracy(summary?.outcome || 0, summary?.scoredMatches || 0)),
  );

  els.participantReportList.replaceChildren();
  const completedMatches = MATCHES
    .filter((match) => hasScore(getResult(match.id)))
    .sort((a, b) => koreaDateFromMatch(a) - koreaDateFromMatch(b) || a.no - b.no);

  if (!completedMatches.length) {
    els.participantReportList.append(emptyState("완료된 경기가 없습니다.", "실제 결과가 입력되면 이곳에 예측 리포트가 표시됩니다."));
    return;
  }

  const matches = h("div", { className: "compact-prediction-list" });
  completedMatches.forEach((match) => {
    const pick = getPrediction(participant.id, match.id);
    const result = getResult(match.id);
    const scored = scorePrediction(pick, result);
    matches.append(participantReportMatch(match, pick, result, scored));
  });
  els.participantReportList.append(matches);
}

function renderNextMatchesPage() {
  els.matchReportPage.classList.add("next-matches-page");
  const matches = nextDateMatches();
  const firstMatch = matches[0];
  els.matchReportEyebrow.textContent = "Next Matches";
  els.matchReportTitle.textContent = firstMatch ? `${formatKoreaDate(firstMatch)} 경기` : "다음 경기";
  els.closeMatchReportBtn.hidden = true;
  els.editMatchPredictionBtn.hidden = true;

  if (!matches.length) {
    els.matchReportSummary.replaceChildren(emptyState("남은 경기가 없습니다.", "모든 조별예선 결과가 입력되었습니다."));
    els.matchReportPredictions.replaceChildren();
    return;
  }

  const list = h("div", { className: "next-match-list" });
  matches.forEach((match) => list.append(nextMatchCard(match)));

  els.matchReportSummary.replaceChildren(list);
  els.matchReportPredictions.replaceChildren();
}

function nextMatchCard(match) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const pickedCount = state.participants.filter((participant) => hasScore(getPrediction(participant.id, match.id))).length;
  const card = h("button", {
    className: "next-match-card",
    type: "button",
    title: `${home.ko} vs ${away.ko} 경기 예측 현황 보기`,
  }, [
    h("div", { className: "fixture-meta" }, [
      h("span", { text: `${match.group}조 · Match ${match.no}` }),
      h("span", { text: formatKoreaTime(match) }),
    ]),
    h("div", { className: "fixture-teams" }, [
      fixtureTeam(match.home),
      h("span", { className: "versus", text: "vs" }),
      fixtureTeam(match.away),
    ]),
    h("div", { className: "fixture-bottom" }, [
      h("span", { text: `${match.venue}, ${match.city}` }),
      h("strong", { text: `예측 ${pickedCount}/${state.participants.length}` }),
    ]),
  ]);
  card.addEventListener("click", () => openMatchReport(match.id));
  return card;
}

function renderMatchReport(matchId) {
  els.matchReportPage.classList.remove("next-matches-page");
  const match = matchById(matchId) || nextMatchByTime() || MATCHES[0];
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const result = getResult(match.id);
  const pickedCount = state.participants.filter((participant) => hasScore(getPrediction(participant.id, match.id))).length;
  const scored = matchScoreSummary(match);
  const hasSelectedParticipant = Boolean(currentParticipant());

  els.matchReportEyebrow.textContent = `Group ${match.group} · Match ${match.no}`;
  els.matchReportTitle.textContent = `${home.ko} vs ${away.ko}`;
  els.closeMatchReportBtn.hidden = false;
  els.editMatchPredictionBtn.hidden = PREDICTIONS_LOCKED || !hasSelectedParticipant;
  els.editMatchPredictionBtn.disabled = PREDICTIONS_LOCKED || participantIsAi(state.selectedParticipantId);
  els.editMatchPredictionBtn.textContent = PREDICTIONS_LOCKED
    ? "예측 잠금"
    : participantIsAi(state.selectedParticipantId)
    ? "AI 예측은 읽기 전용"
    : "내 예측 입력";

  els.matchReportSummary.replaceChildren(
    compactMatchSummary(match, result, pickedCount, scored),
  );

  els.matchReportPredictions.replaceChildren(
    h("div", { className: "section-heading" }, [
      h("div", {}, [
        h("p", { className: "eyebrow", text: "Picks Board" }),
        h("h2", { text: "예측 현황" }),
      ]),
      h("p", { className: "source-note", text: hasScore(result) ? "채점 완료" : "결과 입력 전" }),
    ]),
    matchPredictionsList(match),
  );
}

function participantReportMatch(match, pick, result, scored) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const scoreText = hasScore(result)
    ? matchPickStatusText(pick, result, scored)
    : "결과 전";

  const card = h("button", {
    className: `compact-report-row${predictionResultClass(pick, result)}`,
    type: "button",
    title: `${home.ko} vs ${away.ko} 경기 예측 현황 보기`,
  }, [
    h("div", { className: "compact-row-main" }, [
      h("span", { className: "compact-muted", text: `${match.group}조 · M${match.no} · ${formatKoreaDate(match)}` }),
      h("strong", { text: `${home.ko} ${formatScore(result, "-")} ${away.ko}` }),
    ]),
    h("div", { className: "compact-row-score" }, [
      h("span", { text: `예측 ${formatScore(pick, "-")}` }),
      h("strong", { text: hasScore(result) && hasScore(pick) ? `${scored.points}점` : "-" }),
      h("em", { text: scoreText }),
    ]),
  ]);
  card.addEventListener("click", () => openMatchReport(match.id));
  return card;
}

function selectGroup(groupId) {
  const firstMatch = matchesForGroup(groupId)[0];
  if (!firstMatch) return;
  activeGroupPageId = groupId;
  state.selectedGroup = groupId;
  state.selectedMatchId = firstMatch.id;
  activeMatchReportId = "";
  render();
  els.workspace.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectMatch(matchId) {
  openMatchReport(matchId);
}

function selectParticipant(participantId) {
  const participant = participantById(participantId);
  if (!participant) return;
  state.selectedParticipantId = participant.id;
  if (activeView === "personal") activeReportParticipantId = participant.id;
  render();
}

function closeGroupPage() {
  activeGroupPageId = "";
  render();
  els.workspace.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addParticipant(name) {
  const cleanName = name.trim();
  if (!cleanName) return;
  const duplicated = state.participants.some((participant) => participant.name.toLowerCase() === cleanName.toLowerCase());
  if (duplicated) return;
  const participant = { id: createId("person"), name: cleanName };
  state.participants.push(participant);
  state.selectedParticipantId = participant.id;
  if (activeView === "personal") activeReportParticipantId = participant.id;
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
  if (activeReportParticipantId === participant.id) activeReportParticipantId = "";
  render();
  pushSharedState(`/participants/${encodeURIComponent(participant.id)}`, { method: "DELETE" });
}

function currentGroup() {
  return GROUPS.find((group) => group.id === state.selectedGroup) || GROUPS[0];
}

function currentMatch() {
  return matchById(state.selectedMatchId) || MATCHES[0];
}

function currentParticipant() {
  return state.participants.find((participant) => participant.id === state.selectedParticipantId) || null;
}

function participantById(participantId) {
  return state.participants.find((participant) => participant.id === participantId) || null;
}

function participantIsAi(participantId) {
  return participantId === AI_PARTICIPANT.id;
}

function matchById(matchId) {
  return MATCHES.find((match) => match.id === matchId) || null;
}

function matchesForGroup(groupId) {
  return MATCHES.filter((match) => match.group === groupId);
}

function nextMatchByTime(now = new Date()) {
  const sorted = [...MATCHES].sort((a, b) => koreaDateFromMatch(a) - koreaDateFromMatch(b) || a.no - b.no);
  return (
    sorted.find((match) => !hasScore(getResult(match.id)) && koreaDateFromMatch(match) >= now)
    || sorted.find((match) => !hasScore(getResult(match.id)))
    || sorted[sorted.length - 1]
    || null
  );
}

function nextDateMatches(now = new Date()) {
  const anchor = nextMatchByTime(now);
  if (!anchor) return [];
  const targetDate = koreaDateKey(anchor);
  return [...MATCHES]
    .filter((match) => !hasScore(getResult(match.id)) && koreaDateKey(match) === targetDate)
    .sort((a, b) => koreaDateFromMatch(a) - koreaDateFromMatch(b) || a.no - b.no);
}

function koreaDateKey(match) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(koreaDateFromMatch(match));
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
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
  if (PREDICTIONS_LOCKED) return;
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
  if (PREDICTIONS_LOCKED) return;
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
  return leaderboardForMatches(MATCHES);
}

function leaderboardForMatches(matches) {
  return state.participants
    .map((participant, order) => {
      const summary = participantSummaryForMatches(participant.id, matches);
      return { ...participant, order, ...summary };
    })
    .sort((a, b) => {
      return b.points - a.points || b.exact - a.exact || b.outcome - a.outcome || b.picked - a.picked || a.order - b.order;
    });
}

function participantSummaryForMatches(participantId, matches) {
  return matches.reduce(
    (acc, match) => {
      const pick = getPrediction(participantId, match.id);
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
}

function completedMatchesSorted() {
  return MATCHES
    .filter((match) => hasScore(getResult(match.id)))
    .sort((a, b) => koreaDateFromMatch(a) - koreaDateFromMatch(b) || a.no - b.no);
}

function rankHistoryByDate() {
  const completed = completedMatchesSorted();
  const byDate = new Map();
  completed.forEach((match) => {
    const dateKey = koreaDateKey(match);
    byDate.set(dateKey, [...(byDate.get(dateKey) || []), match]);
  });

  const cumulative = [];
  return Array.from(byDate.entries()).map(([dateKey, matches]) => {
    cumulative.push(...matches);
    const rows = leaderboardForMatches(cumulative).map((row, index) => ({ ...row, rank: index + 1 }));
    return { dateKey, matchCount: cumulative.length, rows };
  });
}

function specialRankingCategories() {
  const humans = state.participants.filter((participant) => !participantIsAi(participant.id));
  if (!humans.length) return [];

  const antiAi = specialStatMap(humans);
  const solo = specialStatMap(humans);
  const closeMiss = specialStatMap(humans);
  const dailyTop = specialStatMap(humans);
  const drawHunter = specialStatMap(humans);
  const completed = completedMatchesSorted();
  const matchesByDate = new Map();

  completed.forEach((match) => {
    const result = getResult(match.id);
    const resultOutcome = outcome(result);
    const aiPick = getPrediction(AI_PARTICIPANT.id, match.id);
    const aiOutcome = hasScore(aiPick) ? outcome(aiPick) : "";
    const dateKey = koreaDateKey(match);
    matchesByDate.set(dateKey, [...(matchesByDate.get(dateKey) || []), match]);
    const humanPicks = humans
      .map((participant) => ({ participant, pick: getPrediction(participant.id, match.id) }))
      .filter((entry) => hasScore(entry.pick));

    humanPicks.forEach(({ participant, pick }) => {
      const pickOutcome = outcome(pick);
      const scored = scorePrediction(pick, result);
      if (aiOutcome && pickOutcome !== aiOutcome && scored.outcome) {
        addSpecialStat(antiAi, participant.id, specialMatchNote(match, `AI ${outcomeLabel(aiOutcome)} · 본인 ${outcomeLabel(pickOutcome)}`));
      }
      if (resultOutcome === "draw" && pickOutcome === "draw") {
        addSpecialStat(drawHunter, participant.id, specialMatchNote(match, `예측 ${formatScore(pick, "-")}`));
      }
      if (!scored.exact && isOneGoalMiss(pick, result)) {
        addSpecialStat(closeMiss, participant.id, specialMatchNote(match, `예측 ${formatScore(pick, "-")}`));
      }
    });

    if (humans.length >= 3 && humanPicks.length === humans.length) {
      humanPicks.forEach(({ participant, pick }) => {
        const pickOutcome = outcome(pick);
        const otherOutcomes = humanPicks
          .filter((entry) => entry.participant.id !== participant.id)
          .map((entry) => outcome(entry.pick));
        const othersAgree = otherOutcomes.length > 0 && otherOutcomes.every((item) => item === otherOutcomes[0]);
        if (othersAgree && pickOutcome !== otherOutcomes[0] && pickOutcome === resultOutcome) {
          addSpecialStat(solo, participant.id, specialMatchNote(match, `혼자 ${outcomeLabel(pickOutcome)}`));
        }
      });
    }
  });

  matchesByDate.forEach((matches, dateKey) => {
    const rows = humans
      .map((participant, order) => ({
        participant,
        order,
        ...participantSummaryForMatches(participant.id, matches),
      }))
      .sort((a, b) => b.points - a.points || b.exact - a.exact || b.outcome - a.outcome || a.order - b.order);
    rows.forEach((row) => {
      const stat = dailyTop.get(row.participant.id);
      if (!stat || !row.points) return;
      const example = `${formatDateKeyShort(dateKey)} · ${row.points}점`;
      if (row.points > stat.count) {
        stat.count = row.points;
        stat.examples = [example];
      } else if (row.points === stat.count) {
        stat.examples.push(example);
      }
    });
  });

  return [
    {
      id: "anti-ai",
      badge: "1",
      title: "역배의신",
      description: "AI 승부의신과 다른 승무패 선택으로 맞힌 횟수",
      winners: specialWinners(antiAi),
    },
    {
      id: "solo",
      badge: "2",
      title: "홍대의신",
      description: "남들은 같은 선택, 혼자 다른 선택으로 맞힌 횟수",
      winners: specialWinners(solo),
    },
    {
      id: "close-miss",
      badge: "3",
      title: "한끗의신",
      description: "정확한 스코어가 총 1골 차이로 빗나간 횟수",
      winners: specialWinners(closeMiss),
    },
    {
      id: "daily-top",
      badge: "4",
      title: "일일문어",
      description: "하루에 기록한 일일 득점 최고점",
      unit: "점",
      exampleLabel: "대표 날짜",
      winners: specialWinners(dailyTop),
    },
    {
      id: "draw-hunter",
      badge: "5",
      title: "무잡이",
      description: "실제 무승부 경기의 무승부를 맞힌 횟수",
      winners: specialWinners(drawHunter),
    },
  ];
}

function specialStatMap(participants) {
  return new Map(participants.map((participant, order) => [participant.id, {
    id: participant.id,
    name: participant.name,
    order,
    count: 0,
    examples: [],
  }]));
}

function addSpecialStat(stats, participantId, example) {
  const stat = stats.get(participantId);
  if (!stat) return;
  stat.count += 1;
  stat.examples.push(example);
}

function specialWinners(stats) {
  const rows = Array.from(stats.values()).sort((a, b) => b.count - a.count || a.order - b.order);
  const top = rows[0]?.count || 0;
  return top ? rows.filter((row) => row.count === top) : [];
}

function specialMatchNote(match, note) {
  const result = getResult(match.id);
  return `M${match.no} ${getTeam(match.home).ko} ${formatScore(result, "-")} ${getTeam(match.away).ko} · ${note}`;
}

function isOneGoalMiss(pick, result) {
  if (!hasScore(pick) || !hasScore(result)) return false;
  if (pick.home === result.home && pick.away === result.away) return false;
  return Math.abs(pick.home - result.home) + Math.abs(pick.away - result.away) === 1;
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

function outcomeLabel(value) {
  if (value === "home") return "홈승";
  if (value === "away") return "원정승";
  return "무승부";
}

function fixtureStatusText(pick, result) {
  const pickText = hasScore(pick) ? `예측 ${pick.home}-${pick.away}` : "예측 전";
  const resultText = hasScore(result) ? `결과 ${result.home}-${result.away}` : "결과 전";
  return `${pickText} · ${resultText}`;
}

function fixtureScheduleStatus(match, result) {
  const pickedCount = countMatchPredictions(match.id);
  const resultText = hasScore(result) ? `결과 ${result.home}-${result.away}` : "경기 전";
  return `${resultText} · 예측 ${pickedCount}/${state.participants.length}`;
}

function countMatchPredictions(matchId) {
  return state.participants.filter((participant) => hasScore(getPrediction(participant.id, matchId))).length;
}

function predictionResultClass(pick, result) {
  if (!hasScore(result) || !hasScore(pick)) return "";
  const scored = scorePrediction(pick, result);
  if (scored.exact) return " prediction-exact";
  if (scored.outcome) return " prediction-outcome";
  return "";
}

function openMatchReport(matchId) {
  const match = matchById(matchId);
  if (!match) return;
  state.selectedGroup = match.group;
  state.selectedMatchId = match.id;
  activeReportParticipantId = "";
  activeMatchReportId = match.id;
  render();
  els.matchReportPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeMatchReport() {
  activeMatchReportId = "";
  render();
  if (activeView === "groups") {
    els.workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (activeView === "next") {
    els.matchReportPage.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showMatchPredictionEditor() {
  if (PREDICTIONS_LOCKED) return;
  const match = matchById(activeMatchReportId || state.selectedMatchId) || nextMatchByTime() || MATCHES[0];
  if (!match || !currentParticipant() || participantIsAi(state.selectedParticipantId)) return;
  state.selectedGroup = match.group;
  state.selectedMatchId = match.id;
  activeReportParticipantId = "";
  activeMatchReportId = "";
  render();
  els.workspace.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openParticipantReport(participantId) {
  const participant = participantById(participantId);
  if (!participant) return;
  activeView = "personal";
  activeMatchReportId = "";
  activeReportParticipantId = participantId;
  state.selectedParticipantId = participantId;
  render();
  els.participantReportPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeParticipantReport() {
  activeReportParticipantId = "";
  render();
}

function reportStat(label, value) {
  return h("article", { className: "report-stat" }, [
    h("span", { text: label }),
    h("strong", { text: value }),
  ]);
}

function reportScoreBlock(label, value, note = "") {
  const children = [
    h("span", { text: label }),
    h("strong", { text: value }),
  ];
  if (note) children.push(h("em", { text: note }));
  return h("div", { className: "report-score-block" }, children);
}

function formatScore(score, emptyText) {
  return hasScore(score) ? `${score.home}-${score.away}` : emptyText;
}

function matchPickStatusText(pick, result, score) {
  if (!hasScore(pick)) return "예측 전";
  if (!hasScore(result)) return `예측 ${pick.home}-${pick.away}`;
  if (score.exact) return `정확한 스코어 · ${score.points}점`;
  if (score.outcome) return `승무패 적중 · ${score.points}점`;
  return "0점";
}

function readOnlyScoreBoard(match, score, result) {
  const hasPick = hasScore(score);
  return h("div", { className: `score-board compact-score-board readonly-score-board${predictionResultClass(score, result)}` }, [
    predictionTeam(match.home, "home"),
    h("div", { className: "score-entry readonly-score" }, [
      h("strong", { text: hasPick ? score.home : "-" }),
      h("span", { text: ":" }),
      h("strong", { text: hasPick ? score.away : "-" }),
    ]),
    predictionTeam(match.away, "away"),
  ]);
}

function matchTeamsBoard(match, result) {
  const scoreChildren = hasScore(result)
    ? [
      h("strong", { text: result.home }),
      h("span", { text: ":" }),
      h("strong", { text: result.away }),
    ]
    : [h("span", { text: "vs" })];

  return h("div", { className: "score-board match-report-score-board" }, [
    predictionTeam(match.home, "home"),
    h("div", { className: "score-entry readonly-score match-versus-score" }, scoreChildren),
    predictionTeam(match.away, "away"),
  ]);
}

function compactMatchSummary(match, result, pickedCount, scored) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  return h("div", { className: "compact-match-summary" }, [
    h("article", { className: "compact-match-card" }, [
      h("span", { className: "compact-label", text: "경기 정보" }),
      h("div", { className: "compact-matchup" }, [
        compactTeamLabel(match.home),
        h("strong", { text: "vs" }),
        compactTeamLabel(match.away),
      ]),
      h("p", { text: `${match.group}조 · Match ${match.no} · ${formatKoreaDate(match)} ${formatKoreaTime(match)}` }),
      h("p", { text: `${match.venue}, ${match.city}` }),
    ]),
    h("article", { className: "compact-match-card result-summary-card" }, [
      h("span", { className: "compact-label", text: "결과" }),
      h("div", { className: "compact-result-score", text: hasScore(result) ? `${result.home} : ${result.away}` : "경기 전" }),
      h("p", { text: `${home.ko} vs ${away.ko}` }),
      h("p", { text: hasScore(result) ? `예측 ${pickedCount}/${state.participants.length} · 정확 ${scored.exact} · 승무패 ${scored.outcomeOnly}` : `예측 ${pickedCount}/${state.participants.length}` }),
    ]),
  ]);
}

function compactTeamLabel(code) {
  const team = getTeam(code);
  return h("span", { className: "compact-team-label" }, [
    flagNode(code),
    h("span", { text: team.ko }),
  ]);
}

function matchScoreSummary(match) {
  return state.participants.reduce(
    (acc, participant) => {
      const score = scorePrediction(getPrediction(participant.id, match.id), getResult(match.id));
      if (score.exact) acc.exact += 1;
      else if (score.outcome) acc.outcomeOnly += 1;
      return acc;
    },
    { exact: 0, outcomeOnly: 0 },
  );
}

function formatAccuracy(count, total) {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return `${percent}% (${count}/${total})`;
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

function groupFlagChip(code) {
  const team = getTeam(code);
  return h("span", { className: "group-flag-chip", title: `${team.ko} · FIFA ${team.rank}위` }, [
    flagNode(code),
    h("span", { className: "group-flag-copy" }, [
      h("strong", { text: team.ko }),
      h("em", { text: `FIFA ${team.rank}` }),
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

function formatDateKeyShort(dateKey) {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
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

function s(tag, props = {}, children = []) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === false || value === null || value === undefined) return;
    if (key === "text") node.textContent = value;
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

els.viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveView(tab.dataset.view));
});

els.removeParticipantBtn.addEventListener("click", removeCurrentParticipant);
els.closeReportBtn.addEventListener("click", closeParticipantReport);
els.closeMatchReportBtn.addEventListener("click", closeMatchReport);
els.backToGroupsBtn.addEventListener("click", closeGroupPage);
els.editMatchPredictionBtn.addEventListener("click", showMatchPredictionEditor);
els.exportBtn.addEventListener("click", exportState);
els.importInput.addEventListener("change", (event) => importState(event.target.files[0]));
els.resetBtn.addEventListener("click", resetState);
