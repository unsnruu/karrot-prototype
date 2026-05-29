import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(projectRoot, "public/assets/community/daangn-ara/posts.json");
const outputPath = path.join(projectRoot, "public/assets/community/daangn-ara/posts-subtopics.json");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const textOf = (post) =>
  [post.topic, post.category, post.title, post.summary, post.body]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const hasAny = (text, words) => words.some((word) => text.includes(word.toLowerCase()));

function classify(post) {
  const text = textOf(post);
  const topic = post.topic || post.category || "기타";
  const isQuestion = hasAny(text, ["?", "어디", "있나요", "있을까요", "아시는", "추천", "궁금", "문의", "알려", "얼마", "가능", "몇시"]);
  const isHelp = hasAny(text, ["도와", "찾습니다", "구합니다", "구해요", "부탁", "해주실", "가능하신", "도움"]);
  const isMeetup = hasAny(text, ["친구", "모임", "모집", "같이", "함께", "동호회", "오픈채팅", "언어교환", "수다"]);
  const isNotice = hasAny(text, ["오픈", "생겼", "왔어요", "하네요", "합니다", "안내", "소식", "축제", "행사", "장터", "야시장", "프리마켓"]);
  const isComplaint = hasAny(text, ["시끄럽", "쓰레기", "사기", "경찰", "소방", "사고", "불편", "신고", "환불", "민원"]);
  const isLost = hasAny(text, ["분실", "잃어", "주우", "습득", "찾아가세요", "보관", "떨어트", "두고내"]);
  const isReview = hasAny(text, ["맛있", "좋아요", "다녀왔", "후기", "추천드", "친절", "괜찮"]);
  const isRepair = hasAny(text, ["수리", "교체", "시공", "철거", "설치", "청소", "수선", "에어컨", "콘센트", "방충망"]);
  const isTrade = hasAny(text, ["구매", "판매", "대여", "가격", "시세", "중고", "나눔", "무료", "가져가세요"]);
  const isHealth = hasAny(text, ["병원", "약국", "치료", "수술", "도수", "물리치료", "임플란트", "치과", "아픈", "통증"]);
  const isPet = hasAny(text, ["강아지", "고양이", "반려", "동물병원", "수혈", "사료", "목줄", "유기견"]);
  const isHousing = hasAny(text, ["원룸", "투룸", "월세", "보증금", "룸메이트", "자취방", "이사", "입주"]);

  switch (topic) {
    case "일반":
      if (isLost) return "분실/습득";
      if (isComplaint) return "불편/민원";
      if (isHousing) return "주거";
      if (isRepair) return "수리/시공";
      if (isMeetup) return "모임";
      if (isTrade) return "거래/나눔";
      if (isQuestion || isHelp) return "질문/도움";
      if (isNotice) return "소식";
      return "기타";
    case "생활/편의":
      if (hasAny(text, ["지원금", "월세지원", "이음카드", "주민센터", "보건소", "안심콜"])) return "행정";
      if (isRepair) return "수리/업체";
      if (isTrade) return "구매/나눔";
      if (isNotice) return "소식";
      if (isQuestion || isHelp) return "생활질문";
      return "기타";
    case "분실/실종":
      if (isPet) return "동물";
      if (hasAny(text, ["주우", "습득", "발견", "보관", "찾아가세요"])) return "습득";
      return "분실";
    case "동네친구":
      if (isMeetup) return "친구/모임";
      return "기타";
    case "취미":
      if (isMeetup) return "모임";
      if (hasAny(text, ["공연", "티켓", "경기", "롯데", "엔씨", "오케스트라"])) return "관람/공연";
      if (isQuestion || isHelp) return "질문";
      return "취미생활";
    case "운동":
      if (isMeetup || isHelp) return "모임";
      if (isQuestion) return "장소/시설";
      return "운동소식";
    case "반려동물":
      if (isLost || hasAny(text, ["찾아가세요", "주인"])) return "실종/발견";
      if (isHealth) return "건강/병원";
      if (isQuestion || isHelp) return "돌봄/질문";
      return "소식";
    case "맛집":
      if (isQuestion) return "문의";
      if (hasAny(text, ["푸드트럭", "트럭", "야장", "포차"])) return "푸드트럭/포차";
      return isReview ? "후기" : "추천";
    case "고민/사연":
      if (isLost) return "분실";
      if (isHealth) return "건강";
      if (hasAny(text, ["취업", "알바", "직장", "일을"])) return "일/취업";
      if (hasAny(text, ["변호사", "법적", "민사", "폭행"])) return "법률";
      if (isTrade || isQuestion) return "고민";
      return "기타";
    case "동네사건사고":
      if (hasAny(text, ["사고", "경찰", "소방", "불났", "연기"])) return "사고/안전";
      if (isComplaint) return "불편/민원";
      return "기타";
    case "이사/시공":
      if (hasAny(text, ["이사", "원룸", "용달"])) return "이사";
      if (isRepair) return "수리/설치";
      return "업체/비용";
    case "병원/약국":
      if (isQuestion) return "추천/문의";
      return "후기/정보";
    case "미용":
      if (isQuestion) return "추천/문의";
      return "미용정보";
    case "주거/부동산":
      if (hasAny(text, ["룸메이트"])) return "룸메이트";
      if (hasAny(text, ["원룸", "투룸", "월세", "자취방"])) return "방구하기";
      return "기타";
    case "동네풍경":
      return isComplaint ? "불편/민원" : "풍경";
    case "동네행사":
      return "행사";
    case "교육":
      return isQuestion ? "추천/문의" : "강좌";
    case "임신/육아":
      return isMeetup ? "모임" : "육아정보";
    case "투표":
      return "주의/공유";
    default:
      return "기타";
  }
}

const posts = source.posts.map((post) => ({
  ...post,
  subTopic: classify(post),
}));

const countsByTopic = posts.reduce((acc, post) => {
  const topic = post.topic === "일반" ? "일상" : post.topic || post.category || "기타";
  acc[topic] ||= {};
  acc[topic][post.subTopic] = (acc[topic][post.subTopic] || 0) + 1;
  return acc;
}, {});

const sortedCountsByTopic = Object.fromEntries(
  Object.entries(countsByTopic)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([topic, counts]) => [
      topic,
      Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    ]),
);

const result = {
  ...source,
  posts,
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

console.log(`Wrote ${posts.length} posts to ${path.relative(projectRoot, outputPath)}`);
console.log(JSON.stringify(sortedCountsByTopic, null, 2));
