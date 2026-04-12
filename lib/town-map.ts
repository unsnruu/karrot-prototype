export type TownMapSearchCategory = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
};

export type TownMapQuickAction = {
  id: string;
  label: string;
  image: string;
};

export type TownMapPost = {
  id: string;
  businessName: string;
  category: string;
  postedAt: string;
  distance: string;
  avatar: string;
  title: string;
  excerpt: string;
  images: string[];
};

export type TownMapPin = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  icon: string;
};

export type TownMapCoordinate = {
  lat: number;
  lng: number;
};

const townMapAssets = {
  basemap: "https://www.figma.com/api/mcp/asset/36b46c2f-4828-4b8f-bdca-95e1ceed8832",
  searchIcon: "https://www.figma.com/api/mcp/asset/91dfde88-cc22-4b41-9eba-d99397e33f3f",
  profile: "https://www.figma.com/api/mcp/asset/43a2a0de-2c9c-47b1-aa5f-ccb1da056e09",
  location: "https://www.figma.com/api/mcp/asset/1c5db93e-5e3a-4c6d-a140-27f45ba8b3c7",
  couponIcon: "https://www.figma.com/api/mcp/asset/0d1bbe63-746d-4829-b28d-50bd6ee32ecd",
  percentIcon: "https://www.figma.com/api/mcp/asset/d5974391-c3bc-4bc5-9e72-09dbdfbbddaa",
  fishIcon: "https://www.figma.com/api/mcp/asset/8998b845-1ebc-459d-af54-8efb2c6488d1",
  restaurantIcon: "https://www.figma.com/api/mcp/asset/60fd8b89-3356-4285-99bf-44b89d508636",
  gymIcon: "https://www.figma.com/api/mcp/asset/5594b083-9a36-40aa-826a-1f9da8554b22",
  beautyIcon: "https://www.figma.com/api/mcp/asset/ba05a811-4ace-4680-9a57-596b900293e0",
  menuIcon: "https://www.figma.com/api/mcp/asset/cf22ae05-f355-49ea-9143-00af5041f046",
  actionBenefits: "https://www.figma.com/api/mcp/asset/4bc51cdd-0f8c-47ea-89b2-162950024f28",
  actionMission: "https://www.figma.com/api/mcp/asset/a7a8a019-68db-402e-be3d-8cbb721c4e94",
  actionLaundry: "https://www.figma.com/api/mcp/asset/7256dcb5-8cf2-4fc5-a262-91732b8171a9",
  actionEstimate: "https://www.figma.com/api/mcp/asset/114d7a08-fbed-4dc3-a40c-37434840f1e1",
  adThumb: "https://www.figma.com/api/mcp/asset/9044bf5c-3fda-4b55-876c-1f41e898aade",
  adArrow: "https://www.figma.com/api/mcp/asset/442687ca-4f26-47af-a2d2-3333d32da2b0",
  pinBurger: "https://www.figma.com/api/mcp/asset/53a58efe-999c-4cab-a21b-3575a11d089a",
  pinDiscount: "https://www.figma.com/api/mcp/asset/7256dcb5-8cf2-4fc5-a262-91732b8171a9",
  pinDeal: "https://www.figma.com/api/mcp/asset/a7a8a019-68db-402e-be3d-8cbb721c4e94",
  tonkatsuAvatar: "https://www.figma.com/api/mcp/asset/a02e45e8-5d10-47bc-a249-7642ecf2d523",
  tonkatsuImageA: "https://www.figma.com/api/mcp/asset/116955e6-6dca-4f3d-80c9-f995cf6dfc7b",
  tonkatsuImageB: "https://www.figma.com/api/mcp/asset/b21ac0e9-ae35-44a4-af3d-09d43f46868a",
  bagelAvatar: "https://www.figma.com/api/mcp/asset/53a58efe-999c-4cab-a21b-3575a11d089a",
  bagelImageA: "https://www.figma.com/api/mcp/asset/b53b1b57-b18e-4b1e-b1c1-162d6f09a756",
  bagelImageB: "https://www.figma.com/api/mcp/asset/0430fdd5-12c3-4618-bb1e-32bc746f617d",
  burgerAvatar: "https://www.figma.com/api/mcp/asset/bcf8834a-7a1f-4362-a239-2e9d641e1a0c",
  burgerImageA: "https://www.figma.com/api/mcp/asset/4486c86e-54ea-441b-88b4-3c9c4d241aad",
  burgerImageB: "https://www.figma.com/api/mcp/asset/83a1bf0a-d757-45a5-b805-b64009ea94d6",
} as const;

export const townMapCenter: TownMapCoordinate = {
  lat: 37.54991,
  lng: 126.91440,
};

export const townMapScreenData = {
  townLabel: "마포구 공덕동",
  searchPlaceholder: "여기서 업체 검색",
  profileImage: townMapAssets.profile,
  locationIcon: townMapAssets.location,
  ad: {
    title: "1/5(월)~1/8(목), 오직 당근에서만",
    description: "착한치킨 6,000원 방문 포장",
    image: townMapAssets.adThumb,
    arrowIcon: townMapAssets.adArrow,
  },
};

export const townMapSearchCategories: TownMapSearchCategory[] = [
  { id: "takeout", label: "포장주문", icon: townMapAssets.couponIcon, active: true },
  { id: "discount", label: "포장주문", icon: townMapAssets.percentIcon },
  { id: "fish-bread", label: "붕어빵", icon: townMapAssets.fishIcon },
  { id: "restaurant", label: "음식점", icon: townMapAssets.restaurantIcon },
  { id: "exercise", label: "운동", icon: townMapAssets.gymIcon },
  { id: "beauty", label: "뷰티", icon: townMapAssets.beautyIcon },
  { id: "more", label: "더보기", icon: townMapAssets.menuIcon },
];

export const townMapQuickActions: TownMapQuickAction[] = [
  { id: "benefits", label: "혜택 모아보기", image: townMapAssets.actionBenefits },
  { id: "mission", label: "현장 미션", image: townMapAssets.actionMission },
  { id: "laundry", label: "세탁 수거", image: townMapAssets.actionLaundry },
  { id: "estimate", label: "전문가 견적", image: townMapAssets.actionEstimate },
];

export const townMapPins: TownMapPin[] = [
  { id: "burger", label: "망원수제버거\n합정점", lat: 37.55116, lng: 126.91692, icon: townMapAssets.pinBurger },
  { id: "discount", label: "멋주미라탕", lat: 37.54905, lng: 126.91310, icon: townMapAssets.pinDiscount },
  { id: "deal", label: "본점", lat: 37.55275, lng: 126.91158, icon: townMapAssets.pinDeal },
];

export const townMapPosts: TownMapPost[] = [
  {
    id: "tonkatsu",
    businessName: "금화왕돈까까스 합정점",
    category: "돈가스전문점",
    postedAt: "4일 전",
    distance: "2.5km",
    avatar: townMapAssets.tonkatsuAvatar,
    title: "치즈폭탄 왕돈까스 출시했습니다 🧀",
    excerpt:
      "안녕하세요 금화왕돈까스 합정점입니다 😊\n바삭한 튀김옷에 쭉 늘어나는 모짜렐라 듬뿍!\n신메뉴 치즈폭탄 왕돈까스 오늘부터 판매합니다",
    images: [townMapAssets.tonkatsuImageA, townMapAssets.tonkatsuImageB],
  },
  {
    id: "bagel-club",
    businessName: "합정베이글클럽 합정점",
    category: "베이커리",
    postedAt: "3일전",
    distance: "420m",
    avatar: townMapAssets.bagelAvatar,
    title: "오늘 갓구운 올리브베이글 나왔어요 🥯",
    excerpt: "안녕하세요 합정베이글클럽입니다",
    images: [townMapAssets.bagelImageA, townMapAssets.bagelImageB],
  },
  {
    id: "burger-launch",
    businessName: "망원수제버거 합정점",
    category: "햄버거",
    postedAt: "4일 전",
    distance: "2.5km",
    avatar: townMapAssets.burgerAvatar,
    title: "트러플 버거 신메뉴 출시 🍔",
    excerpt: "고소한 트러플 향 가득한 한정 메뉴입니다\n오늘부터 판매 시작!",
    images: [townMapAssets.burgerImageA, townMapAssets.burgerImageB],
  },
];

export const townMapSearchIcon = townMapAssets.searchIcon;
