"use client";

import { ActionButton } from "@/components/ui/action-button";
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
