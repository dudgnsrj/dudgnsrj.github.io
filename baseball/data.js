// 어른 사이트(app.js)와 어린이 사이트(kids/kids.js)가 함께 읽는 경기 기록과 순수 계산 함수.
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
    id: '20260823-01', date: '2026-08-23', label: '8월 23일 일요일', no: 'GAME 01', innings: 9, venue: '208동 놀이터',
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
    id: '20260830-02', date: '2026-08-30', label: '8월 30일 일요일', no: 'GAME 02', innings: 9, venue: '208동 놀이터',
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
    id: '20260906-03', date: '2026-09-06', label: '9월 6일 일요일', no: 'GAME 03', innings: 5, venue: 'KIMM',
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
    id: '20260920-04', date: '2026-09-20', label: '9월 20일 일요일', no: 'GAME 04', innings: 5, venue: '서당골근린공원',
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
    id: '20260927-05', date: '2026-09-27', label: '9월 27일 일요일', no: 'GAME 05', innings: 3, venue: '서당골근린공원',
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
    id: '20261001-06', date: '2026-10-01', label: '10월 1일 목요일', no: 'GAME 06', innings: 4, venue: '어린이집 풋살장',
    away: { player: 'younghun', runs: [0,1,0,0], R: 1, H: 6, E: 0, batting: { AB:13,R:1,H:6,'2B':1,HR:0,RBI:1,BB:2,HBP:0,SO:1 }, pitching: { hand:'R',IP:'5.1',H:3,R:1,ER:1,BB:3,SO:11,HR:0 } },
    home: { player: 'yunjae', runs: [0,0,0,1], R: 1, H: 3, E: 0, batting: { AB:19,R:1,H:3,'2B':0,HR:0,RBI:1,BB:3,HBP:1,SO:11 }, pitching: { hand:'R',IP:'2.2',H:6,R:1,ER:1,BB:2,SO:1,HR:0 } },
    note: '4이닝 경기. 영훈이 2회초 적시타로 선취점을 냈고, 윤재가 4회말 적시타로 동점을 만들어 1–1 무승부로 마쳤습니다. 영훈은 우완 16아웃(5.1 IP), 11탈삼진, 1실점·1자책점이며 윤재는 8아웃(2.2 IP), 1실점·1자책점입니다. 4회초 병살은 타석 1개, 아웃 2개로 집계했습니다.',
    plays: [
      ['1회','영훈','삼진 · 2루타 · 뜬공'],['1회','윤재','삼진 · 삼진 · 볼넷 · 삼진 · 땅볼'],
      ['2회','영훈','안타 · 안타 · 땅볼(주자 1·3루) · 안타(영훈 1–0 윤재) · 볼넷 · 뜬공'],['2회','윤재','땅볼 · 번트안타 · 삼진 · 삼진 · 땅볼'],
      ['3회','영훈','뜬공 · 볼넷 · 안타 · 땅볼'],['3회','윤재','볼넷 · 삼진 · 삼진 · 볼넷 · 삼진 · 땅볼'],
      ['4회','영훈','안타 · 병살'],['4회','윤재','삼진 · 안타 · 사구 · 삼진 · 안타(1–1) · 삼진 · 직선타']
    ]
  },
  {
    id: '20261003-07', date: '2026-10-03', label: '10월 3일 토요일', no: 'GAME 07', innings: 9, venue: '208동 놀이터',
    away: { player: 'yunjae', runs: [0,0,2,0,0,0,1,2,0], R: 5, H: 15, E: 0, batting: { AB:53,R:5,H:15,'2B':2,HR:0,RBI:4,BB:2,HBP:2,SO:20 }, pitching: { hand:'R',IP:'6.0',H:10,R:5,ER:5,BB:13,SO:1,HR:0 } },
    home: { player: 'younghun', runs: [0,0,2,0,0,0,0,0,3], R: 5, H: 10, E: 3, batting: { AB:25,R:5,H:10,'2B':0,HR:0,RBI:5,BB:13,HBP:0,SO:1,SF:1 }, pitching: { hand:'R',IP:'12.0',H:15,R:5,ER:2,BB:2,SO:20,HR:0 } },
    note: '9이닝 경기. 윤재가 8회초 5–2로 앞섰지만 영훈이 9회말 3득점해 5–5 무승부로 마쳤습니다. 영훈은 우완 36아웃(12.0 IP), 20탈삼진이며 윤재는 18아웃(6.0 IP)입니다. 8회초 병살 뒤 누락됐던 삼진을 반영했습니다. 3회말 희생플라이는 타수에서 제외하고 출루율 분모에 포함했습니다. 실책은 타자 출루, 병살은 땅볼 병살로 해석해 집계했으며 8회초 병살 득점에는 타점을 부여하지 않았습니다. 자책점은 실책을 아웃으로 복원하는 기존 4아웃 기준과 통상적인 주자 진루를 적용해 영훈 2점(7회 1점·8회 1점), 윤재 5점으로 추정했습니다. 3회초 2득점과 8회초 병살 때 득점은 비자책점으로 처리했으며, 실제 실책·진루 상황에 따라 자책점은 정정될 수 있습니다.',
    plays: [
      ['1회','윤재','사구 · 안타 · 삼진 · 삼진 · 삼진 · 삼진'],['1회','영훈','땅볼 · 볼넷 · 안타 · 뜬공'],
      ['2회','윤재','볼넷 · 삼진 · 안타 · 삼진 · 삼진 · 삼진'],['2회','영훈','땅볼 · 안타 · 안타 · 안타 · 땅볼'],
      ['3회','윤재','삼진 · 삼진 · 실책 출루 · 안타 · 안타 · 볼넷(윤재 1–0 영훈) · 땅볼(윤재 2–0 영훈) · 삼진'],['3회','영훈','안타 · 안타 · 안타 · 볼넷(윤재 2–1 영훈) · 희생플라이(2–2) · 뜬공'],
      ['4회','윤재','삼진 · 직선타 · 안타 · 뜬공 · 안타 · 땅볼'],['4회','영훈','뜬공 · 볼넷 · 뜬공'],
      ['5회','윤재','뜬공 · 땅볼 · 안타 · 직선타 · 2루타 · 땅볼'],['5회','영훈','볼넷 · 병살'],
      ['6회','윤재','삼진 · 삼진 · 땅볼 · 안타 · 2루타 · 삼진'],['6회','영훈','땅볼 · 안타 · 뜬공'],
      ['7회','윤재','땅볼 · 안타 · 실책 출루 · 안타 · 땅볼(윤재 3–2 영훈) · 삼진 · 삼진'],['7회','영훈','볼넷 · 볼넷 · 뜬공 · 볼넷 · 삼진'],
      ['8회','윤재','삼진 · 사구 · 안타 · 실책 출루 · 안타(윤재 4–2 영훈) · 병살(윤재 5–2 영훈) · 삼진'],['8회','영훈','볼넷 · 볼넷 · 병살'],
      ['9회','윤재','땅볼 · 땅볼 · 삼진 · 안타 · 땅볼'],['9회','영훈','볼넷 · 안타 · 볼넷 · 뜬공 · 볼넷(윤재 5–3 영훈) · 안타(윤재 5–4 영훈) · 볼넷(5–5) · 뜬공']
    ]
  },
  {
    id: '20261004-08', date: '2026-10-04', label: '10월 4일 일요일', no: 'GAME 08', innings: 3, venue: '208동 놀이터',
    away: { player: 'yunjae', runs: [0,0,1], R: 1, H: 3, E: 0, batting: { AB:15,R:1,H:3,'2B':0,HR:0,RBI:1,BB:2,HBP:0,SO:7 }, pitching: { hand:'R',IP:'2.0',H:3,R:1,ER:1,BB:3,SO:1,HR:0 } },
    home: { player: 'younghun', runs: [0,1,0], R: 1, H: 3, E: 0, batting: { AB:9,R:1,H:3,'2B':1,HR:0,RBI:1,BB:3,HBP:0,SO:1 }, pitching: { hand:'R',IP:'4.0',H:3,R:1,ER:1,BB:2,SO:7,HR:0 } },
    note: '3이닝 경기. 기존 공격 아웃 규칙에 따라 초 공격은 윤재(4아웃), 말 공격은 영훈(2아웃)으로 집계했습니다. 영훈이 2회말 적시타로 선취점을 냈고 윤재가 3회초 적시타로 동점을 만들어 1–1 무승부로 마쳤습니다. 원문의 2회말 점수 1:0은 영훈의 선취점으로 해석했습니다. 영훈은 12아웃(4.0 IP), 7탈삼진이며 윤재는 6아웃(2.0 IP), 1탈삼진입니다. 실책 기록이 없어 두 선수 모두 1실점·1자책점입니다. 투구 손은 별도 전환 기록이 없어 기존 기본값인 우완으로 잠정 집계했습니다. 경기장은 10월 9일에 208동 놀이터로 확인되어 반영했습니다.',
    plays: [
      ['1회','윤재','삼진 · 삼진 · 삼진 · 삼진'],['1회','영훈','땅볼 · 뜬공'],
      ['2회','윤재','삼진 · 땅볼 · 삼진 · 안타 · 땅볼'],['2회','영훈','뜬공 · 볼넷 · 2루타 · 안타(윤재 0–1 영훈) · 뜬공'],
      ['3회','윤재','내야안타 · 볼넷 · 땅볼 · 안타(1–1) · 땅볼 · 볼넷 · 삼진 · 땅볼'],['3회','영훈','뜬공 · 볼넷 · 안타 · 볼넷 · 삼진']
    ]
  },
  {
    id: '20261009-09', date: '2026-10-09', label: '10월 9일 금요일', no: 'GAME 09', innings: 6, venue: '서당골근린공원',
    away: { player: 'younghun', runs: [0,0,0,0,1,3], R: 4, H: 9, E: 2, batting: { AB:20,R:4,H:9,'2B':5,'3B':1,HR:1,RBI:4,BB:1,HBP:0,SO:2,SF:1 }, pitching: { hand:'R',IP:'6.2',H:9,R:6,ER:5,BB:3,SO:7,HR:1 } },
    home: { player: 'yunjae', runs: [0,0,2,2,2,'X'], R: 6, H: 9, E: 0, batting: { AB:30,R:6,H:9,'2B':3,HR:1,RBI:6,BB:3,HBP:1,SO:7 }, pitching: { hand:'R',IP:'4.0',H:9,R:4,ER:4,BB:1,SO:2,HR:1 } },
    note: '6이닝 경기. 기존 공격 아웃 규칙에 따라 초 공격은 영훈(2아웃), 말 공격은 윤재(4아웃)로 집계했고, 원문 점수(1:0 등)는 윤재:영훈 순서로 해석했습니다. 윤재가 3회말 연속 적시타로 2점, 4회말 2타점 적시타, 5회말 투런 홈런으로 6–1까지 달아났습니다. 영훈이 5회초 적시타와 6회초 투런 홈런·희생플라이로 6–4까지 추격했지만 윤재가 승리했고, 윤재가 앞선 상태라 6회말은 진행하지 않았습니다. 영훈은 20아웃(6.2 IP), 7탈삼진, 6실점이며 윤재는 12아웃(4.0 IP), 2탈삼진, 4실점·4자책점입니다. 4회말 첫 타자의 실책 출루는 타수로 집계했고, 이어진 만루 땅볼에서 득점이 없었으므로 홈 포스아웃으로 해석했습니다. 두 번째 실책은 타자는 아웃되고 주자가 실책으로 진루한 것(2아웃 주자 2·3루)으로 해석했습니다. 자책점은 실책을 아웃으로 복원하고 통상적인 주자 진루를 적용해 4회말 2실점 중 1점만 자책으로 추정했습니다(영훈 6실점·5자책점). 6회초 희생플라이는 타수에서 제외했습니다. 투구 손은 별도 전환 기록이 없어 기존 기본값인 우완으로 잠정 집계했고, 경기 날짜는 기록을 받은 10월 9일로 등록했습니다.',
    plays: [
      ['1회','영훈','삼진 · 2루타 · 포수 파울플라이'],['1회','윤재','삼진 · 뜬공 · 뜬공 · 직선타'],
      ['2회','영훈','뜬공 · 2루타 · 삼진'],['2회','윤재','땅볼 · 2루타 · 삼진 · 내야안타 · 땅볼(주자 1·3루) · 땅볼'],
      ['3회','영훈','2루타 · 내야플라이 · 내야플라이'],['3회','윤재','2루타 · 땅볼 · 내야안타 · 안타(영훈 0–1 윤재) · 안타(0–2) · 삼진 · 사구 · 땅볼 · 땅볼'],
      ['4회','영훈','2루타 · 뜬공 · 뜬공'],['4회','윤재','실책 출루 · 볼넷 · 볼넷 · 땅볼(홈 포스아웃) · 안타(0–4) · 실책(2아웃 주자 2·3루) · 볼넷 · 삼진 · 삼진'],
      ['5회','영훈','내야플라이 · 2루타 · 안타(1–4) · 볼넷 · 뜬공'],['5회','윤재','땅볼 · 땅볼 · 2루타 · 삼진 · 홈런(1–6) · 삼진'],
      ['6회','영훈','안타 · 홈런(3–6) · 3루타 · 희생플라이(4–6) · 뜬공']
    ]
  },
  {
    id: '20261025-10', date: '2026-10-25', label: '10월 25일 일요일', no: 'GAME 10', innings: 3, venue: '208동 놀이터',
    away: { player: 'younghun', runs: [3,0,1], R: 4, H: 5, E: 0, batting: { AB:11,R:4,H:5,'2B':0,HR:0,RBI:4,BB:7,HBP:0,SO:0 }, pitching: { hand:'R',IP:'4.0',H:3,R:3,ER:3,BB:2,SO:8,HR:1 } },
    home: { player: 'yunjae', runs: [3,0,0], R: 3, H: 3, E: 0, batting: { AB:15,R:3,H:3,'2B':0,HR:1,RBI:3,BB:2,HBP:0,SO:8 }, pitching: { hand:'R',IP:'2.0',H:5,R:4,ER:4,BB:7,SO:0,HR:0 } },
    note: '3이닝 경기. 원문에 선수 표시가 없어 기존 공격 아웃 규칙(영훈 2아웃, 윤재 4아웃)으로 판단했습니다. 매 이닝 2아웃으로 끝난 초 공격을 영훈, 4아웃으로 끝난 말 공격을 윤재로 집계했고, 원문 점수(1:0 등)는 초:말 = 영훈:윤재 순서로 해석했습니다. 영훈이 1회초 밀어내기 볼넷 2개와 적시타로 3점을 먼저 냈고, 윤재가 1회말 볼넷 두 개 뒤 3점 홈런으로 3–3 동점을 만들었습니다. 영훈이 3회초 만루에서 밀어내기 볼넷으로 결승점을 냈고, 윤재가 3회말 안타 2개를 쳤지만 득점하지 못해 영훈이 4–3으로 이겼습니다. 영훈은 12아웃(4.0 IP), 8탈삼진, 3실점이며 윤재는 6아웃(2.0 IP), 볼넷 7개, 4실점입니다. 원문의 안타는 모두 단타로, 주자가 있을 때의 땅볼은 병살 없이 아웃 1개로 집계했습니다. 실책 기록이 없어 실점은 모두 자책점입니다. 투구 손은 별도 전환 기록이 없어 기존 기본값인 우완으로 잠정 집계했습니다.',
    plays: [
      ['1회','영훈','안타 · 안타 · 볼넷 · 뜬공 · 볼넷(영훈 1–0 윤재) · 안타(2–0) · 볼넷(3–0) · 땅볼'],['1회','윤재','볼넷 · 볼넷 · 땅볼 · 삼진 · 삼진 · 홈런(3–3) · 삼진'],
      ['2회','영훈','뜬공 · 볼넷 · 볼넷 · 땅볼'],['2회','윤재','땅볼 · 삼진 · 삼진 · 삼진'],
      ['3회','영훈','안타 · 안타 · 볼넷 · 직선타 · 볼넷(4–3) · 뜬공'],['3회','윤재','땅볼 · 삼진 · 안타 · 땅볼 · 안타 · 삼진']
    ]
  }
];

// IP의 소수 부분은 십진수가 아닌 아웃 수(.1 = 1아웃, .2 = 2아웃)다.
function inningsToOuts(ip) {
  const [innings, outs = '0'] = String(ip).split('.');
  return Number(innings) * 3 + Number(outs);
}

// 도전과제는 games에 기록된 타격·투구·이닝별 점수·플레이 기록만으로 계산한다. 수비 기록은 없으므로 수비 배지는 없다.
const badgeCategories = { batting:'타격', pitching:'투구', game:'경기', career:'누적' };
const isHitToken = token => /^(끝내기 )?(내야|번트)?안타$|^[23]루타$|^홈런$/.test(token);
function longestHitChain(c) {
  let best=0;
  for(const tokens of c.plays) {
    let run=0;
    for(const token of tokens) {
      if(/폭투|전환/.test(token)) continue; // 타석이 아닌 진루·투구 손 전환은 연속 기록을 끊지 않는다.
      run=isHitToken(token)?run+1:0;
      best=Math.max(best,run);
    }
  }
  return best;
}
function longestScorelessRun(c) {
  let best=0, run=0;
  for(const r of c.opponent.runs) { run=r===0?run+1:0; best=Math.max(best,run); }
  return best;
}
function trailedDuringGame(c) {
  const g=c.game, mineAway=c.side===g.away;
  let away=0, home=0;
  const behind=()=>mineAway?away<home:home<away;
  for(let i=0;i<g.innings;i++) {
    away+=Number(g.away.runs[i])||0; if(behind()) return true;
    home+=Number(g.home.runs[i])||0; if(behind()) return true;
  }
  return false;
}
const badgeDefs = [
  { id:'first-hit', cat:'batting', mark:'H', title:'첫 안타', desc:'경기에서 처음으로 안타를 쳤어요.', stat:c=>c.bat.H, target:1 },
  { id:'first-double', cat:'batting', mark:'2B', title:'첫 2루타', desc:'멀리 쳐서 2루까지 달렸어요.', stat:c=>c.bat['2B']||0, target:1 },
  { id:'first-triple', cat:'batting', mark:'3B', title:'첫 3루타', desc:'한 번에 3루까지 달리는 큰 타구.', stat:c=>c.bat['3B']||0, target:1 },
  { id:'first-hr', cat:'batting', mark:'HR', title:'첫 홈런', desc:'담장을 넘긴 첫 홈런!', stat:c=>c.bat.HR, target:1 },
  { id:'multi-hit', cat:'batting', mark:'2H', title:'멀티히트', desc:'한 경기에서 안타 2개 이상.', stat:c=>c.bat.H, target:2, repeat:true },
  { id:'three-hit', cat:'batting', mark:'3H', title:'3안타 경기', desc:'한 경기에서 안타 3개 이상.', stat:c=>c.bat.H, target:3, repeat:true },
  { id:'rbi-3', cat:'batting', mark:'RBI', title:'3타점 경기', desc:'한 경기에서 타점 3개 이상.', stat:c=>c.bat.RBI, target:3, repeat:true },
  { id:'hit-chain', cat:'batting', mark:'연타', title:'연속 안타', desc:'같은 이닝에서 안타를 연달아 2개.', stat:longestHitChain, target:2, repeat:true },
  { id:'walk-off', cat:'batting', mark:'끝', title:'끝내기 안타', desc:'내 안타로 경기를 끝냈어요.', game:c=>c.plays.flat().some(t=>t.startsWith('끝내기')&&isHitToken(t)), repeat:true },
  { id:'no-strikeout', cat:'batting', mark:'0K', title:'삼진 없는 경기', desc:'4타석 이상 나와서 삼진 0개.', game:c=>c.PA>=4&&c.bat.SO===0, repeat:true },
  { id:'first-k', cat:'pitching', mark:'K', title:'첫 탈삼진', desc:'타자를 삼진으로 잡았어요.', stat:c=>c.pit.SO, target:1 },
  { id:'k-5', cat:'pitching', mark:'5K', title:'5탈삼진 경기', desc:'한 경기에서 삼진 5개 잡기.', stat:c=>c.pit.SO, target:5, repeat:true },
  { id:'k-10', cat:'pitching', mark:'10K', title:'10탈삼진 경기', desc:'한 경기에서 삼진 10개 잡기.', stat:c=>c.pit.SO, target:10, repeat:true },
  { id:'no-walk', cat:'pitching', mark:'0BB', title:'볼넷 없는 투구', desc:'1이닝 이상 던지며 볼넷 0개.', game:c=>c.outs>=3&&c.pit.BB===0, repeat:true },
  { id:'shutout', cat:'pitching', mark:'0R', title:'무실점 투구', desc:'1이닝 이상 던지며 실점 0.', game:c=>c.outs>=3&&c.pit.R===0, repeat:true },
  { id:'zero-3', cat:'pitching', mark:'3×0', title:'3이닝 연속 무실점', desc:'상대 공격 3이닝을 연달아 0점으로.', stat:longestScorelessRun, target:3, repeat:true },
  { id:'first-win', cat:'game', mark:'W', title:'첫 승리', desc:'경기에서 이겼어요.', game:c=>c.result==='W', repeat:true },
  { id:'unbeaten-3', cat:'game', mark:'3G', title:'3경기 연속 무패', desc:'세 경기 연달아 지지 않기(승·무).', streak:c=>c.result!=='L', target:3 },
  { id:'comeback', cat:'game', mark:'역전', title:'역전승', desc:'지고 있다가 뒤집어서 이겼어요.', game:c=>c.result==='W'&&trailedDuringGame(c), repeat:true },
  { id:'nine-innings', cat:'game', mark:'9', title:'9이닝 완주', desc:'9이닝 경기를 끝까지 뛰었어요.', game:c=>c.game.innings>=9, repeat:true },
  { id:'venues-4', cat:'game', mark:'4곳', title:'경기장 4곳 경험', desc:'서로 다른 경기장 4곳에서 경기하기.', distinct:c=>c.game.venue, target:4 },
  { id:'hits-50', cat:'career', mark:'50H', title:'누적 안타 50', desc:'시즌 안타 50개 모으기.', total:c=>c.bat.H, target:50 },
  { id:'hits-100', cat:'career', mark:'100H', title:'누적 안타 100', desc:'시즌 안타 100개 모으기.', total:c=>c.bat.H, target:100 },
  { id:'hr-3', cat:'career', mark:'3HR', title:'누적 홈런 3', desc:'홈런 3개 모으기.', total:c=>c.bat.HR, target:3 },
  { id:'hr-5', cat:'career', mark:'5HR', title:'누적 홈런 5', desc:'홈런 5개 모으기.', total:c=>c.bat.HR, target:5 },
  { id:'hr-10', cat:'career', mark:'10HR', title:'누적 홈런 10', desc:'홈런 10개 모으기.', total:c=>c.bat.HR, target:10 },
  { id:'games-10', cat:'career', mark:'10G', title:'10경기 출전', desc:'경기 10번 하기.', total:()=>1, target:10 },
  { id:'games-20', cat:'career', mark:'20G', title:'20경기 출전', desc:'경기 20번 하기.', total:()=>1, target:20 }
];
function playerGameContext(playerId, game) {
  const side=game.away.player===playerId?game.away:game.home, opponent=side===game.away?game.home:game.away;
  const bat=side.batting, pit=side.pitching;
  return {
    game, side, opponent, bat, pit, outs:inningsToOuts(pit.IP),
    PA:(bat.AB||0)+(bat.BB||0)+(bat.HBP||0)+(bat.SF||0)+(bat.SH||0),
    plays:game.plays.filter(p=>p[1]===players[playerId].name).map(p=>p[2].split(' · ').map(t=>t.replace(/\(.*?\)/g,'').trim())),
    result:side.R>opponent.R?'W':side.R<opponent.R?'L':'T'
  };
}
function computeAchievements(playerId, gameList) {
  const contexts=gameList.filter(g=>g.away.player===playerId||g.home.player===playerId)
    .sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id)).map(g=>playerGameContext(playerId,g));
  return badgeDefs.map((def,order)=>{
    let best=0, streak=0, count=0, first=null, total=0;
    const seen=new Set();
    for(const c of contexts) {
      let earned;
      if(def.total) { total+=def.total(c); best=total; earned=total>=def.target; }
      else if(def.distinct) { seen.add(def.distinct(c)); best=seen.size; earned=best>=def.target; }
      else if(def.streak) { streak=def.streak(c)?streak+1:0; best=Math.max(best,streak); earned=streak>=def.target; }
      else if(def.stat) { const value=def.stat(c); best=Math.max(best,value); earned=value>=def.target; }
      else earned=def.game(c);
      if(earned&&!first) first=c.game;
      if(earned&&def.repeat) count++;
    }
    return {
      id:def.id, order, category:def.cat, categoryLabel:badgeCategories[def.cat], mark:def.mark, title:def.title, desc:def.desc,
      unlocked:Boolean(first), game:first&&{ id:first.id, no:first.no, date:first.date }, count:def.repeat?count:null,
      progress:def.target>1?{ value:Math.min(best,def.target), target:def.target }:null
    };
  });
}
function sortAchievements(list) {
  const ratio=b=>b.progress?b.progress.value/b.progress.target:0;
  return list.slice().sort((a,b)=>a.unlocked!==b.unlocked?(a.unlocked?-1:1)
    : a.unlocked?(b.game.date.localeCompare(a.game.date)||b.game.id.localeCompare(a.game.id)||a.order-b.order)
    : (ratio(b)-ratio(a)||a.order-b.order));
}
