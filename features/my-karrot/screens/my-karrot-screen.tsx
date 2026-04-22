import { BottomNav } from "@/components/navigation/bottom-nav";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { MyKarrotMenuGroup, type MyKarrotMenuItem } from "@/features/my-karrot/components/my-karrot-menu-group";
import { MyKarrotPayCard } from "@/features/my-karrot/components/my-karrot-pay-card";
import { MyKarrotProfileCard } from "@/features/my-karrot/components/my-karrot-profile-card";
import { MyKarrotServiceSection, type MyKarrotServiceItem } from "@/features/my-karrot/components/my-karrot-service-section";
import { MyKarrotShortcutGrid, type MyKarrotShortcutItem } from "@/features/my-karrot/components/my-karrot-shortcut-grid";

type ServiceSection = {
  title: string;
  items: MyKarrotServiceItem[];
};

type MenuGroup = {
  title: string;
  items: MyKarrotMenuItem[];
};

const figmaIcons = {
  usedMarket: "/icons/my-karrot/used-market.svg",
  job: "/icons/my-karrot/job.svg",
  realEstate: "/icons/my-karrot/real-estate.svg",
  car: "/icons/my-karrot/car.svg",
  group: "/icons/my-karrot/group.svg",
  walk: "/icons/my-karrot/walk.svg",
  laundry: "/icons/my-karrot/laundry.svg",
  dangnHome: "/icons/my-karrot/dangn-home.svg",
  profileAvatar: "/icons/my-karrot/profile-avatar.svg",
  payCard: "/icons/my-karrot/pay-card.svg",
  favorites: "/icons/my-karrot/favorites.svg",
  recentClock: "/icons/my-karrot/recent-clock.svg",
  benefit: "/icons/my-karrot/benefit.svg",
  salesManage: "/icons/my-karrot/sales-manage.svg",
  purchaseHistory: "/icons/my-karrot/purchase-history.svg",
  priceFinder: "/icons/my-karrot/price-finder.svg",
  ledger: "/icons/my-karrot/ledger.svg",
} as const;

const serviceSections: ServiceSection[] = [
  {
    title: "서비스",
    items: [
      { label: "중고거래", iconSrc: figmaIcons.usedMarket, bubble: "#ffedd4" },
      { label: "알바", iconSrc: figmaIcons.job, bubble: "#ffedd4" },
      { label: "부동산", iconSrc: figmaIcons.realEstate, bubble: "#ffedd4" },
      { label: "중고차", iconSrc: figmaIcons.car, bubble: "#dbeafe" },
      { label: "모임", iconSrc: figmaIcons.group, bubble: "#ffe2e2" },
      { label: "동네걷기", iconSrc: figmaIcons.walk, bubble: "#ffedd4" },
      { label: "세탁 수거", iconSrc: figmaIcons.laundry, bubble: "#dcfce7" },
      { label: "당근이네", iconSrc: figmaIcons.dangnHome, bubble: "#ffedd4" },
    ],
  },
];

const shortcuts: MyKarrotShortcutItem[] = [
  { label: "관심목록", iconSrc: figmaIcons.favorites },
  { label: "최근 본 글", iconSrc: figmaIcons.recentClock },
  { label: "혜택", iconSrc: figmaIcons.benefit, hasDot: true },
];

const menuGroups: MenuGroup[] = [
  {
    title: "나의 거래",
    items: [
      { label: "판매관리", iconSrc: figmaIcons.salesManage },
      { label: "구매내역", iconSrc: figmaIcons.purchaseHistory },
      { label: "내 물건 가격 찾기", iconSrc: figmaIcons.priceFinder },
      { label: "중고거래 가계부", iconSrc: figmaIcons.ledger },
    ],
  },
  {
    title: "나의 광고",
    items: [
      { label: "소상공인", iconSrc: figmaIcons.job },
      { label: "키워드 광고 성과", iconSrc: figmaIcons.benefit },
      { label: "내 단골 목록", iconSrc: figmaIcons.favorites },
      { label: "받은 쿠폰함", iconSrc: figmaIcons.usedMarket },
    ],
  },
  {
    title: "나의 활동",
    items: [
      { label: "동네 구인 광고", iconSrc: figmaIcons.job },
      { label: "내 동네생활 글", iconSrc: figmaIcons.dangnHome },
      { label: "후기 및 제안한 장소", iconSrc: figmaIcons.walk },
    ],
  },
  {
    title: "나의 비즈니스",
    items: [
      { label: "비즈프로필 관리", iconSrc: figmaIcons.usedMarket },
      { label: "광고", iconSrc: figmaIcons.job },
      { label: "사장님 파운지", iconSrc: figmaIcons.group },
    ],
  },
  {
    title: "설정",
    items: [
      { label: "내 정보 설정", iconSrc: figmaIcons.profileAvatar },
      { label: "동네 인증하기", iconSrc: figmaIcons.realEstate },
      { label: "QR 코드 스캔", iconSrc: figmaIcons.benefit },
      { label: "알 설정", iconSrc: figmaIcons.benefit },
    ],
  },
  {
    title: "고객지원",
    items: [
      { label: "공지사항", iconSrc: figmaIcons.usedMarket },
      { label: "의견 남기기", iconSrc: figmaIcons.job },
      { label: "당근 더 알아보기", iconSrc: figmaIcons.benefit },
    ],
  },
];

export function MyKarrotScreen() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#1e2939]">
      <div className="mobile-shell-wide min-h-screen pb-28">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center justify-between px-[clamp(20px,5vw,32px)]">
            <h1 className="text-[clamp(1.25rem,5vw,1.375rem)] font-bold leading-[1.5] tracking-[-0.04em] text-[#0a0a0a]">
              나의 당근
            </h1>
            <PendingFeatureLink
              aria-label="설정"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-[#6b7280]"
              featureLabel="설정"
              returnTo="/my-karrot"
              tracking={{
                screenName: "my_karrot",
                targetType: "button",
                targetName: "my_karrot_settings_button",
                surface: "header",
                path: "/my-karrot",
              }}
            >
              ⚙
            </PendingFeatureLink>
          </div>
        </header>

        <div className="space-y-3 px-[clamp(16px,4vw,24px)] pb-8 pt-3">
          <MyKarrotProfileCard profileAvatarSrc={figmaIcons.profileAvatar} />
          <MyKarrotPayCard payCardIconSrc={figmaIcons.payCard} />

          {serviceSections.map((section) => (
            <MyKarrotServiceSection items={section.items} key={section.title} title={section.title} />
          ))}

          <MyKarrotShortcutGrid shortcuts={shortcuts} />

          {menuGroups.map((group) => (
            <MyKarrotMenuGroup items={group.items} key={group.title} title={group.title} />
          ))}

          <section className="px-1 pb-4 pt-3 text-xs leading-[19.5px] text-[#99a1af]">
            <p>중고거래 관련 문의사항은 채팅 상담을 이용해 주세요.</p>
            <p>채팅 상담 운영시간: 오전 09:00 - 오후 06:00 (주말·공휴일 제외)</p>
          </section>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
