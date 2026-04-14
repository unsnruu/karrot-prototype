"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SellLocationPickerMap } from "@/features/home/components/sell-location-picker-map";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

export function SellLocationScreen() {
  const router = useRouter();
  const { draft, hydrated, setLocation } = useSellFlow();
  const [center, setCenter] = useState({
    lat: draft.location?.lat ?? SELL_FLOW_DEFAULT_LOCATION.lat,
    lng: draft.location?.lng ?? SELL_FLOW_DEFAULT_LOCATION.lng,
  });

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      router.replace("/home/sell");
    }
  }, [draft.photos.length, hydrated, router]);

  const handleCenterChange = useCallback((coords: { lat: number; lng: number }) => {
    setCenter(coords);
  }, []);

  const handleComplete = () => {
    setLocation({
      label: "합정역 8번 출구",
      address: "서울 마포구 양화로 55 합정역 인근",
      lat: center.lat,
      lng: center.lng,
      distanceLabel: "120m",
    });
    router.push("/home/sell/write");
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col overflow-hidden bg-white">
        <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4">
          <Link aria-label="글쓰기 화면으로 닫기" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/92 shadow" href="/home/sell/write">
            <CloseIcon />
          </Link>
        </header>

        <section className="relative z-10 bg-white px-4 pb-4 pt-20">
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
          initialLat={draft.location?.lat}
          initialLng={draft.location?.lng}
          onCenterChange={handleCenterChange}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/92 to-transparent px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-16">
          <div className="mobile-shell pointer-events-auto">
            <button
              className="flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#ff6f0f] text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(255,111,15,0.28)]"
              onClick={handleComplete}
              type="button"
            >
              선택 완료
            </button>
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
