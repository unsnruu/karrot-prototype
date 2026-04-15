import Link from "next/link";
import { SellLocationPickerMap } from "@/features/home/components/sell-location-picker-map";
import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

export function ChatAppointmentLocationScreen({
  backHref,
  completeHref,
}: {
  backHref: string;
  completeHref: string;
}) {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col overflow-hidden bg-white">
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-[#f3f4f6] bg-white px-4">
          <Link aria-label="약속 화면으로 닫기" className="flex h-10 w-10 items-center justify-center" href={backHref}>
            <CloseIcon />
          </Link>
        </header>

        <section className="relative z-10 bg-white px-4 pb-4 pt-6">
          <h1 className="text-[20px] font-bold leading-[1.35] tracking-[-0.03em] text-[#111827]">
            이웃과 만나서
            <br />
            거래하고 싶은 장소를 선택해주세요.
          </h1>
          <p className="mt-2 text-[14px] leading-[1.5] text-[#6b7280]">
            만나서 거래할 때는 누구나 찾기 쉬운 공공장소가 좋아요.
          </p>
        </section>

        <SellLocationPickerMap
          initialLat={SELL_FLOW_DEFAULT_LOCATION.lat}
          initialLng={SELL_FLOW_DEFAULT_LOCATION.lng}
          interactive={false}
          onCenterChange={() => {}}
          showRecenterButton
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/92 to-transparent px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-16">
          <div className="mobile-shell pointer-events-auto">
            <Link
              className="flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#ff6f0f] text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(255,111,15,0.28)]"
              href={completeHref}
            >
              선택 완료
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}
