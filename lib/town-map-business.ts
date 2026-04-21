export type TownMapBusinessReview = {
  id: string;
  authorName: string;
  authorSummary: string;
  badge?: string;
  rating: number;
  createdAtLabel: string;
  content: string;
};

export type TownMapBusinessMenu = {
  id: string;
  name: string;
  description?: string;
  price: string;
};

export type TownMapBusinessDetail = {
  id: string;
  name: string;
  category: string;
  townLabel: string;
  rating: number;
  reviewCount: number;
  photoCount: number;
  informantName: string;
  imageGallery: string[];
  businessHoursText: string;
  phoneNumber: string;
  websiteLabel?: string | null;
  websiteUrl?: string | null;
  amenities: string[];
  roadAddress: string;
  introText: string[];
  lat: number;
  lng: number;
  mapPreviewImage: string;
  menuItems: TownMapBusinessMenu[];
  reviews: TownMapBusinessReview[];
  updatedAtLabel: string;
};

type FallbackBusinessInput = Omit<TownMapBusinessDetail, "websiteLabel" | "websiteUrl"> & {
  websiteLabel?: string | null;
  websiteUrl?: string | null;
};

const detailAssets = {
  geumhwaFoodA: "https://www.figma.com/api/mcp/asset/2d0526a3-6fa3-4d1d-9125-e0279d40aaf8",
  geumhwaFoodB: "https://www.figma.com/api/mcp/asset/6f05a671-06fa-4d44-acfc-5f02412b3ced",
  geumhwaMap: "https://www.figma.com/api/mcp/asset/2f3ed66a-3a41-405f-bece-ce7aec60b6d7",
  burgerA: "https://www.figma.com/api/mcp/asset/4486c86e-54ea-441b-88b4-3c9c4d241aad",
  burgerB: "https://www.figma.com/api/mcp/asset/83a1bf0a-d757-45a5-b805-b64009ea94d6",
  bagelA: "https://www.figma.com/api/mcp/asset/b53b1b57-b18e-4b1e-b1c1-162d6f09a756",
  bagelB: "https://www.figma.com/api/mcp/asset/0430fdd5-12c3-4618-bb1e-32bc746f617d",
} as const;

function defineFallbackBusiness(detail: FallbackBusinessInput): TownMapBusinessDetail {
  return {
    websiteLabel: null,
    websiteUrl: null,
    ...detail,
  };
}

export const townMapBusinessDetailsFallback: TownMapBusinessDetail[] = [
  defineFallbackBusiness({
    id: "geumhwa-tonkatsu-hapjeong",
    name: "금화왕돈까스 합정점",
    category: "돈까스",
    townLabel: "합정동",
    rating: 4.6,
    reviewCount: 8,
    photoCount: 24,
    informantName: "콩나물마스터",
    imageGallery: [detailAssets.geumhwaFoodA, detailAssets.geumhwaFoodB],
    businessHoursText: "10:00 - 20:00",
    phoneNumber: "02-123-1234",
    websiteLabel: "홈페이지, SNS를 추가해주세요.",
    websiteUrl: null,
    amenities: [
      "배달",
      "포장",
      "예약",
      "단체주문",
      "지역화폐",
      "주차",
      "와이파이",
      "남/녀 화장실 구분",
      "휠체어",
      "베리어프리",
      "어린이 메뉴",
      "유아의자",
      "대관",
      "스마트폰 충전",
      "단체석",
    ],
    roadAddress: "서울특별시 마포구 독막로3길 11",
    introText: [
      "겉은 바삭하고 속은 촉촉한 왕돈까스를 중심으로, 점심부터 저녁까지 든든하게 즐길 수 있는 동네 맛집이에요.",
      "혼밥 손님도 편하게 머물 수 있고, 주말에는 가족 단위 손님이 자주 찾는 편입니다.",
    ],
    lat: 37.54905,
    lng: 126.91310,
    mapPreviewImage: detailAssets.geumhwaMap,
    menuItems: [
      { id: "cheese", name: "치즈폭탄 왕돈까스", description: "모짜렐라 치즈 듬뿍", price: "15,000원" },
      { id: "loin", name: "등심돈까스", description: "가장 많이 찾는 대표 메뉴", price: "11,000원" },
      { id: "udon", name: "냉모밀 세트", description: "돈까스와 함께 곁들이기 좋아요", price: "13,000원" },
    ],
    reviews: [
      {
        id: "review-1",
        authorName: "빙굴뱅굴",
        authorSummary: "후기 37 · 평균 별점 5.0 · 합정동 29회 인증",
        rating: 5,
        createdAtLabel: "2개월 전",
        content:
          "돈까스 진짜 맛있어요! 튀김옷은 바삭하고, 고기는 촉촉해요. 사장님도 친절하시고, 매장 분위기도 좋아서 데이트 장소로도 추천합니다!",
      },
      {
        id: "review-2",
        authorName: "평촌",
        authorSummary: "후기 263 · 평균 별점 4.8 · 중식 후기 16개",
        badge: "Lv.4 합정동 상급탐험가",
        rating: 4,
        createdAtLabel: "3개월 전",
        content:
          "금화왕돈까스 진심 강추예요. 돈까스 퀄리티가 정말 좋고 매장도 깔끔해서 재방문 의사 있어요. 점심시간엔 조금 붐비니 살짝 일찍 가는 걸 추천해요.",
      },
    ],
    updatedAtLabel: "2026년 1월 6일",
  }),
  defineFallbackBusiness({
    id: "mangwon-burger-hapjeong",
    name: "망원수제버거 합정점",
    category: "수제버거",
    townLabel: "합정동",
    rating: 4.8,
    reviewCount: 15,
    photoCount: 18,
    informantName: "버거좋아",
    imageGallery: [detailAssets.burgerA, detailAssets.burgerB],
    businessHoursText: "11:30 - 21:00",
    phoneNumber: "02-555-0412",
    websiteLabel: "@mangwonburger_hj",
    websiteUrl: "https://www.instagram.com/",
    amenities: ["포장", "배달", "단체석", "주차", "와이파이"],
    roadAddress: "서울특별시 마포구 양화로8길 17",
    introText: ["트러플 버거와 더블치즈 버거가 인기인 합정 골목 수제버거집입니다."],
    lat: 37.55116,
    lng: 126.91692,
    mapPreviewImage: detailAssets.burgerA,
    menuItems: [
      { id: "truffle", name: "트러플 버거", price: "13,500원" },
      { id: "double", name: "더블치즈 버거", price: "12,800원" },
    ],
    reviews: [],
    updatedAtLabel: "2026년 1월 2일",
  }),
  defineFallbackBusiness({
    id: "hapjeong-bagel-club",
    name: "합정베이글클럽",
    category: "베이커리",
    townLabel: "합정동",
    rating: 4.7,
    reviewCount: 21,
    photoCount: 33,
    informantName: "베이글러버",
    imageGallery: [detailAssets.bagelA, detailAssets.bagelB],
    businessHoursText: "08:00 - 19:00",
    phoneNumber: "02-444-1123",
    websiteLabel: "www.bagelclub.kr",
    websiteUrl: "https://example.com/",
    amenities: ["포장", "예약", "와이파이", "반려동물 동반"],
    roadAddress: "서울특별시 마포구 양화로6길 12",
    introText: ["아침 일찍부터 갓 구운 베이글과 크림치즈를 즐길 수 있는 베이커리예요."],
    lat: 37.55275,
    lng: 126.91158,
    mapPreviewImage: detailAssets.bagelA,
    menuItems: [
      { id: "olive", name: "올리브 베이글", price: "4,300원" },
      { id: "fig", name: "무화과 크림치즈", price: "3,800원" },
    ],
    reviews: [],
    updatedAtLabel: "2026년 1월 4일",
  }),
];

const fallbackBusinessById = new Map(
  townMapBusinessDetailsFallback.map((business) => [business.id, business]),
);

export function getTownMapBusinessDetailFallback(id: string) {
  return fallbackBusinessById.get(id) ?? null;
}
