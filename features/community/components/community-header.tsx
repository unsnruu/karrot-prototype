"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SelectionChipButton, SelectionChipLink } from "@/components/ui/selection-chip";
import { TabsList, TextTabLink } from "@/components/ui/tabs";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { CommunityCategoryRail } from "@/features/community/components/community-category-rail";
import { CommunityBannerLink } from "@/features/community/components/community-banner-link";
import { communityFeedFilters, communityFilters, communityTopTabs, type CommunityFeedFilterKey, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";

export function CommunityHeader({
  selectedTab,
  selectedFeed,
  selectedTopic,
}: {
  selectedTab: CommunityTabKey;
  selectedFeed: CommunityFeedFilterKey;
  selectedTopic: CommunityTopicFilterKey;
}) {
  const pathname = usePathname();
  const [isFeedMenuOpen, setIsFeedMenuOpen] = useState(false);
  const selectedFeedLabel = communityFeedFilters.find((filter) => filter.id === selectedFeed)?.label ?? "추천";
  const topicFilters = communityFilters.filter((filter) => filter.id !== "all");

  function getFeedHref(feed: CommunityFeedFilterKey) {
    const params = new URLSearchParams();

    if (feed !== "recommended") {
      params.set("feed", feed);
    }

    if (selectedTopic !== "all") {
      params.set("topic", selectedTopic);
    }

    const query = params.toString();
    return query ? `/community?${query}` : "/community";
  }

  function getTopicHref(topicId: CommunityTopicFilterKey) {
    const params = new URLSearchParams();

    if (selectedFeed !== "recommended") {
      params.set("feed", selectedFeed);
    }

    if (topicId !== "all") {
      params.set("topic", topicId);
    }

    const query = params.toString();
    return query ? `/community?${query}` : "/community";
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
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
                  }),
                );
              }}
            >
              {tab.label}
            </TextTabLink>
          ))}
        </TabsList>

        {selectedTab === "town" ? (
          <div className="relative mt-4 flex gap-2 py-1">
            <div className="shrink-0">
              <SelectionChipButton
                active
                aria-expanded={isFeedMenuOpen}
                aria-haspopup="menu"
                className="gap-1.5"
                onClick={() => {
                  const nextOpen = !isFeedMenuOpen;

                  setIsFeedMenuOpen(nextOpen);
                  trackEvent(
                    "element_clicked",
                    buildElementClickedEventProperties({
                      screenName: "community",
                      targetType: "chip",
                      targetName: "community_feed_filter_menu",
                      surface: "header",
                      path: pathname,
                      targetId: selectedFeed,
                    }),
                  );
                }}
              >
                {selectedFeedLabel}
                {isFeedMenuOpen ? (
                  <ChevronUp aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                )}
              </SelectionChipButton>
            </div>

            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {topicFilters.map((filter) => (
                <SelectionChipLink
                  active={selectedTopic === filter.id}
                  href={getTopicHref(filter.id)}
                  key={filter.id}
                  onClick={() => {
                    trackEvent(
                      "element_clicked",
                      buildElementClickedEventProperties({
                        screenName: "community",
                        targetType: "chip",
                        targetName: "community_topic_filter",
                        surface: "header",
                        path: pathname,
                        destinationPath: getTopicHref(filter.id),
                        targetId: filter.id,
                      }),
                    );
                  }}
                >
                  {filter.label}
                </SelectionChipLink>
              ))}
            </div>

            {isFeedMenuOpen ? (
              <div className="absolute left-0 top-[calc(100%+8px)] z-[80] w-[156px] overflow-hidden rounded-[18px] border border-[#eceef1] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.14)]" role="menu">
                {communityFeedFilters.map((filter) => (
                  <Link
                    className={`block px-5 py-4 text-[16px] font-semibold leading-none ${
                      selectedFeed === filter.id ? "bg-[#f3f4f5] text-[#1a1c20]" : "text-[#1a1c20]"
                    }`}
                    href={getFeedHref(filter.id)}
                    key={filter.id}
                    onClick={() => {
                      setIsFeedMenuOpen(false);
                      trackEvent(
                        "element_clicked",
                        buildElementClickedEventProperties({
                          screenName: "community",
                          targetType: "menu_item",
                          targetName: "community_feed_filter",
                          surface: "header",
                          path: pathname,
                          destinationPath: getFeedHref(filter.id),
                          targetId: filter.id,
                        }),
                      );
                    }}
                    role="menuitem"
                  >
                    {filter.label}순
                  </Link>
                ))}
              </div>
            ) : null}
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
