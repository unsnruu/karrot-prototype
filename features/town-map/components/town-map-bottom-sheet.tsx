"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { TownMapPostCard } from "@/features/town-map/components/town-map-post-card";
import { TownMapQuickActionCard } from "@/features/town-map/components/town-map-quick-action-card";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";
import {
  townMapPosts,
  townMapQuickActions,
  townMapScreenData,
} from "@/lib/town-map";

const COLLAPSED_RATIO = 335 / 852;
const EXPANDED_RATIO = 711 / 852;

export function TownMapBottomSheet() {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startY: number;
    startHeight: number;
    containerHeight: number;
  } | null>(null);

  const [sheetHeight, setSheetHeight] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getSnapHeights = useCallback(() => {
    const containerHeight = sheetRef.current?.parentElement?.clientHeight ?? 0;
    const collapsedHeight = Math.round(containerHeight * COLLAPSED_RATIO);
    const expandedHeight = Math.round(containerHeight * EXPANDED_RATIO);

    return {
      containerHeight,
      collapsedHeight,
      expandedHeight,
    };
  }, []);

  useEffect(() => {
    const syncHeight = () => {
      const { collapsedHeight } = getSnapHeights();
      setSheetHeight((prev) => {
        if (prev == null || !sheetRef.current) {
          return collapsedHeight;
        }

        const { expandedHeight } = getSnapHeights();
        const collapsedDistance = Math.abs(prev - collapsedHeight);
        const expandedDistance = Math.abs(prev - expandedHeight);
        return collapsedDistance <= expandedDistance ? collapsedHeight : expandedHeight;
      });
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [getSnapHeights]);

  const stopDragging = useCallback(
    (pointerId?: number) => {
      const current = dragStateRef.current;
      if (!current) {
        return;
      }

      if (pointerId != null && current.pointerId !== pointerId) {
        return;
      }

      const { collapsedHeight, expandedHeight } = getSnapHeights();
      setSheetHeight((prev) => {
        const currentHeight = prev ?? collapsedHeight;
        const collapsedDistance = Math.abs(currentHeight - collapsedHeight);
        const expandedDistance = Math.abs(currentHeight - expandedHeight);
        const nextHeight = collapsedDistance <= expandedDistance ? collapsedHeight : expandedHeight;

        if (nextHeight === expandedHeight && currentHeight !== expandedHeight) {
          trackEvent("component_interacted", {
            component_name: "town_map_bottom_sheet",
            interaction_type: "expand",
            screen_name: "town_map",
            surface: "bottom_sheet",
          });
        }

        return nextHeight;
      });
      dragStateRef.current = null;
      setIsDragging(false);
    },
    [getSnapHeights],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const { containerHeight, collapsedHeight } = getSnapHeights();
      if (containerHeight === 0) {
        return;
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startHeight: sheetHeight ?? collapsedHeight,
        containerHeight,
      };
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [getSnapHeights, sheetHeight],
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragStateRef.current;
    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    const minHeight = Math.round(current.containerHeight * COLLAPSED_RATIO);
    const maxHeight = Math.round(current.containerHeight * EXPANDED_RATIO);
    const deltaY = current.startY - event.clientY;
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, current.startHeight + deltaY));
    setSheetHeight(nextHeight);
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    stopDragging(event.pointerId);
  }, [stopDragging]);

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    stopDragging(event.pointerId);
  }, [stopDragging]);

  return (
    <section
      className="absolute inset-x-0 bottom-0 z-20 rounded-t-[20px] bg-white px-4 pb-0 pt-5 shadow-[0px_-6px_24px_rgba(0,0,0,0.06)]"
      ref={sheetRef}
      style={{
        height: sheetHeight == null ? undefined : `${sheetHeight}px`,
        transition: isDragging ? "none" : "height 220ms ease",
      }}
    >
      <button
        aria-label="바텀시트 드래그 핸들"
        className="flex w-full cursor-grab touch-none justify-center pb-3 active:cursor-grabbing"
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        type="button"
      >
        <span className="h-2 w-[62px] rounded-full bg-[#d9d9d9]" />
      </button>

      <div className="h-[calc(100%-20px)] overflow-y-auto pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1">
          <span className="relative h-4 w-4 shrink-0">
            <AppImage alt="" className="object-contain" fill sizes="16px" src={townMapScreenData.locationIcon} />
          </span>
          <span className="text-[14px] font-semibold text-black">{townMapScreenData.townLabel}</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {townMapQuickActions.map((action) => (
            <TownMapQuickActionCard action={action} key={action.id} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[8px] bg-[#f7f8f9] px-4 py-[11px]">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <AppImage alt="" className="object-cover" fill sizes="44px" src={townMapScreenData.ad.image} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] leading-[1.5] text-black">{townMapScreenData.ad.title}</p>
            <p className="truncate text-[14px] font-semibold leading-[1.5] text-black">{townMapScreenData.ad.description}</p>
          </div>
          <Link
            aria-label="광고 자세히 보기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white"
            href={buildPendingFeatureHref("/town-map", "동네지도 광고 보기")}
            onClick={() => {
              trackEvent(
                "element_clicked",
                buildElementClickedEventProperties({
                  screenName: "town_map",
                  targetType: "button",
                  targetName: "town_map_bottom_sheet_ad_button",
                  surface: "bottom_sheet",
                  path: "/town-map",
                  destinationPath: buildPendingFeatureHref("/town-map", "동네지도 광고 보기"),
                }),
              );
            }}
          >
            <span className="relative h-4 w-4">
              <AppImage alt="" className="object-contain" fill sizes="16px" src={townMapScreenData.ad.arrowIcon} />
            </span>
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-10 pb-10">
          {townMapPosts.map((post) => (
            <TownMapPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
