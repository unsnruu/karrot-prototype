import { AppImage } from "@/components/ui/app-image";
import { communityFilters, communityTopTabs } from "@/lib/community";

const iconChevronDown = "/icons/chevron-down.svg";

export function CommunityHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-5 sm:px-6 lg:px-8">
        <p className="text-[22px] font-bold tracking-[-0.03em] text-black">커뮤니티</p>

        <div className="mt-5 flex items-center gap-5 text-[20px] font-semibold leading-none">
          {communityTopTabs.map((tab, index) => (
            <button className={index === 0 ? "text-black" : "text-[#858b95]"} key={tab} type="button">
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {communityFilters.map((filter) => (
            <button
              className={`flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium ${
                filter.active ? "bg-[#2a3038] text-white" : "bg-[#f3f4f5] text-[#1a1c20]"
              }`}
              key={filter.label}
              type="button"
            >
              {filter.label}
              {filter.hasChevron ? (
                <AppImage alt="" className="ml-1 h-4 w-4" height={16} src={iconChevronDown} width={16} />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
