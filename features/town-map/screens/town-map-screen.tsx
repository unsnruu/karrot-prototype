import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { TownMapBottomSheet } from "@/features/town-map/components/town-map-bottom-sheet";
import { TownMapCategoryChip } from "@/features/town-map/components/town-map-category-chip";
import { TownMapKakaoMap } from "@/features/town-map/components/town-map-kakao-map";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import {
  townMapCenter,
  townMapScreenData,
  townMapSearchCategories,
  townMapSearchIcon,
  type TownMapPin,
} from "@/lib/town-map";

export function TownMapScreen({ pins }: { pins: TownMapPin[] }) {
  return (
    <main className="min-h-screen bg-[#f2f4f7] text-[#111827]">
      <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col overflow-hidden bg-white shadow-none md:max-w-[560px]">
        <section className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <TownMapKakaoMap center={townMapCenter} pins={pins} />

          <div className="relative z-10 px-4 pt-5">
            <Link
              aria-label="업체 검색 화면 열기"
              className="block rounded-[8px] bg-gradient-to-b from-[#fdfdfe] to-[#f4f6fa] p-2 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)]"
              href={appendNavigationQuery("/town-map/search", { returnTo: "/town-map", tab: "town-map" })}
            >
              <div className="flex h-12 items-center gap-2">
                <span className="relative h-8 w-8 shrink-0">
                  <AppImage alt="" className="object-contain" fill sizes="32px" src={townMapSearchIcon} />
                </span>
                <span className="flex-1 text-[18px] text-[#aeb3bb]">{townMapScreenData.searchPlaceholder}</span>
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                  <AppImage alt="프로필" className="object-cover" fill sizes="36px" src={townMapScreenData.profileImage} />
                </span>
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
