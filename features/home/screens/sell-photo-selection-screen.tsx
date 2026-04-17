"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { resolveHomeHrefFromPathname } from "@/lib/home-experiment";
import { SELL_FLOW_MAX_PHOTOS, SELL_FLOW_SAMPLE_PHOTOS } from "@/lib/sell-flow";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

export function SellPhotoSelectionScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { draft, hydrated, togglePhoto } = useSellFlow();
  const hasTrackedScreenView = useRef(false);
  const homeHref = resolveHomeHrefFromPathname(pathname);

  const selectedCount = draft.photos.length;

  useEffect(() => {
    if (!hydrated || hasTrackedScreenView.current) {
      return;
    }

    hasTrackedScreenView.current = true;
    trackEvent(
      "screen_viewed",
      buildScreenViewedEventProperties({
        pathname,
        queryString: "",
        additionalProperties: {
          flow_name: "sell",
          photo_count: draft.photos.length,
          step_name: "photos",
        },
      }),
    );
  }, [draft.photos.length, hydrated, pathname]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white pb-[168px]">
        <header className="flex h-14 items-center justify-between px-4">
          <Link aria-label="홈으로 돌아가기" className="flex h-10 w-10 items-center justify-center" href={homeHref}>
            <CloseIcon />
          </Link>
          <Link
            className="flex items-center gap-1 text-[15px] font-semibold text-[#111827]"
            href={buildPendingFeatureHref("/home/sell/photos", "최근 항목 정렬 변경")}
          >
            최근 항목
            <ChevronDownIcon />
          </Link>
          <div className="h-10 w-10" />
        </header>

        <section className="px-4 pb-2 pt-2">
          <p className="text-[15px] font-semibold leading-[1.45] text-[#2a2f36]">
            사진은 최대 4장까지 선택할 수 있어요.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-px bg-[#f3f4f6]">
          {SELL_FLOW_SAMPLE_PHOTOS.map((photo, index) => {
            const selectedIndex = draft.photos.indexOf(photo);
            const isSelected = selectedIndex >= 0;

            return (
              <button
                className="relative aspect-square overflow-hidden bg-[#f5f5f5]"
                key={photo}
                onClick={() => {
                  const isSelected = draft.photos.includes(photo);

                  trackEvent("sell_photo_toggled", {
                    next_selected_count: isSelected ? Math.max(0, draft.photos.length - 1) : draft.photos.length + 1,
                    photo_id: photo,
                    selected: !isSelected,
                    step_name: "photos",
                  });
                  togglePhoto(photo);
                }}
                type="button"
              >
                <AppImage
                  alt={`선택 가능한 사진 ${index + 1}`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="33vw"
                  src={photo}
                />

                {isSelected ? (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#111827] shadow">
                    {selectedIndex + 1}
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 h-7 w-7 rounded-full border-2 border-white bg-black/10" />
                )}
              </button>
            );
          })}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]">
        <div className="mobile-shell">
          <button
            className={`flex h-[56px] w-full items-center justify-center rounded-[16px] text-[20px] font-bold transition-colors ${
              selectedCount > 0 ? "bg-[#2b3138] text-white" : "bg-[#d1d5db] text-[#9ca3af]"
            }`}
            disabled={selectedCount === 0}
            onClick={() => router.push("/home/sell/write")}
            type="button"
          >
            {selectedCount > 0 ? `${selectedCount}장 올리기` : `0/${SELL_FLOW_MAX_PHOTOS}`}
          </button>
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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
