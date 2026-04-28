import { appendTabQuery, isSafeLocalHref } from "@/lib/tab-navigation";

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
  href?: string;
};

export type TownMapCoordinate = {
  lat: number;
  lng: number;
};

export type TownMapKeyboardKey = {
  id: string;
  label: string;
  action?: "char" | "shift" | "delete" | "numbers" | "emoji" | "space" | "search" | "globe" | "mic";
  tone?: "default" | "muted" | "primary";
  width?: "default" | "wide" | "search";
};

export type TownMapSearchEntrySource = "item_detail" | "town_map_search" | "chat_appointment";

const TOWN_MAP_STORAGE_BASE =
  "https://udazzhluazlmcsbdbhzo.supabase.co/storage/v1/object/public/town-map";

const townMapAssets = {
  basemap: "https://www.figma.com/api/mcp/asset/36b46c2f-4828-4b8f-bdca-95e1ceed8832",
  searchIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-search.svg`,
  profile: `${TOWN_MAP_STORAGE_BASE}/tm-ui-profile.webp`,
  location: `${TOWN_MAP_STORAGE_BASE}/tm-ic-location.svg`,
  couponIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-coupon.svg`,
  percentIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-percent.svg`,
  fishIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-fish.svg`,
  restaurantIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-restaurant.svg`,
  gymIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-gym.svg`,
  beautyIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-beauty.svg`,
  menuIcon: `${TOWN_MAP_STORAGE_BASE}/tm-ic-menu.svg`,
  actionBenefits: `${TOWN_MAP_STORAGE_BASE}/tm-act-benefits.webp`,
  actionMission: `${TOWN_MAP_STORAGE_BASE}/tm-act-mission.webp`,
  actionLaundry: `${TOWN_MAP_STORAGE_BASE}/tm-act-laundry.webp`,
  actionEstimate: `${TOWN_MAP_STORAGE_BASE}/tm-act-estimate.webp`,
  adThumb: `${TOWN_MAP_STORAGE_BASE}/tm-ui-ad.webp`,
  adArrow: `${TOWN_MAP_STORAGE_BASE}/tm-ic-ad-arrow.svg`,
  tonkatsuAvatar: `${TOWN_MAP_STORAGE_BASE}/tm-post-tonkatsu-av.webp`,
  tonkatsuImageA: `${TOWN_MAP_STORAGE_BASE}/tm-post-tonkatsu-a.webp`,
  tonkatsuImageB: `${TOWN_MAP_STORAGE_BASE}/tm-post-tonkatsu-b.webp`,
  bagelAvatar: `${TOWN_MAP_STORAGE_BASE}/tm-post-bagel-av.webp`,
  bagelImageA: `${TOWN_MAP_STORAGE_BASE}/tm-post-bagel-a.webp`,
  bagelImageB: `${TOWN_MAP_STORAGE_BASE}/tm-post-bagel-b.webp`,
  burgerAvatar: `${TOWN_MAP_STORAGE_BASE}/tm-post-burger-av.webp`,
  burgerImageA: `${TOWN_MAP_STORAGE_BASE}/tm-post-burger-a.webp`,
  burgerImageB: `${TOWN_MAP_STORAGE_BASE}/tm-post-burger-b.webp`,
} as const;

export const townMapCenter: TownMapCoordinate = {
  lat: 37.54991,
  lng: 126.91440,
};

export function buildTownMapSearchResultsHref({
  query,
  returnTo,
  entrySource,
}: {
  query: string;
  returnTo?: string;
  entrySource?: TownMapSearchEntrySource;
}) {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("query", trimmedQuery);
  }

  if (isSafeLocalHref(returnTo)) {
    params.set("returnTo", returnTo);
  }

  if (entrySource) {
    params.set("entrySource", entrySource);
  }

  const queryString = params.toString();
  return queryString ? `/town-map/search/results?${queryString}` : "/town-map/search/results";
}

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

export const townMapMarkerIcon = "/icons/town-map-marker.svg";

export const townMapPins: TownMapPin[] = [
  {
    id: "mangwon-burger-hapjeong",
    label: "망원수제버거\n합정점",
    lat: 37.55116,
    lng: 126.91692,
    icon: townMapMarkerIcon,
    href: appendTabQuery("/town-map/businesses/mangwon-burger-hapjeong", "town-map"),
  },
  {
    id: "geumhwa-tonkatsu-hapjeong",
    label: "금화왕돈까스\n합정점",
    lat: 37.54905,
    lng: 126.91310,
    icon: townMapMarkerIcon,
    href: appendTabQuery("/town-map/businesses/geumhwa-tonkatsu-hapjeong", "town-map"),
  },
  {
    id: "hapjeong-bagel-club",
    label: "합정베이글클럽",
    lat: 37.55275,
    lng: 126.91158,
    icon: townMapMarkerIcon,
    href: appendTabQuery("/town-map/businesses/hapjeong-bagel-club", "town-map"),
  },
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

export const townMapRecentSearches = [
  "카페/간식",
  "거래",
  "마라탕",
  "스타벅스",
  "향수",
  "붕어빵",
  "헬스",
];

export const townMapKeyboardSuggestions = ["나", "아", "나는"];

export const townMapKeyboardRows: TownMapKeyboardKey[][] = [
  [
    { id: "q-1", label: "ㅂ" },
    { id: "q-2", label: "ㅈ" },
    { id: "q-3", label: "ㄷ" },
    { id: "q-4", label: "ㄱ" },
    { id: "q-5", label: "ㅅ" },
    { id: "q-6", label: "ㅛ" },
    { id: "q-7", label: "ㅕ" },
    { id: "q-8", label: "ㅑ" },
    { id: "q-9", label: "ㅐ" },
    { id: "q-10", label: "ㅔ" },
  ],
  [
    { id: "a-1", label: "ㅁ" },
    { id: "a-2", label: "ㄴ" },
    { id: "a-3", label: "ㅇ" },
    { id: "a-4", label: "ㄹ" },
    { id: "a-5", label: "ㅎ" },
    { id: "a-6", label: "ㅗ" },
    { id: "a-7", label: "ㅓ" },
    { id: "a-8", label: "ㅏ" },
    { id: "a-9", label: "ㅣ" },
  ],
  [
    { id: "z-1", label: "⇧", action: "shift", tone: "muted", width: "wide" },
    { id: "z-2", label: "ㅋ" },
    { id: "z-3", label: "ㅌ" },
    { id: "z-4", label: "ㅊ" },
    { id: "z-5", label: "ㅍ" },
    { id: "z-6", label: "ㅠ" },
    { id: "z-7", label: "ㅜ" },
    { id: "z-8", label: "ㅡ" },
    { id: "z-9", label: "⌫", action: "delete", tone: "muted", width: "wide" },
  ],
  [
    { id: "x-1", label: "123", action: "numbers", tone: "muted", width: "wide" },
    { id: "x-2", label: "☺", action: "emoji", tone: "muted", width: "wide" },
    { id: "x-3", label: "스페이스", action: "space", width: "wide" },
    { id: "x-4", label: "검색", action: "search", tone: "primary", width: "search" },
  ],
];
