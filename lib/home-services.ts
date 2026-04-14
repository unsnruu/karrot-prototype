export type HomeServiceItem = {
  label: string;
  icon: string;
  href?: string;
};

export type HomeServiceSection = {
  title: string;
  items: HomeServiceItem[];
};

const figmaServiceIcons = {
  usedMarket: "https://www.figma.com/api/mcp/asset/818a837e-3494-4353-baa1-e728c0c15b2c",
  jobs: "https://www.figma.com/api/mcp/asset/e927fbd6-ac30-4be3-b39a-da607b94d8b8",
  realEstate: "https://www.figma.com/api/mcp/asset/5bb77df8-e48b-42e0-bdb3-3ef6d445580f",
  cars: "https://www.figma.com/api/mcp/asset/93949347-f33f-47ab-9d8c-e0988a5fc454",
  store: "https://www.figma.com/api/mcp/asset/0dc49056-feb7-4733-a15a-a7f685d4612a",
  takeout: "https://www.figma.com/api/mcp/asset/c44407a8-e2b5-4123-9e6f-ffc67b3e7d59",
  laundry: "https://www.figma.com/api/mcp/asset/416338e1-ee15-4095-9fa6-24a4fcb5ed68",
  meetup: "https://www.figma.com/api/mcp/asset/8bab667c-ce8c-4c9c-a8ed-05f3fc47c410",
  coffee: "https://www.figma.com/api/mcp/asset/2b310502-6e58-4cd4-bd20-95e7046977c7",
  neighborhoodLife: "https://www.figma.com/api/mcp/asset/6b1eda17-c1f9-4f40-9684-0fcbbc82ce43",
  apartment: "https://www.figma.com/api/mcp/asset/c37c8da0-4abe-4b8a-9a64-25e08a5a03d7",
  story: "https://www.figma.com/api/mcp/asset/a6c11b60-cd8d-4cfc-8040-09e03bdb4a20",
  news: "https://www.figma.com/api/mcp/asset/200c3dab-93cf-4e3f-8085-e0b95d281e03",
  bizProfile: "https://www.figma.com/api/mcp/asset/7ea61411-7d45-4917-8d0b-a7056e0d920b",
  ads: "https://www.figma.com/api/mcp/asset/90bbe784-dc85-4271-9c02-75670b86c087",
  proSearch: "https://www.figma.com/api/mcp/asset/85a28d94-95b8-4acb-9eca-44ee622d5aa8",
  classes: "https://www.figma.com/api/mcp/asset/f0f411ed-8061-4bfd-b955-30d613745b31",
  moving: "https://www.figma.com/api/mcp/asset/ced58158-1ffe-4a55-b77a-36a59b5f5594",
  cleaning: "https://www.figma.com/api/mcp/asset/0257bed5-2878-44e1-923e-86b763ace590",
  construction: "https://www.figma.com/api/mcp/asset/5ec35109-2c6a-4e38-bc4b-29e0209ae613",
  repair: "https://www.figma.com/api/mcp/asset/69be6703-eb92-45b4-90ba-9741c90e29f2",
  sports: "https://www.figma.com/api/mcp/asset/d2a0463e-5350-4f7a-871b-f3080fe746c5",
  academy: "https://www.figma.com/api/mcp/asset/f0f411ed-8061-4bfd-b955-30d613745b31",
  hair: "https://www.figma.com/api/mcp/asset/35c10641-2352-4a03-999a-04a53ae396f0",
  beauty: "https://www.figma.com/api/mcp/asset/ce79d1d7-9120-4406-9dc6-90faad566638",
  hospital: "https://www.figma.com/api/mcp/asset/9f6d6aa4-9c94-40e0-9e29-e81d76da4fa5",
  pets: "https://www.figma.com/api/mcp/asset/b2058fa6-ba78-4cc5-b86d-dc7adc42feac",
  restaurant: "https://www.figma.com/api/mcp/asset/085967a7-2779-4454-b83f-4a40e682b343",
  cafe: "https://www.figma.com/api/mcp/asset/eb65fec8-9c32-4283-af64-7fecea41e8a5",
} as const;

export const homeServiceSections: HomeServiceSection[] = [
  {
    title: "동네 거래",
    items: [
      { label: "중고거래", icon: figmaServiceIcons.usedMarket, href: "/home" },
      { label: "알바", icon: figmaServiceIcons.jobs },
      { label: "부동산", icon: figmaServiceIcons.realEstate },
      { label: "중고차", icon: figmaServiceIcons.cars },
      { label: "스토어", icon: figmaServiceIcons.store },
      { label: "포장주문", icon: figmaServiceIcons.takeout },
    ],
  },
  {
    title: "동네 서비스",
    items: [{ label: "세탁 수거", icon: figmaServiceIcons.laundry }],
  },
  {
    title: "동네 이야기",
    items: [
      { label: "모임", icon: figmaServiceIcons.meetup, href: "/community?tab=meetup" },
      { label: "온라인 커피", icon: figmaServiceIcons.coffee },
      { label: "동네생활", icon: figmaServiceIcons.neighborhoodLife, href: "/community" },
      { label: "아파트", icon: figmaServiceIcons.apartment },
      { label: "스토리", icon: figmaServiceIcons.story },
      { label: "한 일 뉴스", icon: figmaServiceIcons.news },
    ],
  },
  {
    title: "비즈니스",
    items: [
      { label: "비즈프로필", icon: figmaServiceIcons.bizProfile },
      { label: "광고", icon: figmaServiceIcons.ads },
      { label: "사장님 라운지", icon: figmaServiceIcons.bizProfile },
    ],
  },
  {
    title: "동네 전문가 찾기",
    items: [
      { label: "전문가 검색", icon: figmaServiceIcons.proSearch },
      { label: "취미/클래스", icon: figmaServiceIcons.classes },
      { label: "이사/용달", icon: figmaServiceIcons.moving },
      { label: "청소", icon: figmaServiceIcons.cleaning },
      { label: "시공", icon: figmaServiceIcons.construction },
      { label: "수리", icon: figmaServiceIcons.repair },
      { label: "운동", icon: figmaServiceIcons.sports },
      { label: "학원/과외", icon: figmaServiceIcons.academy },
      { label: "미용실", icon: figmaServiceIcons.hair },
      { label: "뷰티", icon: figmaServiceIcons.beauty },
      { label: "병원", icon: figmaServiceIcons.hospital },
      { label: "반려동물", icon: figmaServiceIcons.pets },
    ],
  },
  {
    title: "동네 먹거리 찾기",
    items: [
      { label: "음식점", icon: figmaServiceIcons.restaurant, href: "/town-map" },
      { label: "카페/간식", icon: figmaServiceIcons.cafe, href: "/town-map" },
    ],
  },
];
