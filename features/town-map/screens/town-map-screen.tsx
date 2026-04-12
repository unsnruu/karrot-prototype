import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { TownMapCategoryChip } from "@/features/town-map/components/town-map-category-chip";
import { TownMapMarker } from "@/features/town-map/components/town-map-marker";
import { TownMapPostCard } from "@/features/town-map/components/town-map-post-card";
import { TownMapQuickActionCard } from "@/features/town-map/components/town-map-quick-action-card";
import {
  townMapPins,
  townMapPosts,
  townMapQuickActions,
  townMapScreenData,
  townMapSearchCategories,
  townMapSearchIcon,
} from "@/lib/town-map";

export function TownMapScreen() {
  return (
    <main className="min-h-screen bg-[#f2f4f7] text-[#111827]">
      <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col overflow-hidden bg-white shadow-none md:max-w-[560px]">
        <section className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <div className="absolute inset-0">
            <AppImage
              alt="동네지도 배경"
              className="object-cover object-center"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              src={townMapScreenData.mapImage}
            />
            <div className="absolute inset-0 bg-white/20" />
          </div>

          <div className="relative z-10 px-4 pt-5">
            <div className="rounded-[8px] bg-gradient-to-b from-[#fdfdfe] to-[#f4f6fa] p-2 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)]">
              <div className="flex h-12 items-center gap-2">
                <span className="relative h-8 w-8 shrink-0">
                  <AppImage alt="" className="object-contain" fill sizes="32px" src={townMapSearchIcon} />
                </span>
                <span className="flex-1 text-[18px] text-[#aeb3bb]">{townMapScreenData.searchPlaceholder}</span>
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                  <AppImage alt="프로필" className="object-cover" fill sizes="36px" src={townMapScreenData.profileImage} />
                </span>
              </div>
            </div>

            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {townMapSearchCategories.map((category) => (
                <TownMapCategoryChip category={category} key={category.id} />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex-1">
            {townMapPins.map((pin) => (
              <TownMapMarker key={pin.id} pin={pin} />
            ))}
          </div>

          <section className="relative z-10 mt-auto max-h-[56vh] rounded-t-[20px] bg-white px-4 pb-0 pt-5 shadow-[0px_-6px_24px_rgba(0,0,0,0.06)]">
            <div className="mx-auto mb-3 h-2 w-[62px] rounded-full bg-[#d9d9d9]" />

            <div className="max-h-[calc(56vh-24px)] overflow-y-auto pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                <button
                  aria-label="광고 자세히 보기"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white"
                  type="button"
                >
                  <span className="relative h-4 w-4">
                    <AppImage alt="" className="object-contain" fill sizes="16px" src={townMapScreenData.ad.arrowIcon} />
                  </span>
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-10">
                {townMapPosts.map((post) => (
                  <TownMapPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
