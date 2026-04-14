import Image from "next/image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { prototypeViewerUser } from "@/lib/prototype-user";

type ServiceItem = {
  label: string;
  iconSrc: string;
  bubble: string;
};

type ServiceSection = {
  title: string;
  items: ServiceItem[];
};

type ShortcutItem = {
  label: string;
  iconSrc: string;
  hasDot?: boolean;
};

type MenuGroup = {
  title: string;
  items: Array<{
    label: string;
    iconSrc: string;
  }>;
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

const shortcuts: ShortcutItem[] = [
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

function ProfileCard() {
  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e5e7eb]">
            <Image alt="" height={28} src={figmaIcons.profileAvatar} width={28} />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold leading-[25.5px] tracking-[-0.03em] text-[#0a0a0a]">
              {prototypeViewerUser.name}
            </span>
            <span className="text-xs font-semibold leading-[18px] text-[#ff6900]">
              {prototypeViewerUser.mannerScore.toFixed(1)}°C
            </span>
          </div>
        </div>
        <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
          ›
        </span>
      </div>
    </section>
  );
}

function PayCard() {
  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8a3d] text-[10px] font-bold text-white">
            P
          </span>
          <span className="text-sm font-bold leading-[21px] text-[#ff8a3d]">pay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold leading-6 text-[#0a0a0a]">8,700원</span>
          <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
            ›
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm font-medium leading-[21px] text-[#364153]">
          <button type="button">충전</button>
          <button type="button">송금</button>
        </div>
        <button
          className="inline-flex h-[35px] items-center gap-2 rounded-full bg-[#101828] px-4 text-[13px] font-semibold leading-[19.5px] text-white"
          type="button"
        >
          <Image alt="" height={16} src={figmaIcons.payCard} width={16} />
          결제
        </button>
      </div>
    </section>
  );
}

export function MyKarrotScreen() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#1e2939]">
      <div className="mobile-shell-wide min-h-screen pb-28">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center justify-between px-[clamp(20px,5vw,32px)]">
            <h1 className="text-[clamp(1.25rem,5vw,1.375rem)] font-bold leading-[1.5] tracking-[-0.04em] text-[#0a0a0a]">
              나의 당근
            </h1>
            <button
              aria-label="설정"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-[#6b7280]"
              type="button"
            >
              ⚙
            </button>
          </div>
        </header>

        <div className="space-y-3 px-[clamp(16px,4vw,24px)] pb-8 pt-3">
          <ProfileCard />
          <PayCard />

          {serviceSections.map((section) => (
            <section
              className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
              key={section.title}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-bold leading-[22.5px] tracking-[-0.03em] text-[#0a0a0a]">
                  {section.title}
                </h2>
                <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
                  ›
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(152px,1fr))] gap-x-4 gap-y-5">
                {section.items.map((item) => (
                  <div className="flex min-h-9 items-center gap-3" key={item.label}>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: item.bubble }}
                    >
                      <Image alt="" height={20} src={item.iconSrc} width={20} />
                    </span>
                    <span className="text-[14px] font-medium leading-[21px] tracking-[-0.02em] text-[#1e2939]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-3 gap-4">
              {shortcuts.map((item) => (
                <button className="flex flex-col items-center gap-2" key={item.label} type="button">
                  <span className="relative flex h-[26px] w-[26px] items-center justify-center">
                    <Image alt="" height={26} src={item.iconSrc} width={26} />
                    {item.hasDot ? (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff6900]" />
                    ) : null}
                  </span>
                  <span className="text-xs font-medium leading-[18px] text-[#4a5565]">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {menuGroups.map((group) => (
            <section
              className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
              key={group.title}
            >
              <h2 className="mb-2 text-[15px] font-bold leading-[22.5px] text-[#0a0a0a]">{group.title}</h2>
              <div>
                {group.items.map((item) => (
                  <button
                    className="flex w-full items-center justify-between py-3 text-left"
                    key={item.label}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                      <Image alt="" height={22} src={item.iconSrc} width={22} />
                      <span className="text-[15px] font-medium leading-[22.5px] text-[#1e2939]">{item.label}</span>
                    </span>
                    <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
                      ›
                    </span>
                  </button>
                ))}
              </div>
            </section>
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
