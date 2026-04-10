export type CommunityFilter = {
  label: string;
  active?: boolean;
  hasChevron?: boolean;
};

export type CommunityPost = {
  id: string;
  topic: string;
  title: string;
  excerpt: string;
  town: string;
  postedAt: string;
  views: string;
  comments: number;
  likes?: number;
  image?: string;
};

export const communityTopTabs = ["동네생활", "모임", "카페"] as const;

export const communityFilters: CommunityFilter[] = [
  { label: "추천", active: true, hasChevron: true },
  { label: "인기" },
  { label: "생활정보" },
  { label: "맛집/음식" },
  { label: "반려동물" },
  { label: "취미/여가" },
  { label: "운동" },
  { label: "가족/육아" },
];

export const communityBanner = {
  title: "동네지도 전국 오픈",
  description: "한눈에 동네 소식을 보세요",
  ctaLabel: "우리 동네 지도 보러가기",
  image: "/images/figma-migrated/ffee75cf-f540-4bc8-9028-4b554bd2d856.png",
};

export const communityPosts: CommunityPost[] = [
  {
    id: "walk-now",
    topic: "일반",
    title: "합정 지금 당장 만나서 산책하실 분!!!",
    excerpt: "합정역 근처예요. 심심해요… 두 명 있어요 같이 걸어요",
    town: "합정동",
    postedAt: "2시간 전",
    views: "182",
    comments: 6,
  },
  {
    id: "flyer-check",
    topic: "고민/사연",
    title: "합정역 헤어샵 전단지 이거 진짜인가요?",
    excerpt: "요즘 붙어 있는 할인 전단지인데 실제로 가본 분 있나요??",
    town: "서교동",
    postedAt: "3일전",
    views: "721",
    comments: 4,
    likes: 2,
    image: "/images/figma-migrated/6e5431bf-e150-42f6-9907-303d997da666.png",
  },
  {
    id: "who-are-you",
    topic: "일반",
    title: "넌 누구냐...",
    excerpt: "어제 과음으로 거실에서 그대로 잠들어버림... 아침에 눈 떴는데 햇빛이 너무 직격이라 괴로웠어요",
    town: "합정동",
    postedAt: "1일 전",
    views: "123",
    comments: 8,
    likes: 4,
    image: "/images/figma-migrated/958a8039-9d69-4141-bb33-d6fa09eb4b83.png",
  },
  {
    id: "bbq-tonight",
    topic: "일반",
    title: "오늘 합정에서 고기 드실 분 있나요?",
    excerpt: "혼자 먹기 싫어요… 삼겹살 땡김",
    town: "합정동",
    postedAt: "4일 전",
    views: "3,982",
    comments: 1,
  },
  {
    id: "night-noise",
    topic: "동네풍경",
    title: "합정동 쪽 시끄러웠던 거 뭐였어요?",
    excerpt: "어제 밤에 소방차 여러 대 지나간 것 같던데 혹시 아시는 분",
    town: "합정동",
    postedAt: "1시간 전",
    views: "123",
    comments: 6,
  },
  {
    id: "exit-8-crowd",
    topic: "일반",
    title: "합정역 8번 출구 쪽 사람 왜 이렇게 많아요?",
    excerpt: "퇴근 시간도 아닌데 갑자기 붐비는 느낌… 무슨 일 있었나요",
    town: "합정동",
    postedAt: "47분 전",
    views: "264",
    comments: 7,
    likes: 3,
  },
];
