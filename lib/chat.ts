export type ChatCategory = {
  label: string;
  active?: boolean;
  hasChevron?: boolean;
  icon?: "filter";
};

export type ChatThreadPreview = {
  id: string;
  name: string;
  town: string;
  updatedAt: string;
  lastMessage: string;
  avatarImage?: string;
  href?: string;
};

export const chatCategories: ChatCategory[] = [
  { label: "필터", icon: "filter" },
  { label: "전체", active: true },
  { label: "노트북" },
  { label: "향수" },
  { label: "부동산", hasChevron: true },
  { label: "가까운 동네" },
];

export const chatThreadPreviews: ChatThreadPreview[] = [
  {
    id: "chat-heart-1",
    name: "당근하트",
    town: "합정동",
    updatedAt: "2주 전",
    lastMessage: "안녕하세요!",
    avatarImage: "/images/figma-migrated/701c5c00-1280-4486-a9d1-c4e611b42400.svg",
  },
  {
    id: "chat-heart-2",
    name: "당근하트",
    town: "합정동",
    updatedAt: "2주 전",
    lastMessage: "안녕하세요!",
    avatarImage: "/images/figma-migrated/701c5c00-1280-4486-a9d1-c4e611b42400.svg",
  },
  {
    id: "chat-heart-3",
    name: "당근하트",
    town: "합정동",
    updatedAt: "2주 전",
    lastMessage: "안녕하세요!",
    avatarImage: "/images/figma-migrated/701c5c00-1280-4486-a9d1-c4e611b42400.svg",
  },
];
