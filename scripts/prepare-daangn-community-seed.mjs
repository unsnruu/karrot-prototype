import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const datasetSlug = process.env.COMMUNITY_SEED_SLUG || "daangn-ara";
const seedFileSlug = datasetSlug.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
const assetPath = path.join(projectRoot, "public", "assets", "community", datasetSlug, "posts.json");
const assetCsvPath = path.join(projectRoot, "public", "assets", "community", datasetSlug, "posts.csv");
const seedCsvPath = path.join(projectRoot, "supabase", `community_posts_${seedFileSlug}_seed.csv`);
const replaceSqlPath = path.join(projectRoot, "supabase", `community_posts_${seedFileSlug}_replace.sql`);

const authorNames = [
  "장기동감자",
  "검단생활러",
  "운양산책",
  "아라동이웃",
  "김포소식통",
  "당하동주민",
  "고촌로컬",
  "통진친구",
  "마전커피",
  "구래러너",
  "장기책방",
  "운양달빛",
  "아라물결",
  "감정동메모",
  "풍무정류장",
  "사우동노트",
  "불로소식",
  "마산초록",
  "왕길축구",
  "양촌하늘",
  "대곶바람",
  "김포본동길",
  "원당소금빵",
  "오류왕길러",
  "검단산책",
  "한강메이트",
  "장기장보기",
  "고촌퇴근길",
  "구래호수",
  "아라초보",
  "운양엄지",
  "마전수다",
  "통진마실",
  "당하알림",
  "불로다이소",
  "마산캘리",
  "풍무가방",
  "김포런닝",
  "왕길FC",
  "양촌집앞",
  "대화동주의",
  "사우전기",
  "감정치료",
  "원당친구",
  "오류작업복",
  "장기프리마켓",
  "운양미용",
  "아라성악",
  "구래챔스",
  "검단공원",
];

const authorTowns = [
  "장기본동",
  "마전동",
  "운양동",
  "아라동",
  "구래동",
  "당하동",
  "고촌읍",
  "통진읍",
  "감정동",
  "풍무동",
  "사우동",
  "불로동",
  "마산동",
  "왕길동",
  "양촌읍",
  "대곶면",
  "김포본동",
  "원당동",
  "오류왕길동",
  "검단동",
];

const authors = authorNames.map((name, index) => ({
  id: `00000000-0000-0000-0000-${String(2001 + index).padStart(12, "0")}`,
  name,
  town: authorTowns[index % authorTowns.length],
}));
const fallbackAvatarSrc = "/images/fallback-placeholder.webp";
const seedCommentAuthors = ["동네이웃", "아라주민", "검단러", "지나가다", "동네생활러", "이웃님"];
const seedCommentTimes = ["12분 전", "28분 전", "1시간 전"];
const genericSeedCommentBodies = [
  "저도 궁금했어요. 아시는 분 있으면 같이 참고할게요.",
  "비슷한 상황 겪어본 적 있어서 댓글 남겨요. 조금 더 알아보면 좋을 것 같아요.",
  "동네에 아시는 분 있을 것 같아요. 저도 주변에 한번 물어볼게요.",
  "혹시 해결되면 공유 부탁드려요. 저도 궁금하네요.",
];
const topicSeedCommentBodies = {
  "고민/사연": [
    "너무 조급하게 생각하지 마세요. 조건 맞는 곳 찾는 게 생각보다 오래 걸리더라고요.",
    "저도 비슷한 고민 있었는데 시간대 맞는 일부터 작게 찾아보는 것도 괜찮았어요.",
    "아이 돌보면서 일 찾는 거 쉽지 않죠. 응원합니다.",
  ],
  "동네사건사고": [
    "그 시간대에 지나가신 분들이 보면 좋겠네요. 다친 분은 없었으면 좋겠어요.",
    "혹시 블랙박스 있는 차량이면 도움이 될 수도 있겠어요.",
    "근처 사시는 분들 조심하셔야겠네요.",
  ],
  "분실/실종": [
    "근처 지나가면 한번 살펴볼게요. 꼭 찾으셨으면 좋겠어요.",
    "관리사무소나 기사님 쪽에도 문의해보시면 좋을 것 같아요.",
    "사진이나 특징 있으면 더 찾기 쉬울 것 같아요.",
  ],
  "반려동물": [
    "근처 산책길에서 보면 바로 댓글 남길게요.",
    "사진이 있으면 주변에 공유하기 더 좋을 것 같아요.",
    "빨리 주인분이나 도움 주실 분이 나타나면 좋겠어요.",
  ],
  맛집: [
    "여기 궁금했는데 후기 감사합니다.",
    "혹시 주차나 웨이팅은 어떤지도 궁금해요.",
    "근처 갈 일 있으면 한번 들러봐야겠네요.",
  ],
  "병원/약국": [
    "저도 추천 궁금해서 댓글 보고 갈게요.",
    "진료 시간이나 대기 긴지도 같이 알면 좋겠어요.",
    "근처 다녀보신 분들 의견 있으면 도움 될 것 같아요.",
  ],
};

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function sqlString(value) {
  if (value === null || value === undefined || value === "") {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function buildSeedComments(post) {
  const count = hashString(post.id) % 4;
  const bodies = topicSeedCommentBodies[post.topic] ?? genericSeedCommentBodies;
  const offset = hashString(`${post.id}:${post.title}`) % bodies.length;

  return Array.from({ length: count }, (_, index) => ({
    id: `${post.id}-seed-comment-${index + 1}`,
    authorName: seedCommentAuthors[(offset + index) % seedCommentAuthors.length],
    authorAvatar: fallbackAvatarSrc,
    metaLabel: `${post.neighborhood} · ${seedCommentTimes[index]}`,
    body: bodies[(offset + index) % bodies.length],
  }));
}

function postId(index) {
  return `00000000-0000-0000-0000-${String(3001 + index).padStart(12, "0")}`;
}

function numeric(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildViews(index, comments, likes) {
  return 120 + index * 17 + comments * 19 + likes * 11;
}

function normalizeSummarySource(value) {
  return String(value || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#*_~`()[\]{}<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function compactSummary(value) {
  const normalized = normalizeSummarySource(value);
  if (normalized.length <= 50) {
    return normalized;
  }

  return `${normalized.slice(0, 49).trimEnd()}…`;
}

function applyDaangnWritingStyle(summary) {
  const styled = normalizeSummarySource(summary)
    .replace(/(.+?) 추천을 기다리고 있어요$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+?)(을|를) 찾기 위해 제보를 구하는 글$/, "$1$2 찾고 있어요")
    .replace(/(.+) 목격이나 보관 사실을 알리는 글$/, "$1 목격이나 보관 사실을 알리고 있어요")
    .replace(/(.+) 목격이나 보호 소식을 나누는 글$/, "$1 목격이나 보호 소식을 나누고 있어요")
    .replace(/(.+) 보호 제보를 나누는 글$/, "$1 보호 소식을 나누고 있어요")
    .replace(/(.+?)(을|를) 찾는 글$/, "$1$2 찾고 있어요")
    .replace(/(.+)을 함께할 사람이나 정보를 찾는 글$/, "$1을 함께할 이웃이나 정보를 찾고 있어요")
    .replace(/(.+) 참여자나 운동 정보를 찾는 글$/, "$1 참여자나 운동 정보를 찾고 있어요")
    .replace(/(.+) 동행이나 참석자를 찾는 글$/, "$1 동행이나 참석자를 찾고 있어요")
    .replace(/(.+) 후기나 방문 정보를 나누는 글$/, "$1 후기나 방문 정보를 나누고 있어요")
    .replace(/(.+) 티켓이나 관람 정보를 나누는 글$/, "$1 티켓이나 관람 정보를 나누고 있어요")
    .replace(/(.+) 정보를 묻거나 나누는 글$/, "$1 정보를 묻거나 나누고 있어요")
    .replace(/(.+) 추천과 이용 정보를 묻는 글$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+) 추천과 후기를 묻는 글$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+) 관련 추천이나 정보를 묻는 글$/, "$1 추천이나 정보를 묻고 있어요")
    .replace(/(.+) 관련 도움이나 정보를 구하는 글$/, "$1 도움이나 정보를 찾고 있어요")
    .replace(/(.+) 비용과 업체 정보를 묻는 글$/, "$1 비용과 업체 정보를 묻고 있어요")
    .replace(/(.+) 관련 정보를 묻는 글$/, "$1 정보를 묻고 있어요")
    .replace(/(.+) 구매 방법을 묻는 글$/, "$1 살 방법을 묻고 있어요")
    .replace(/(.+) 추천을 부탁하는 글$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+) 추천받고 싶은 글$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+) 추천받는 글$/, "$1 추천을 기다리고 있어요")
    .replace(/(.+)을 추천받고 싶은 글$/, "$1을 추천받고 있어요")
    .replace(/(.+)를 추천받고 싶은 글$/, "$1를 추천받고 있어요")
    .replace(/(.+) 문의하는 글$/, "$1 궁금해하고 있어요")
    .replace(/(.+)에 대해 조언을 구하는 글$/, "$1에 대해 조언을 구하고 있어요")
    .replace(/(.+) 상황을 공유하고 주의를 당부하는 글$/, "$1 상황을 공유하고 주의를 부탁하고 있어요")
    .replace(/(.+) 관련 주의를 당부하는 글$/, "$1 관련 주의를 부탁하고 있어요")
    .replace(/(.+) 소식이나 참여 정보를 알리는 글$/, "$1 소식이나 참여 정보를 알리고 있어요")
    .replace(/(.+)에 의견을 묻는 글$/, "$1에 의견을 묻고 있어요")
    .replace(/(.+)에 관한 글$/, "$1 이야기를 나누고 있어요")
    .replace(/(.+)을 공유하는 글$/, "$1을 공유하고 있어요")
    .replace(/(.+)를 공유하는 글$/, "$1를 공유하고 있어요")
    .replace(/무료 타로 상담을 해주겠다는 글$/, "동네 이웃에게 무료 타로를 봐주고 있어요")
    .replace(/(.+)을 나눔하거나 가져가라는 글$/, "$1을 나누고 있어요")
    .replace(/(.+)를 나눔하거나 가져가라는 글$/, "$1를 나누고 있어요")
    .replace(/소통하려는 글$/, "이야기하고 싶어해요")
    .replace(/저렴하게 살 방법을 묻는 글/g, "저렴하게 살 방법을 묻고 있어요")
    .replace(/돌봄과 병원 정보를 묻는 글/g, "이야기를 나누고 있어요")
    .replace(/도와줄 사람/g, "도와줄 이웃")
    .replace(/함께 세차할 사람/g, "함께 세차할 이웃")
    .replace(/연락할 사람/g, "연락할 이웃")
    .replace(/추천을 추천을 기다리고 있어요/g, "추천을 기다리고 있어요")
    .replace(/를 추천을 기다리고 있어요/g, "를 추천받고 있어요")
    .replace(/을 추천을 기다리고 있어요/g, "을 추천받고 있어요")
    .replace(/도와줄 사람/g, "도와줄 이웃")
    .replace(/하시는분|하시는 분/g, "쓰는 이웃")
    .replace(/키우시는분|키우시는 분/g, "키우는 이웃")
    .replace(/주실분|주실 분/g, "도와줄 이웃")
    .replace(/계신가요|계실까요|있으실까요/g, "있나요")
    .replace(/드립니다/g, "드려요");

  return compactSummary(styled);
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return normalizeSummarySource(match[1]);
    }
  }

  return "";
}

function objectParticle(value) {
  const normalized = normalizeSummarySource(value);
  if (!normalized) {
    return "을";
  }

  const lastChar = normalized.at(-1);
  const code = lastChar?.charCodeAt(0) ?? 0;
  if (code < 0xac00 || code > 0xd7a3) {
    return "를";
  }

  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}

function cleanSubject(value) {
  return normalizeSummarySource(value)
    .replace(/^[☆★\s]+/g, "")
    .replace(/[?!.~ㅠㅜ^]+$/g, "")
    .replace(/\s*(?:달아주실분|해주실분|하실분|하실 분|가능하신분).*$/g, "")
    .replace(/\s*(?:구합니다|찾습니다|모십니다|찾아요|구해요|하실분|하실 분|가능한가요|있을까요|추천해주세요|추천좀|문의|질문)$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function objectPhrase(value) {
  const subject = cleanSubject(value);
  return `${subject}${objectParticle(subject)}`;
}

function findLostSubject(title, body) {
  const text = `${title} ${body}`;
  if (/에어팟/.test(text)) {
    return /본체/.test(text) ? "에어팟 본체" : "에어팟";
  }
  if (/지갑/.test(text)) {
    return "지갑";
  }
  if (/휴대폰|핸드폰|분실폰/.test(text)) {
    return "휴대폰";
  }
  if (/킥보드/.test(text)) {
    return "킥보드";
  }
  if (/강아지|포메|진도/.test(text)) {
    return "강아지";
  }
  if (/가방|손가방/.test(text)) {
    return "가방";
  }

  const explicit = firstMatch(text, [
    /([가-힣A-Za-z0-9\s]+?(?:에어팟|지갑|휴대폰|핸드폰|폰|키|열쇠|가방|카드|신분증|킥보드|자전거|우산|본체|분실폰|손가방|강아지|고양이))/,
  ]);

  if (explicit) {
    return cleanSubject(explicit);
  }

  return cleanSubject(title.replace(/분실했습니다|분실|잃어버렸습니다|잃어버렸어요|찾습니다|찾아요/g, ""));
}

function findSubject(title, body) {
  const text = `${title} ${body}`;
  const item = firstMatch(text, [
    /([가-힣A-Za-z0-9]+(?:폰|지갑|에어팟|키|열쇠|가방|카드|신분증|킥보드|휴대폰|강아지|고양이|자전거|우산|본체|분실폰|손가방))/,
    /([가-힣A-Za-z0-9]+(?:마트|치킨|카페|식당|병원|치과|미용실|학원|센터|공원|아파트|버스|정류장|골프|순대차))/,
    /([가-힣A-Za-z0-9]+(?:추천|문의|모집|수리|교체|사용|지원금|알바|취업|운동|모임|세차))/,
  ]);

  if (item) {
    return item;
  }

  return cleanSubject(
    normalizeSummarySource(title)
      .replace(/^(혹시|안녕하세요|질문|문의|추천)\s*/g, "")
      .trim(),
  );
}

function summarizeByIntent({ body, category, title }) {
  const normalizedTitle = normalizeSummarySource(title);
  const normalizedBody = normalizeSummarySource(body);
  const text = `${normalizedTitle} ${normalizedBody}`;
  const subject = findSubject(normalizedTitle, normalizedBody);

  if (/커텐|커튼/.test(text) && /달|설치/.test(text)) {
    return "커텐봉 설치를 도와줄 사람을 찾는 글";
  }

  if (/세차/.test(text) && /하실\s*분|하실분|함께|같이/.test(text)) {
    return "함께 세차할 사람을 찾는 글";
  }

  if (/^심심$|심심해|심심/.test(text)) {
    return "심심해서 동네 이웃과 소통하려는 글";
  }

  if (/해리값|금판매|금 판매/.test(text)) {
    return "금 판매 시 해리값을 문의하는 글";
  }

  if (/인셀덤/.test(text)) {
    return "인셀덤을 저렴하게 살 방법을 묻는 글";
  }

  if (/타로/.test(text)) {
    return "무료 타로 상담을 해주겠다는 글";
  }

  if (/롯데.*엔씨|엔씨.*롯데|야구.*경기/.test(text)) {
    return "야구 경기 티켓이나 관람 정보를 나누는 글";
  }

  if (category === "분실/실종") {
    const lostSubject = findLostSubject(normalizedTitle, normalizedBody);
    if (
      /목격|발견|있어요|보호/.test(text) &&
      !/찾으신\s*분|보신\s*분|습득하신\s*분|있으실까요|계실까요/.test(text)
    ) {
      return compactSummary(`${lostSubject || "분실물"} 목격이나 보관 사실을 알리는 글`);
    }
    return compactSummary(`${objectPhrase(lostSubject || "잃어버린 물건")} 찾기 위해 제보를 구하는 글`);
  }

  if (category === "동네친구") {
    return compactSummary(`${subject || "동네에서 함께할 사람"}을 찾는 글`);
  }

  if (category === "맛집") {
    if (/추천|어디|아시는/.test(text)) {
      return compactSummary(`${subject || "동네 맛집"} 추천을 부탁하는 글`);
    }
    return compactSummary(`${subject || "동네 음식점"} 후기나 방문 정보를 나누는 글`);
  }

  if (category === "병원/약국") {
    return compactSummary(`${subject || "병원이나 약국"} 추천과 이용 정보를 묻는 글`);
  }

  if (category === "반려동물") {
    if (/잃|목격|보호|있어요/.test(text)) {
      return compactSummary(`${subject || "반려동물"} 목격이나 보호 제보를 나누는 글`);
    }
    return compactSummary(`${subject || "반려동물"} 돌봄과 병원 정보를 묻는 글`);
  }

  if (category === "미용") {
    if (/저렴|구매|살수|살 수|파는/.test(text)) {
      return compactSummary(`${objectPhrase(subject || "미용 제품")} 구매 방법을 묻는 글`);
    }
    return compactSummary(`${subject || "미용실이나 관리샵"} 추천과 후기를 묻는 글`);
  }

  if (category === "생활/편의") {
    if (/수리|교체|제작|설치|달아|철거/.test(text)) {
      return compactSummary(`${objectPhrase(subject || "생활 수리")} 도와줄 사람이나 업체를 찾는 글`);
    }
    return compactSummary(`${subject || "동네 생활 편의"} 정보를 묻거나 나누는 글`);
  }

  if (category === "고민/사연") {
    return compactSummary(`${subject || "개인적인 고민"}에 대해 조언을 구하는 글`);
  }

  if (category === "동네사건사고") {
    return compactSummary(`${subject || "동네 사건"} 상황을 공유하고 주의를 당부하는 글`);
  }

  if (category === "취미") {
    return compactSummary(`${subject || "취미 활동"}을 함께할 사람이나 정보를 찾는 글`);
  }

  if (category === "운동") {
    return compactSummary(`${subject || "운동 모임"} 참여자나 운동 정보를 찾는 글`);
  }

  if (category === "이사/시공") {
    return compactSummary(`${subject || "이사나 시공"} 비용과 업체 정보를 묻는 글`);
  }

  if (category === "주거/부동산") {
    return compactSummary(`${subject || "주거와 부동산"} 관련 정보를 묻는 글`);
  }

  if (category === "동네풍경") {
    return compactSummary(`${subject || "동네에서 본 풍경"}을 공유하는 글`);
  }

  if (category === "동네행사") {
    return compactSummary(`${subject || "동네 행사"} 소식이나 참여 정보를 알리는 글`);
  }

  if (category === "임신/육아") {
    return compactSummary(`${subject || "육아"} 관련 도움이나 정보를 구하는 글`);
  }

  if (category === "교육") {
    return compactSummary(`${subject || "교육"} 관련 추천이나 정보를 묻는 글`);
  }

  if (category === "투표") {
    return compactSummary(`${subject || "투표형 질문"}에 의견을 묻는 글`);
  }

  if (/추천|아시는|어디|괜찮/.test(text)) {
    return compactSummary(`${objectPhrase(subject || "동네 정보")} 추천받고 싶은 글`);
  }

  if (/문의|궁금|가능|얼마|해리값/.test(text)) {
    return compactSummary(`${objectPhrase(subject || "동네 정보")} 문의하는 글`);
  }

  if (/구합니다|찾습니다|모집|함께|하실분|하실 분/.test(text)) {
    return compactSummary(`${objectPhrase(subject || "도움이나 동행")} 찾는 글`);
  }

  if (/나눔|무료|가져가세요|드립니다/.test(text)) {
    return compactSummary(`${objectPhrase(subject || "물건")} 나눔하거나 가져가라는 글`);
  }

  if (/조심|주의|사기|피해/.test(text)) {
    return compactSummary(`${subject || "동네 생활"} 관련 주의를 당부하는 글`);
  }

  const firstSentence = normalizedBody
    .split(/(?<=[.!?。！？])\s+|(?<=요[.!?]?)\s+|(?<=다[.!?]?)\s+/u)
    .map((part) => part.trim())
    .find((part) => part.length >= 8);

  if (firstSentence) {
    return compactSummary(`${firstSentence}에 관한 글`);
  }

  return compactSummary(`${cleanSubject(normalizedTitle) || "동네 생활"}에 관한 글`);
}

function refineSummary(post, summary) {
  const title = normalizeSummarySource(post.title);
  const body = normalizeSummarySource(post.body);
  const text = `${title} ${body}`;

  if (/커텐|커튼/.test(text) && /달|설치/.test(text)) {
    return "커텐봉 설치를 도와줄 사람을 찾는 글";
  }
  if (/세차/.test(text) && /하실분|하실\s*분|함께|같이|봉사/.test(text)) {
    return "함께 세차할 사람을 찾는 글";
  }
  if (/^심심$|심심해|심심/.test(text)) {
    return "심심해서 동네 이웃과 소통하려는 글";
  }
  if (/해리값|금판매|금 판매/.test(text)) {
    return "금 판매 시 해리값을 문의하는 글";
  }
  if (/인셀덤/.test(text)) {
    return "인셀덤을 저렴하게 살 방법을 묻는 글";
  }
  if (/롯데.*엔씨|엔씨.*롯데|야구.*경기/.test(text)) {
    return "야구 경기 티켓이나 관람 정보를 나누는 글";
  }
  if (/타로/.test(text)) {
    return "무료 타로 상담을 해주겠다는 글";
  }
  if (/강아지\s*찾아가세요|강아지.*혼자|강아지.*있어요/.test(text)) {
    return "혼자 있는 강아지의 주인을 찾는 글";
  }
  if (/노트북.*그램/.test(text)) {
    return "그램 노트북을 써본 이웃의 이야기를 듣고 싶어해요";
  }
  if (/무릎.*인공관절/.test(text)) {
    return "무릎 인공관절을 잘 보는 병원을 찾고 있어요";
  }

  return summary;
}

function randomOffset(index) {
  return (index * 17 + 11) % authors.length;
}

function resolveAuthor(_post, index) {
  if (index < authors.length) {
    return authors[index];
  }

  return authors[randomOffset(index)];
}

const source = JSON.parse(await readFile(assetPath, "utf8"));
const posts = source.posts.map((post, index) => {
  const author = resolveAuthor(post, index);
  const comments = numeric(post.commentCount);
  const likes = numeric(post.likeCount);

  const nextPost = {
    ...post,
    id: post.id ?? postId(index),
    topic: post.category || "일반",
    summary: refineSummary(post, summarizeByIntent(post)),
    author,
    authorId: author.id,
    viewsCount: post.viewsCount ?? buildViews(index, comments, likes),
    likesCount: likes,
    commentsCount: comments,
    sortOrder: index,
    imagePath: post.image || "",
    publishedAt: post.datetime || null,
  };

  return {
    ...nextPost,
    seedComments: post.seedComments ?? buildSeedComments(nextPost),
  };
});

for (const post of posts) {
  const title = normalizeSummarySource(post.title);
  const body = normalizeSummarySource(post.body);
  const text = `${title} ${body}`;

  if (/노트북.*그램/.test(text)) {
    post.summary = "그램 노트북을 써본 이웃의 이야기를 듣고 싶어해요";
  } else if (/강아지\s*찾아가세요|강아지.*혼자|강아지.*있어요/.test(text)) {
    post.summary = "혼자 있는 강아지의 주인을 찾고 있어요";
  } else if (/무릎.*인공관절/.test(text)) {
    post.summary = "무릎 인공관절을 잘 보는 병원을 찾고 있어요";
  } else if (/취미.*피아노|피아노.*배워/.test(text)) {
    post.summary = "직장인 취미 피아노 수업 정보를 묻고 있어요";
  } else if (/영화.*보실분|영화.*같이/.test(text)) {
    post.summary = "함께 영화 볼 이웃을 찾고 있어요";
  } else if (/보드게임|머더미스터리/.test(text)) {
    post.summary = "보드게임 모임에 함께할 이웃을 찾고 있어요";
  } else if (/메가콘서트/.test(text)) {
    post.summary = "메가콘서트 동행이나 참석자를 찾고 있어요";
  } else if (/정수기/.test(text)) {
    post.summary = "자취방 정수기 선택을 고민하고 있어요";
  } else if (/킨텍스|주말에 근처에서 구경/.test(text)) {
    post.summary = "킨텍스 주변 주말 나들이 정보를 묻고 있어요";
  } else if (/고양이.*수혈|수혈.*고양이/.test(text)) {
    post.summary = "고양이 수혈을 도와줄 이웃을 찾고 있어요";
  } else if (/홈페이지.*무료|재능기부.*홈페이지/.test(text)) {
    post.summary = "동네 가게 홈페이지를 무료로 만들어주고 있어요";
  } else if (/구피.*분양|성어.*분양/.test(text)) {
    post.summary = "늘어난 구피를 분양할 방법을 찾고 있어요";
  } else if (/종합소득세/.test(text)) {
    post.summary = "종합소득세 신고를 도와줄 이웃을 찾고 있어요";
  } else if (/토끼인형/.test(text)) {
    post.summary = "잃어버린 토끼 인형을 찾고 있어요";
  } else if (/맥충전기|충전기.*빌려/.test(text)) {
    post.summary = "맥 충전기를 잠시 빌려줄 이웃을 찾고 있어요";
  } else if (/고양이.*수혈|수혈.*고양이/.test(text)) {
    post.summary = "고양이 수혈을 도와줄 이웃을 찾고 있어요";
  } else if (/사주 프로그램/.test(text)) {
    post.summary = "사주 프로그램을 테스트할 이웃을 찾고 있어요";
  } else if (/벽걸이 시공/.test(text)) {
    post.summary = "벽걸이 시공을 도와줄 이웃을 찾고 있어요";
  }

  if (/인셀덤/.test(text)) {
    post.summary = "인셀덤을 저렴하게 살 방법을 묻고 있어요";
  } else if (/동물병원/.test(text)) {
    post.summary = "동네 동물병원 정보를 찾고 있어요";
  } else if (/강아지가 키우고 싶어요/.test(text)) {
    post.summary = "강아지를 키우기 전 조언을 구하고 있어요";
  } else if (/호수공원.*강아지|소양공원.*강아지|포레안.*강아지소리|유기견/.test(text)) {
    post.summary = "동네에서 본 강아지 소식을 나누고 있어요";
  } else if (/강아지 산책/.test(text)) {
    post.summary = "강아지 산책을 함께할 이웃을 찾고 있어요";
  } else if (/고양이 어떻게/.test(text)) {
    post.summary = "고양이 문제를 어떻게 해야 할지 묻고 있어요";
  }

  post.summary = applyDaangnWritingStyle(post.summary);
}

const topics = [...new Set(posts.map((post) => post.topic))].sort((left, right) => left.localeCompare(right, "ko"));

await writeFile(
  assetPath,
  `${JSON.stringify(
    {
      ...source,
      count: posts.length,
      topics,
      authors,
      posts,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const csvHeaders = [
  "id",
  "author_id",
  "topic",
  "title",
  "summary",
  "body",
  "town",
  "image_path",
  "views_count",
  "likes_count",
  "seed_comments",
  "sort_order",
  "published_at",
];
const csvRows = posts.map((post) =>
  [
    post.id,
    post.authorId,
    post.topic,
    post.title,
    post.summary,
    post.body,
    post.neighborhood,
    post.imagePath,
    post.viewsCount,
    post.likesCount,
    JSON.stringify(post.seedComments),
    post.sortOrder,
    post.publishedAt,
  ]
    .map(csvEscape)
    .join(","),
);
await writeFile(seedCsvPath, `${csvHeaders.join(",")}\n${csvRows.join("\n")}\n`, "utf8");
await writeFile(assetCsvPath, `${csvHeaders.join(",")}\n${csvRows.join("\n")}\n`, "utf8");

const topicList = topics.map(sqlString).join(", ");
const authorValues = authors
  .map((author) => `  (${sqlString(author.id)}::uuid, ${sqlString(author.name)}, ${sqlString(author.town)})`)
  .join(",\n");
const postValues = posts
  .map(
    (post) =>
      `  (${sqlString(post.id)}::uuid, ${sqlString(post.authorId)}::uuid, ${sqlString(post.topic)}, ${sqlString(post.title)}, ${sqlString(post.summary)}, ${sqlString(post.body)}, ${sqlString(post.neighborhood)}, ${sqlString(post.imagePath)}, ${post.viewsCount}, ${post.likesCount}, ${sqlJson(post.seedComments)}, ${post.sortOrder}, ${sqlString(post.publishedAt)}::timestamptz)`,
  )
  .join(",\n");

await writeFile(
  replaceSqlPath,
  `begin;

delete from public.community_posts;

alter table public.community_posts
  add column if not exists seed_comments jsonb not null default '[]'::jsonb;

alter table public.community_posts
  drop constraint if exists community_posts_topic_check;

alter table public.community_posts
  add constraint community_posts_topic_check
  check (topic in (${topicList}));

insert into public.users (id, name, town)
values
${authorValues}
on conflict (id) do update
set name = excluded.name,
    town = excluded.town;

insert into public.community_posts (
  id,
  author_id,
  topic,
  title,
  summary,
  body,
  town,
  image_path,
  views_count,
  likes_count,
  seed_comments,
  sort_order,
  published_at
)
values
${postValues};

commit;
`,
  "utf8",
);

console.log(`Prepared ${posts.length} posts across ${topics.length} topics.`);
console.log(`Updated ${path.relative(projectRoot, assetPath)}`);
console.log(`Updated ${path.relative(projectRoot, assetCsvPath)}`);
console.log(`Wrote ${path.relative(projectRoot, seedCsvPath)}`);
console.log(`Wrote ${path.relative(projectRoot, replaceSqlPath)}`);
