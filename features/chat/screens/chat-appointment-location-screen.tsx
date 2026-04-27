"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { ItemDetailKakaoMap } from "@/features/home/components/item-detail-kakao-map";
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
      <div className="mobile-shell relative min-h-screen overflow-hidden bg-white">
        <div className="absolute inset-0">
          <ItemDetailKakaoMap
            heightClassName="h-screen min-h-[22rem]"
            lat={SELL_FLOW_DEFAULT_LOCATION.lat}
            lng={SELL_FLOW_DEFAULT_LOCATION.lng}
            meetupAddress={SELL_FLOW_DEFAULT_LOCATION.address}
            meetupHint={SELL_FLOW_DEFAULT_LOCATION.label}
            rounded={false}
            showLocationLabel={false}
            showMapViewCta={false}
            title="약속 장소"
          />
        </div>

        <Link
          aria-label="약속 화면으로 닫기"
          className="absolute left-4 top-[calc(16px+env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
          href={backHref}
          replace
        >
          <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.9} />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/88 to-transparent px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-20">
          <div className="pointer-events-auto">
            <ActionButton
              className="rounded-[16px] shadow-[0_10px_24px_rgba(255,111,15,0.28)]"
              fullWidth
              href={completeHref}
              replace
              size="large"
              variant="brandSolid"
            >
              선택 완료
            </ActionButton>
          </div>
        </div>
      </div>
    </main>
  );
}
