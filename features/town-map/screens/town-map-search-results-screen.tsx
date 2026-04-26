"use client";

import Link from "next/link";
import { Crosshair, Home, List } from "lucide-react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { TownMapKakaoMap } from "@/features/town-map/components/town-map-kakao-map";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { townMapCenter, townMapMarkerIcon, type TownMapPin, type TownMapSearchEntrySource } from "@/lib/town-map";

type TownMapSearchResultsScreenProps = {
  entrySource: TownMapSearchEntrySource;
  query: string;
  returnHref: string;
};

const resultPins: TownMapPin[] = [
  {
    id: "hapjeong-station",
    label: "합정역",
    lat: 37.54991,
    lng: 126.91440,
    icon: townMapMarkerIcon,
  },
  {
    id: "hapjeong-parking",
    label: "합정역주차장\n(케이엠파크)",
    lat: 37.54892,
    lng: 126.91552,
    icon: townMapMarkerIcon,
  },
  {
    id: "hapjeong-bagel-cafe",
    label: "파리바게뜨\n합정역점",
    lat: 37.55148,
    lng: 126.91660,
    icon: townMapMarkerIcon,
  },
  {
    id: "hapjeong-restroom",
    label: "합정역개방화장실",
    lat: 37.55040,
    lng: 126.91588,
    icon: townMapMarkerIcon,
  },
];

export function TownMapSearchResultsScreen({
  entrySource,
  query,
  returnHref,
}: TownMapSearchResultsScreenProps) {
  const pathname = usePathname();
  const normalizedQuery = query.trim() || "합정역";

  const trackResultsClick = ({
    destinationPath,
    targetName,
    targetType,
  }: {
    destinationPath?: string;
    targetName: string;
    targetType: string;
  }) => {
    trackEvent(
      "element_clicked",
      buildElementClickedEventProperties({
        screenName: "town_map_search_results",
        targetType,
        targetName,
        surface: "search_results",
        path: pathname,
        query: normalizedQuery,
        entrySource,
        destinationPath,
      }),
    );
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] text-[#111827]">
      <div className="mobile-shell relative flex min-h-screen flex-col overflow-hidden bg-white">
        <TownMapKakaoMap
          center={townMapCenter}
          path={pathname}
          pins={resultPins}
          screenName="town_map_search_results"
        />

        <header className="relative z-20 bg-white px-4 pb-3 pt-9 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
          <div className="flex h-12 items-center gap-3">
            <Link
              aria-label="뒤로 가기"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827]"
              href={returnHref}
              onClick={() => {
                trackResultsClick({
                  targetName: "town_map_search_results_back_button",
                  targetType: "button",
                  destinationPath: returnHref,
                });
              }}
            >
              <ArrowLeftIcon />
            </Link>

            <div className="flex min-w-0 flex-1 items-center rounded-[10px] bg-[#f2f3f5] px-4">
              <span className="truncate text-[17px] leading-[50px] text-[#111827]">{normalizedQuery}</span>
            </div>

            <Link
              className="shrink-0 px-1 text-[17px] leading-[50px] text-[#111827]"
              href="/town-map"
              onClick={() => {
                trackResultsClick({
                  targetName: "town_map_search_results_close_button",
                  targetType: "button",
                  destinationPath: "/town-map",
                });
              }}
            >
              닫기
            </Link>
          </div>
        </header>

        <div className="pointer-events-none relative z-10 flex-1" />

        <div className="absolute inset-x-0 bottom-[calc(16.5rem+env(safe-area-inset-bottom))] z-20 px-5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <button className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]" type="button">
                <Home aria-hidden="true" className="h-6 w-6 text-[#111827]" strokeWidth={1.8} />
              </button>
              <button className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]" type="button">
                <Crosshair aria-hidden="true" className="h-6 w-6 text-[#111827]" strokeWidth={1.8} />
              </button>
            </div>

            <button
              className="pointer-events-auto flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[16px] font-medium text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              onClick={() => {
                trackResultsClick({
                  targetName: "town_map_search_results_list_button",
                  targetType: "button",
                });
              }}
              type="button"
            >
              <List aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              목록보기
            </button>
          </div>
        </div>

        <section className="absolute inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 rounded-t-[24px] bg-white px-5 pb-7 pt-3 shadow-[0_-3px_18px_rgba(0,0,0,0.12)]">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-[#d1d5db]" />
          <h1 className="text-[20px] font-bold leading-7 text-[#111827]">{normalizedQuery}</h1>
          <p className="mt-1 text-[14px] leading-5 text-[#8b8c91]">역/정류장/터미널</p>
          <p className="mt-2 line-clamp-2 text-[16px] leading-6 text-[#111827]">
            서울특별시 마포구 양화로 지하45 {normalizedQuery}
          </p>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
