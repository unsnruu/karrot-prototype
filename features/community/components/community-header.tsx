"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { CommunityCategoryRail } from "@/features/community/components/community-category-rail";
import { CommunityBannerLink } from "@/features/community/components/community-banner-link";
import { communityFilters, communityTopTabs, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";

export function CommunityHeader({
  selectedTab,
  selectedTopic,
}: {
  selectedTab: CommunityTabKey;
  selectedTopic: CommunityTopicFilterKey;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="w-full px-4 pb-1 pt-5">
        <p className="text-[22px] font-bold tracking-[-0.03em] text-black">커뮤니티</p>

        <div className="mt-5 flex items-center gap-5 text-[20px] font-semibold leading-none">
          {communityTopTabs.map((tab) => (
            <Link
              className={selectedTab === tab.key ? "text-black" : "text-[#858b95]"}
              href={tab.key === "town" ? "/community" : `/community?tab=${tab.key}`}
              key={tab.key}
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "community",
                    targetType: "tab",
                    targetName: "community_top_tab",
                    surface: "header",
                    path: pathname,
                    destinationPath: tab.key === "town" ? "/community" : `/community?tab=${tab.key}`,
                    targetId: tab.key,
                    additionalProperties: {
                      previous_tab: selectedTab,
                    },
                  }),
                );
              }}
              scroll={false}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {selectedTab === "town" ? (
          <div className="mt-4 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {communityFilters.map((filter) => (
              <Link
                className={`flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium ${
                  selectedTopic === filter.id ? "bg-[#2a3038] text-white" : "bg-[#f3f4f5] text-[#1a1c20]"
                }`}
                href={filter.id === "all" ? "/community" : `/community?topic=${filter.id}`}
                key={filter.id}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        ) : null}

        {selectedTab === "meetup" ? (
          <div className="mt-5 space-y-5">
            <CommunityBannerLink />
            <CommunityCategoryRail />
          </div>
        ) : null}

        {selectedTab === "cafe" ? <CommunityCategoryRail className="mt-5" /> : null}
      </div>
      {(selectedTab === "meetup" || selectedTab === "cafe") ? <div className="h-2 bg-[#f3f4f6]" /> : null}
    </header>
  );
}
