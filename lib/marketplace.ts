export type HomeCategory = {
  label: string;
  hasChevron?: boolean;
};

export type SellerProfile = {
  id: string;
  name: string;
  avatar: string;
  town: string;
  responseRate: number;
  mannerScore: number;
  repeatDeals: number;
  badges: string[];
};

export type MarketplaceItem = {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  town: string;
  distance: string;
  postedAt: string;
  priceLabel?: string;
  priceValue?: number;
  chats: number;
  likes: number;
  sellerId: string;
  trustLabel: string;
  trustNote: string;
  sellingPoints: string[];
  condition: string;
  meetupHint: string;
  meetupAddress?: string;
  meetupLat?: number;
  meetupLng?: number;
  promoted?: boolean;
};

export type HomeFeedItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  image: string;
  town: string;
  distance: string;
  postedAt: string;
  priceLabel?: string;
  chats: number;
  likes: number;
  promoted?: boolean;
};

export const itemDetailUnifiedAd: HomeFeedItem = {
  id: "detail-ad-default",
  slug: "detail-ad-default",
  title: "912 룸 앤 패브릭 멀티 스프레이 섬유향수",
  subtitle: "광고",
  image: "/images/figma-migrated/item-detail-ad-912-room-fabric-mist.png",
  town: "온라인",
  distance: "",
  postedAt: "",
  priceLabel: "10,900원",
  chats: 0,
  likes: 0,
  promoted: true,
};

export const HOME_FEED_PAGE_SIZE = 10;

export function formatItemSlug(order: number) {
  return order.toString().padStart(2, "0");
}

export function parseItemSlug(slug: string) {
  if (!/^\d{1,3}$/.test(slug)) {
    return null;
  }

  const order = Number(slug);
  return Number.isInteger(order) && order > 0 && order <= 100 ? order : null;
}

export type ChatPreview = {
  id: string;
  itemId: string;
  buyerName: string;
  lastSeen: string;
  messages: Array<{
    id: string;
    from: "buyer" | "seller";
    text: string;
    time: string;
  }>;
};

export type HomeFabActionIcon =
  | "lesson"
  | "home"
  | "car"
  | "community"
  | "story"
  | "bundle"
  | "sell";

export type HomeFabAction = {
  label: string;
  icon: HomeFabActionIcon;
  color: string;
};

export const homeCategoriesFallback: HomeCategory[] = [
  { label: "전체" },
  { label: "노트북" },
  { label: "향수" },
  { label: "부동산", hasChevron: true },
  { label: "가까운 동네" },
];

export const sellers: SellerProfile[] = [
  {
    id: "seller-1",
    name: "코워킹랩 합정",
    avatar: "/images/figma-migrated/4772163f-171c-4ee6-a1ab-63ed1855d1e5.png",
    town: "합정동",
    responseRate: 97,
    mannerScore: 38.9,
    repeatDeals: 42,
    badges: ["빠른응답", "동네인증", "사업자 인증"],
  },
  {
    id: "seller-2",
    name: "미니멀라이프",
    avatar: "/images/figma-migrated/a56f8fe4-4116-4f18-9310-f37c2d97fbac.png",
    town: "합정동",
    responseRate: 92,
    mannerScore: 39.6,
    repeatDeals: 18,
    badges: ["응답이 빨라요", "재거래 희망"],
  },
  {
    id: "seller-3",
    name: "향수좋아",
    avatar: "/images/figma-migrated/df87f611-f817-4b48-9b0a-4fdade26ba01.png",
    town: "합정동",
    responseRate: 88,
    mannerScore: 37.8,
    repeatDeals: 9,
    badges: ["친절해요", "시간 약속을 잘 지켜요"],
  },
  {
    id: "seller-4",
    name: "브롬톤러버",
    avatar: "/images/figma-migrated/95090c18-19ef-45f5-8848-11bd9938d9c1.png",
    town: "서교동",
    responseRate: 95,
    mannerScore: 40.2,
    repeatDeals: 27,
    badges: ["거래 경험 많음", "상세 설명 좋아요"],
  },
];

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: "office-pass",
    title: "합정 공유오피스 1일 체험권",
    subtitle: "광고 · 합정 코워킹랩",
    description:
      "합정역 도보 3분 거리 공유오피스 체험권입니다. 조용한 좌석, 프리미엄 커피, 회의실 할인 혜택까지 포함되어 있어요.",
    image: "/images/figma-migrated/4772163f-171c-4ee6-a1ab-63ed1855d1e5.png",
    town: "합정동",
    distance: "100m",
    postedAt: "오늘",
    chats: 0,
    likes: 8,
    sellerId: "seller-1",
    trustLabel: "동네 사장님이 직접 운영",
    trustNote: "최근 30일 응답률 97%, 체험권 사용 안내가 명확해요.",
    sellingPoints: ["당일 사용 가능", "와이파이/커피 포함", "합정역 3분"],
    condition: "체험권",
    meetupHint: "현장 방문 후 바로 사용 가능",
    promoted: true,
  },
  {
    id: "macbook-air-m2",
    title: "맥북 프로 M3 512/24",
    description:
      "실사용 8개월 정도이고 외관 아주 깔끔합니다. 배터리 효율 좋고, 충전기와 박스까지 같이 드려요. 합정역 또는 상수역에서 거래 가능합니다.",
    image: "/images/figma-migrated/a56f8fe4-4116-4f18-9310-f37c2d97fbac.png",
    town: "합정동",
    distance: "500m",
    postedAt: "3일 전",
    priceLabel: "180만원",
    priceValue: 1800000,
    chats: 1,
    likes: 24,
    sellerId: "seller-2",
    trustLabel: "최근 거래 후기 12건 모두 긍정적",
    trustNote: "응답이 빠르고, 제품 상태 설명이 실제와 비슷하다는 평가가 많아요.",
    sellingPoints: ["배터리 상태 우수", "풀박스 보관", "생활기스 거의 없음"],
    condition: "A급",
    meetupHint: "합정역 2번 출구 저녁 거래 선호",
  },
  {
    id: "lush-dirty",
    title: "Lush 바디스프레이 '더티'",
    description:
      "3회 미만 사용했고 향이 저랑 안 맞아 판매합니다. 유통기한 넉넉하고 박스는 없어요. 향수 입문하시는 분께 추천해요.",
    image: "/images/figma-migrated/df87f611-f817-4b48-9b0a-4fdade26ba01.png",
    town: "합정동",
    distance: "400m",
    postedAt: "2일 전",
    priceLabel: "35,000원",
    priceValue: 35000,
    chats: 3,
    likes: 10,
    sellerId: "seller-3",
    trustLabel: "설명과 사진 일치율이 높아요",
    trustNote: "향수 카테고리 재거래 희망 비율이 높은 판매자예요.",
    sellingPoints: ["거의 새상품", "향 지속력 좋음", "합정/상수 직거래 가능"],
    condition: "거의 새상품",
    meetupHint: "상수 카페거리에서도 거래 가능",
  },
  {
    id: "bagel-store",
    title: "사랑받는 빵집 Top100 공개\n🏆",
    description:
      "오늘 갓 구운 베이글 라인업 안내입니다. 쪽파 크림치즈, 무화과, 참깨 베이글이 준비되어 있어요.",
    image: "/images/figma-migrated/51ea0095-74aa-44be-b847-3ad1e93d2a26.png",
    town: "합정동",
    distance: "200m",
    postedAt: "오늘",
    chats: 0,
    likes: 17,
    sellerId: "seller-1",
    trustLabel: "근처 단골이 많은 동네가게",
    trustNote: "오픈 시간 문의가 많아 빠른 확인이 필요해요.",
    sellingPoints: ["당일 생산", "픽업 가능", "인기 메뉴 조기 품절"],
    condition: "매장 소식",
    meetupHint: "매장 방문 픽업",
    promoted: true,
  },
  {
    id: "brompton-bike",
    title: "브롬톤 미니벨로 자전거",
    description:
      "실내 보관했고 최근 정비 완료했습니다. 출퇴근용으로 쓰기 좋고, 접이식이라 차량 이동에도 편합니다.",
    image: "/images/figma-migrated/95090c18-19ef-45f5-8848-11bd9938d9c1.png",
    town: "서교동",
    distance: "1km",
    postedAt: "2일 전",
    priceLabel: "160만원",
    priceValue: 1600000,
    chats: 0,
    likes: 9,
    sellerId: "seller-4",
    trustLabel: "고가 거래 경험이 많은 판매자",
    trustNote: "최근 자전거 거래 후기가 많고 설명이 상세하다는 평이 있어요.",
    sellingPoints: ["정비 완료", "실내 보관", "시승 후 거래 가능"],
    condition: "B+",
    meetupHint: "망원한강공원 앞 시승 가능",
  },
  {
    id: "vegan-lip",
    title: "비건 립밤/틴트 일괄 판매",
    description:
      "색상 테스트만 해보고 보관해둔 제품들입니다. 여러 개 같이 드려서 가볍게 써보시기 좋아요.",
    image: "/images/figma-migrated/a28496ca-d52f-4547-b551-b1ebe3460458.png",
    town: "합정동",
    distance: "300m",
    postedAt: "1시간 전",
    priceLabel: "15,000원",
    priceValue: 15000,
    chats: 3,
    likes: 5,
    sellerId: "seller-3",
    trustLabel: "응답 속도가 빨라 실시간 문의에 유리",
    trustNote: "최근 1시간 내 등록 상품이라 빠른 문의 전환 가능성이 높아요.",
    sellingPoints: ["일괄 판매", "미사용급", "쿨톤/웜톤 혼합"],
    condition: "새상품급",
    meetupHint: "합정역 개찰구 직거래 선호",
  },
  {
    id: "niche-perfume",
    title: "니치 향수 소분 판매",
    description:
      "다양한 브랜드 향을 소량으로 체험해보실 수 있게 준비했습니다. 문의 주시면 보유 리스트 보내드릴게요.",
    image: "/images/figma-migrated/50bddbb3-e095-4d27-9e98-33e09871d5d2.png",
    town: "합정동",
    distance: "500m",
    postedAt: "1일 전",
    priceLabel: "8,000원",
    priceValue: 8000,
    chats: 21,
    likes: 5,
    sellerId: "seller-3",
    trustLabel: "문의 전환율이 높은 상품",
    trustNote: "최근 같은 카테고리에서 채팅 전환이 높았던 판매자예요.",
    sellingPoints: ["여러 향 선택 가능", "부담 없는 가격", "문의 시 리스트 전달"],
    condition: "주문 제작",
    meetupHint: "택배/직거래 모두 가능",
  },
  {
    id: "aesop-handwash",
    title: "이솝 핸드워시 새상품",
    description:
      "선물 받았는데 같은 제품이 있어 판매합니다. 미개봉이고 선물 포장 상태 그대로입니다.",
    image: "/images/figma-migrated/8937d748-074e-4574-a051-2dcc1ed0e0f2.png",
    town: "상수동",
    distance: "900m",
    postedAt: "3일 전",
    priceLabel: "19,000원",
    priceValue: 19000,
    chats: 10,
    likes: 14,
    sellerId: "seller-2",
    trustLabel: "관심 대비 채팅 전환이 높은 상품",
    trustNote: "브랜드 선호도가 높아 빠른 문의 가능성이 있는 상품이에요.",
    sellingPoints: ["미개봉", "선물 포장 상태", "정가 대비 합리적"],
    condition: "새상품",
    meetupHint: "상수역 저녁 시간 선호",
  },
  {
    id: "ps5-console",
    title: "플레이스테이션5",
    description:
      "구매 후 사용 빈도가 낮아 판매합니다. 기본 구성품 모두 있고, 컨트롤러 상태도 좋습니다.",
    image: "/images/figma-migrated/71af11dd-3bed-4da8-8f38-129045fe18c9.png",
    town: "망원동",
    distance: "700m",
    postedAt: "5시간 전",
    priceLabel: "480,000원",
    priceValue: 480000,
    chats: 1,
    likes: 1,
    sellerId: "seller-4",
    trustLabel: "최근 등록된 인기 카테고리 상품",
    trustNote: "등록 5시간 내 관심이 쌓이는 중이라 빠른 문의가 중요해요.",
    sellingPoints: ["풀구성", "상태 양호", "당일 거래 가능"],
    condition: "A급",
    meetupHint: "망원역 근처 직거래",
  },
];

export const chatPreviews: ChatPreview[] = [
  {
    id: "chat-macbook",
    itemId: "macbook-air-m2",
    buyerName: "민지님",
    lastSeen: "방금",
    messages: [
      { id: "m1", from: "buyer", text: "안녕하세요! 아직 판매 중이실까요?", time: "오후 2:10" },
      { id: "m2", from: "seller", text: "네, 아직 있어요. 합정역에서 거래 가능해요.", time: "오후 2:12" },
      { id: "m3", from: "buyer", text: "오늘 저녁에 볼 수 있을까요?", time: "오후 2:14" },
    ],
  },
  {
    id: "chat-default",
    itemId: "office-pass",
    buyerName: "새싹님",
    lastSeen: "1분 전",
    messages: [
      { id: "m1", from: "buyer", text: "체험권 당일 사용 가능한가요?", time: "오전 11:04" },
      { id: "m2", from: "seller", text: "네, 방문 시간만 알려주시면 바로 안내드릴게요.", time: "오전 11:06" },
    ],
  },
];

export const homeFabActionGroups: HomeFabAction[][] = [
  [
    { label: "알바/과외/레슨", icon: "lesson", color: "#ff8a3d" },
    { label: "부동산", icon: "home", color: "#ff8a3d" },
    { label: "중고차", icon: "car", color: "#62b2ff" },
    { label: "동네생활", icon: "community", color: "#62b2ff" },
    { label: "스토리", icon: "story", color: "#ff5252" },
  ],
  [
    { label: "여러 물건 팔기", icon: "bundle", color: "#63d471" },
    { label: "내 물건 팔기", icon: "sell", color: "#ff8a3d" },
  ],
];

export const bottomTabs = [
  { label: "홈", icon: "/icons/home.svg", href: "/home" },
  { label: "커뮤니티", icon: "/icons/community.svg", href: "/community" },
  { label: "동네지도", icon: "/icons/town-map.svg", href: "/town-map" },
  { label: "채팅", icon: "/icons/tab-chat.svg", href: "/chat" },
  { label: "나의 당근", icon: "/icons/profile.svg", href: "/my-karrot" },
];

export function getSellerById(id: string) {
  return sellers.find((seller) => seller.id === id);
}

export function getItemById(id: string) {
  const index = marketplaceItems.findIndex((item) => item.id === id);

  if (index < 0) {
    return undefined;
  }

  return {
    ...marketplaceItems[index],
    slug: formatItemSlug(index + 1),
  };
}

export function getChatByItemId(itemId: string) {
  return chatPreviews.find((chat) => chat.itemId === itemId) ?? chatPreviews[1];
}

export function formatPrice(priceLabel?: string) {
  return priceLabel ?? "가격 문의";
}
