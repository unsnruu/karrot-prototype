"use client";

import Link from "next/link";
import { SellLocationPickerMap } from "@/features/home/components/sell-location-picker-map";
import { LocationSelectionLayout } from "@/features/shared/components/location-selection-layout";
import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

export function ChatAppointmentLocationScreen({
  backHref,
  completeHref,
}: {
  backHref: string;
  completeHref: string;
}) {
  return (
    <LocationSelectionLayout
      backHref={backHref}
      backLabel="약속 화면으로 닫기"
      description="만나서 거래할 때는 누구나 찾기 쉬운 공공장소가 좋아요."
      footerAction={
        <Link
          className="flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#ff6f0f] text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(255,111,15,0.28)]"
          href={completeHref}
          replace
        >
          선택 완료
        </Link>
      }
      map={
        <SellLocationPickerMap
          initialLat={SELL_FLOW_DEFAULT_LOCATION.lat}
          initialLng={SELL_FLOW_DEFAULT_LOCATION.lng}
          interactive={false}
          showRecenterButton
        />
      }
      replaceBack
      title={
        <>
          이웃과 만나서
          <br />
          거래하고 싶은 장소를 선택해주세요.
        </>
      }
    />
  );
}
