import { LOCAL_FALLBACK_AVATAR_SRC, LOCAL_FALLBACK_IMAGE_SRC } from "@/lib/fallback-images";

export type CommunityFilter = {
  id: string;
  label: string;
  topic?: CommunityPost["topic"];
};

export type CommunityTabKey = "town" | "meetup" | "cafe";
export type CommunityTopicFilterKey = "all" | "general" | "town-scene" | "story";

export type CommunityTopTab = {
  key: CommunityTabKey;
  label: string;
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

export type CommunityPostAuthor = {
  name: string;
  avatar: string;
  activityLabel: string;
};

export type CommunityComment = {
  id: string;
  authorName: string;
  authorAvatar?: string;
  badgeLabel?: string;
  metaLabel: string;
  body: string;
  replyCount?: number;
  replies?: CommunityComment[];
};

export type CommunityPostDetail = CommunityPost & {
  badgeLabel: string;
  author: CommunityPostAuthor;
  bodyParagraphs: string[];
  viewSummary: string;
  commentsList: CommunityComment[];
};

export type CommunityCategory = {
  id: string;
  label: string;
  image: string;
};

export type CommunityMeetup = {
  id: string;
  title: string;
  excerpt: string;
  location: string;
  members: number;
  status?: string;
  image: string;
};

export type CafePost = {
  id: string;
  cafeName: string;
  cafeMeta: string;
  emoji: string;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  views: string;
  previewComment?: string;
};

const meetupFigmaAssets = {
  banner: "https://www.figma.com/api/mcp/asset/b153308e-f1c4-4cef-912f-dddf053ba699",
  categorySelfDevelopment: "https://www.figma.com/api/mcp/asset/17facc84-8cd6-4e9a-a31f-5099345d2503",
  categoryCultureArt: "https://www.figma.com/api/mcp/asset/845e3c5e-d05b-4533-8e2c-c04ab8585e10",
  categoryMusicShow: "https://www.figma.com/api/mcp/asset/9b0012b5-e7ae-493f-bcc7-92120d8a7ac7",
  categoryLocalFriends: "https://www.figma.com/api/mcp/asset/5921de04-1fc2-4d10-9130-0eda30eae38d",
  categoryTravel: "https://www.figma.com/api/mcp/asset/6df9ca6a-899a-4b12-8a11-a06e1f26b881",
  friesMapo: "https://www.figma.com/api/mcp/asset/04a957a3-1125-4358-a359-fb51efc04027",
  friesHapjeong: "https://www.figma.com/api/mcp/asset/1665b11d-ac49-4534-959f-27771a22e30c",
  friesLovers: "https://www.figma.com/api/mcp/asset/e405d12c-566a-44d6-94dd-4cb7694994df",
  pastaShare: "https://www.figma.com/api/mcp/asset/174a0fc9-b3ff-4430-bece-0de710e177e1",
  ninetiesTalk: "https://www.figma.com/api/mcp/asset/e4a222d5-1d13-466e-84db-da67cff4f5b4",
  mixedHobby: "https://www.figma.com/api/mcp/asset/ff5e5d7b-c680-4db7-9271-a5662822013c",
  nightRunning: "https://www.figma.com/api/mcp/asset/7d6cef9c-50ca-4b58-9e89-009d5a84d509",
  afterWorkDrink: "https://www.figma.com/api/mcp/asset/98d0591b-f166-49a3-9e7b-99df026bcbc2",
} as const;

export const communityTopTabs: CommunityTopTab[] = [
  { key: "town", label: "동네생활" },
  { key: "meetup", label: "모임" },
  { key: "cafe", label: "카페" },
];

export const communityFilters: CommunityFilter[] = [
  { id: "all", label: "전체" },
  { id: "general", label: "일반", topic: "일반" },
  { id: "town-scene", label: "동네풍경", topic: "동네풍경" },
  { id: "story", label: "고민/사연", topic: "고민/사연" },
];

export const communityBanner = {
  title: "동네지도 전국 오픈",
  description: "한눈에 동네 소식을 보세요",
  ctaLabel: "우리 동네 지도 보러가기",
  image: meetupFigmaAssets.banner,
};

export const communityCategories: CommunityCategory[] = [
  {
    id: "self-development",
    label: "자기계발 모임",
    image: meetupFigmaAssets.categorySelfDevelopment,
  },
  {
    id: "culture-art",
    label: "문화/예술 모임",
    image: meetupFigmaAssets.categoryCultureArt,
  },
  {
    id: "music-show",
    label: "음악/공연 모임",
    image: meetupFigmaAssets.categoryMusicShow,
  },
  {
    id: "local-friends",
    label: "동네친구 모임",
    image: meetupFigmaAssets.categoryLocalFriends,
  },
  {
    id: "travel",
    label: "야외도어/여행 모임",
    image: meetupFigmaAssets.categoryTravel,
  },
];

export const communityMeetupSection = {
  title: "바삭 녹녹 감튀 모임 🍟",
  description: "감튀 취향 다르면 스트레스 많이 받을 거야",
};

export const communityMeetups: CommunityMeetup[] = [
  {
    id: "fries-mapo",
    title: "(마포) 맥도날드 감튀모임",
    excerpt: "맥도날드 감튀모임할 분들 구합니다!!! 합정·상수·홍대 인근 중심으로 모여요",
    location: "마포구 합정동",
    members: 96,
    image: meetupFigmaAssets.friesMapo,
  },
  {
    id: "fries-hapjeong",
    title: "🍟🍟 (합정) 감자튀김 동아리 🍟🍟",
    excerpt: "달에 2-3회 모여서 감자튀김 산처럼 쌓아놓고 먹는 소소한 모임이에요",
    location: "마포구 합정동",
    members: 247,
    image: meetupFigmaAssets.friesHapjeong,
  },
  {
    id: "fries-lovers",
    title: "🍟 감자튀김을 사랑하는 모임 감튀모 🍟",
    excerpt: "합정동, 망원동 근처에서 감자튀김 🍟 좋아하고 야식 메이트 구해요",
    location: "합정동, 망원동",
    members: 331,
    image: meetupFigmaAssets.friesLovers,
  },
  {
    id: "pasta-share",
    title: "🍝 파스타 좋아하는 사람들 (정보공유)",
    excerpt: "맛집, 레시피, 클래스 정보까지 같이 나눠요",
    location: "합정동, 상수동",
    members: 64,
    status: "일정 모집 중",
    image: meetupFigmaAssets.pastaShare,
  },
  {
    id: "nineties-talk",
    title: "🐎 90년대생 수다모임",
    excerpt: "잡담·산책·카페… 그냥 모여서 떠들 사람",
    location: "연남동",
    members: 28,
    status: "일정 모집중",
    image: meetupFigmaAssets.ninetiesTalk,
  },
  {
    id: "mixed-hobby",
    title: "🌿 2030 혼성 취미모임 (왕초보 환영)",
    excerpt: "보드게임·산책·가벼운 운동 번갈아가며 부담 없이 친해져요",
    location: "서교동",
    members: 137,
    image: meetupFigmaAssets.mixedHobby,
  },
  {
    id: "night-running",
    title: "🏃‍♂️ 평일 밤 러닝 같이 하실 분",
    excerpt: "화·목 저녁, 5km 내외 가볍게",
    location: "마포구청역",
    members: 11,
    image: meetupFigmaAssets.nightRunning,
  },
  {
    id: "after-work-drink",
    title: "🍺 3040 퇴근 후 한잔",
    excerpt: "시끄럽지 않게, 적당히 마시고 귀가",
    location: "합정동",
    members: 58,
    status: "1시간 전 활동",
    image: meetupFigmaAssets.afterWorkDrink,
  },
];

export const cafeSectionTitle = "오늘의 카페 인기글";

export const cafePosts: CafePost[] = [
  {
    id: "fitness-shoulder",
    cafeName: "💪오운완끝판 | 운동/헬스/인물이 거듭나다",
    cafeMeta: "방장 · 오운완 인증",
    emoji: "💪",
    title: "선생님들 제 어깨는 왜 변화가 없을까요...",
    excerpt:
      "어깨 운동 루틴 좀 알려주세요. 헬스 경력 3년차인데, 어깨 근육이 안 자라 고민입니다. 혹시 식단에 문제가 있을까요? 고단백 식단 위주로 먹고 있는데, 쎄오님덜 꿀팁 공유 부탁드립니다.",
    likes: 15,
    comments: 15,
    views: "6,000",
    previewComment: "편해 어째써 복근이 제일 만들기 힘든 부위인 것 같",
  },
  {
    id: "free-talk",
    cafeName: "거지방",
    cafeMeta: "주주총장 · 자유 게시판",
    emoji: "🪰",
    title: "친구들이랑 놀 때 저 혼자 돈이 없어요",
    excerpt: "저만 그런가요?",
    likes: 1,
    comments: 26,
    views: "5,632",
  },
  {
    id: "game-room",
    cafeName: "게임방",
    cafeMeta: "게임 추천 · 멀티 플레이어",
    emoji: "🎮",
    title: "최신 게임이 너무 재밌어요",
    excerpt: "함께 하실 분 찾습니다!",
    likes: 4,
    comments: 30,
    views: "3,850",
    previewComment: "함께 게임하면 더 재미있죠!",
  },
];

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
    image: LOCAL_FALLBACK_IMAGE_SRC,
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
    image: LOCAL_FALLBACK_IMAGE_SRC,
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

const communityCommentThreadsByPostId: Record<string, CommunityComment[]> = {
  "who-are-you": [
    {
      id: "who-are-you-comment-1",
      authorName: "닉넴",
      badgeLabel: "첫 댓글",
      metaLabel: "망원동 · 9시간 전",
      body: "… 아직 술 덜 깬 거 아님?",
      replyCount: 2,
      authorAvatar: LOCAL_FALLBACK_AVATAR_SRC,
      replies: [
        {
          id: "who-are-you-comment-1-reply-1",
          authorName: "네고환영",
          metaLabel: "합정동 · 8시간 전",
          body: "저도 처음엔 그랬는데 창문 쪽에 앉아서 계속 쳐다보더라고요.",
          authorAvatar: LOCAL_FALLBACK_AVATAR_SRC,
        },
      ],
    },
    {
      id: "who-are-you-comment-2",
      authorName: "마포직장인김씨",
      metaLabel: "망원동 · 8시간 전",
      body: "사진 보고 순간 제 눈을 의심했어요ㅋㅋ",
    },
  ],
};

const communityPostDetailOverrides: Partial<Record<string, Partial<CommunityPostDetail>>> = {
  "who-are-you": {
    badgeLabel: "동네친구",
    author: {
      name: "네고환영",
      avatar: LOCAL_FALLBACK_AVATAR_SRC,
      activityLabel: "합정동 인증 14회 · 11시간 전",
    },
    bodyParagraphs: [
      "어제 과음으로 거실에서 그대로 잠들어버림",
      "아침에 눈 떴는데 햇빛이 너무 직격이라 괴로웠어요",
      "아침에 눈을 떴는데",
      "햇빛이 너무 세서",
      "“아… 내가 아직 술이 덜 깼구나” 했는데",
      "창문을 보니까",
      "앵무새가 저를 보고 있더라고요.",
      "진짜입니다.",
      "꿈 아니고요.",
      "저랑 눈 마주쳤습니다.",
      "망원동에서 이런 광경 처음 봅니다.",
      "진귀해서 공유합니다.",
      "혹시 주인분 계시면 댓글 주세요.",
    ],
    viewSummary: "57명이 봤어요",
  },
};

function buildDefaultCommunityPostDetail(post: CommunityPost): CommunityPostDetail {
  return {
    ...post,
    badgeLabel: "동네친구",
    author: {
      name: "당근 이웃",
      avatar: post.image ?? LOCAL_FALLBACK_AVATAR_SRC,
      activityLabel: `${post.town} 인증 · ${post.postedAt}`,
    },
    bodyParagraphs: [post.excerpt, "이 글의 상세 내용은 이후 Supabase 데이터와 연결되면 더 풍부하게 보여줄 예정입니다."],
    viewSummary: `${post.views}명이 봤어요`,
    commentsList: [],
  };
}

export function getFallbackCommunityPostDetail(postId: string) {
  const post = communityPosts.find((entry) => entry.id === postId);

  if (!post) {
    return null;
  }

  const baseDetail = buildDefaultCommunityPostDetail(post);
  const override = communityPostDetailOverrides[postId];

  return {
    ...baseDetail,
    ...override,
    author: override?.author ?? baseDetail.author,
    bodyParagraphs: override?.bodyParagraphs ?? baseDetail.bodyParagraphs,
    commentsList: communityCommentThreadsByPostId[postId] ?? [],
  } satisfies CommunityPostDetail;
}

export function getFallbackCommunityRecommendations(postId: string, limit = 3) {
  return communityPosts.filter((post) => post.id !== postId).slice(0, limit);
}
