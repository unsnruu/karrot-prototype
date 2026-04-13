import Link from "next/link";
import { type ChatPreview, type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

export function ChatAppointmentScreen({
  seller,
  item,
  itemId,
  backHref,
}: {
  seller?: SellerProfile | null;
  item?: MarketplaceItem | null;
  chat?: ChatPreview | null;
  itemId: string;
  backHref: string;
}) {
  if (!seller || !item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] p-6 text-center">
        <div className="rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-lg font-semibold text-[#111827]">약속 화면을 불러올 수 없어요.</p>
          <Link className="mt-4 inline-block text-sm font-semibold text-[#ff6f0f]" href={backHref}>
            채팅으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto min-h-screen max-w-[393px] bg-white px-4 pb-10 pt-6">
        <header className="flex items-center justify-between">
          <Link className="flex h-8 w-8 items-center justify-center text-black" href={backHref}>
            <CloseIcon />
          </Link>
          <button className="flex h-8 w-8 items-center justify-center text-black" type="button">
            <KebabIcon />
          </button>
        </header>

        <h1 className="mt-8 text-[21px] font-semibold tracking-[-0.03em] text-black">{seller.name}님과 약속</h1>

        <section className="mt-8">
          <AppointmentRow icon="down" label="날짜" trailing="3월 21일 금요일" />
          <AppointmentRow icon="down" label="시간" trailing="오후 6:20" />
          <AppointmentRow icon="right" label="장소" muted trailing={item.meetupHint || "장소 선택"} />
          <AppointmentRow icon="down" label="약속 전 나에게 알림" trailing="없음" />
        </section>

        <div className="mt-[380px]">
          <Link
            className="flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#ff6f0f] text-[15px] font-bold text-white"
            href={backHref}
          >
            완료
          </Link>
        </div>
      </div>
    </main>
  );
}

function AppointmentRow({
  label,
  trailing,
  muted = false,
  icon,
}: {
  label: string;
  trailing: string;
  muted?: boolean;
  icon: "down" | "right";
}) {
  return (
    <div className="flex h-[54px] items-center justify-between border-b border-black/5">
      <p className="text-[16px] font-semibold text-[#25282d]">{label}</p>
      <div className="flex items-center gap-2">
        <p className={`text-[16px] ${muted ? "text-[#c6c9cf]" : "text-[#25282d]"}`}>{trailing}</p>
        {icon === "down" ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="6.5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="17.5" r="1.4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d="M5.5 7.5L10 12L14.5 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
      <path d="M7.5 5.5L12 10L7.5 14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
