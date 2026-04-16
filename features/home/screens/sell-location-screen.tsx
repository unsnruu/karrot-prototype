"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
import { SellLocationPickerMap } from "@/features/home/components/sell-location-picker-map";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { LocationSelectionLayout } from "@/features/shared/components/location-selection-layout";
import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

export function SellLocationScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, hydrated, setLocation } = useSellFlow();
  const hasTrackedScreenView = useRef(false);

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      trackEvent("sell_flow_redirected_missing_photos", {
        source: "sell_location",
        target_step: "photos",
      });
      router.replace("/home/sell/photos");
    }
  }, [draft.photos.length, hydrated, router]);

  useEffect(() => {
    if (!hydrated || hasTrackedScreenView.current) {
      return;
    }

    hasTrackedScreenView.current = true;
    trackEvent(
      "screen_viewed",
      buildScreenViewedEventProperties({
        pathname,
        queryString: searchParams.toString(),
        additionalProperties: {
          flow_name: "sell",
          has_location: Boolean(draft.location),
          photo_count: draft.photos.length,
          step_name: "location",
        },
      }),
    );
  }, [draft.location, draft.photos.length, hydrated, pathname, searchParams]);

  useEffect(() => {
    setLocation(SELL_FLOW_DEFAULT_LOCATION);
  }, [setLocation]);

  const handleComplete = () => {
    setLocation(SELL_FLOW_DEFAULT_LOCATION);
    router.push("/home/sell/write");
  };

  return (
    <LocationSelectionLayout
      backHref="/home/sell/write"
      backLabel="글쓰기 화면으로 닫기"
      description="만나서 거래할 때는 누구나 찾기 쉬운 공공장소가 좋아요."
      footerAction={
        <button
          className="flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#ff6f0f] text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(255,111,15,0.28)]"
          onClick={handleComplete}
          type="button"
        >
          {draft.location?.label ?? SELL_FLOW_DEFAULT_LOCATION.label}로 설정
        </button>
      }
      headerTitle="거래 희망 장소"
      map={<SellLocationPickerMap initialLat={SELL_FLOW_DEFAULT_LOCATION.lat} initialLng={SELL_FLOW_DEFAULT_LOCATION.lng} interactive={false} />}
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
