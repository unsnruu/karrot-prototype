"use client";

import { usePathname } from "next/navigation";
import { SelectionChipLink } from "@/components/ui/selection-chip";
import { TabsList, TextTabLink } from "@/components/ui/tabs";
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

        <TabsList className="mt-5 flex items-center gap-5 text-[20px] font-semibold leading-none">
          {communityTopTabs.map((tab) => (
            <TextTabLink
              active={selectedTab === tab.key}
              className="text-[20px] font-semibold leading-none"
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
            >
              {tab.label}
            </TextTabLink>
          ))}
        </TabsList>

        {selectedTab === "town" ? (
          <div className="mt-4 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {communityFilters.map((filter) => (
              <SelectionChipLink
                active={selectedTopic === filter.id}
                href={filter.id === "all" ? "/community" : `/community?topic=${filter.id}`}
                key={filter.id}
              >
                {filter.label}
              </SelectionChipLink>
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
