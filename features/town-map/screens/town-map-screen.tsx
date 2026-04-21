"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { TownMapBottomSheet } from "@/features/town-map/components/town-map-bottom-sheet";
import { TownMapCategoryChip } from "@/features/town-map/components/town-map-category-chip";
import { TownMapKakaoMap } from "@/features/town-map/components/town-map-kakao-map";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import {
  townMapCenter,
  townMapScreenData,
  townMapSearchCategories,
  townMapSearchIcon,
  type TownMapPin,
} from "@/lib/town-map";

export function TownMapScreen({
  pins,
}: {
  pins: TownMapPin[];
}) {
  const pathname = usePathname();
  const searchHref = appendNavigationQuery("/town-map/search", { returnTo: "/town-map", tab: "town-map" });

  return (
    <main className="min-h-screen bg-[#f2f4f7] text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col overflow-hidden bg-white shadow-none">
        <section className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <TownMapKakaoMap center={townMapCenter} pins={pins} />

          <div className="relative z-10 px-4 pt-5">
            <Link
              aria-label="업체 검색 화면 열기"
              className="block rounded-[8px] bg-gradient-to-b from-[#fdfdfe] to-[#f4f6fa] p-2 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)]"
              href={searchHref}
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "town_map",
                    targetType: "input",
                    targetName: "town_map_search_input",
                    surface: "header",
                    path: pathname,
                    destinationPath: searchHref,
                  }),
                );
              }}
            >
              <div className="flex h-12 items-center gap-2">
                <span className="relative h-8 w-8 shrink-0">
                  <AppImage alt="" className="object-contain" fill sizes="32px" src={townMapSearchIcon} />
                </span>
                <span className="flex-1 text-[18px] text-[#aeb3bb]">{townMapScreenData.searchPlaceholder}</span>
                <PendingFeatureLink className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full" featureLabel="동네지도 프로필 보기" returnTo="/town-map">
                  <AppImage alt="프로필" className="object-cover" fill sizes="36px" src={townMapScreenData.profileImage} />
                </PendingFeatureLink>
              </div>
            </Link>

            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {townMapSearchCategories.map((category) => (
                <TownMapCategoryChip category={category} key={category.id} />
              ))}
            </div>
          </div>
          <div className="pointer-events-none relative z-10 flex-1" />

          <TownMapBottomSheet />
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
