"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { HomeNativeAdBanner } from "@/features/home/components/home-native-ad-banner";
import { HomeNativeAdCard } from "@/features/home/components/home-native-ad-card";
import { HomeNativeAdCarousel } from "@/features/home/components/home-native-ad-carousel";
import { HomeNativeAdHeroCarousel } from "@/features/home/components/home-native-ad-hero-carousel";
import { HomeNativeAdHighlightCard } from "@/features/home/components/home-native-ad-highlight-card";
import { MarketplaceListItem } from "@/features/home/components/marketplace-list-item";
import { buildPublishedSellFeedItem, readPublishedSellItem } from "@/lib/local-sell-storage";
import { type HomeExperimentVariant } from "@/lib/home-experiment";
import { HOME_FEED_PAGE_SIZE, type HomeFeedEntry, type HomeFeedNativeAd } from "@/lib/marketplace";

type HomeFeedResponse = {
  items: HomeFeedEntry[];
  hasMore: boolean;
  nextOffset: number;
};

type DFeedSection = {
  entries: HomeFeedEntry[];
  heroAds: HomeFeedNativeAd[];
};

export function HomeFeed({
  initialItems,
  initialHasMore,
  initialNextOffset,
  category,
  variant,
}: {
  initialItems: HomeFeedEntry[];
  initialHasMore: boolean;
  initialNextOffset: number;
  category?: string;
  variant: HomeExperimentVariant;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextOffsetRef = useRef(initialNextOffset);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(initialHasMore);

  useEffect(() => {
    if (category && category !== "전체") {
      return;
    }

    const publishedItem = readPublishedSellItem();
    if (!publishedItem) {
      return;
    }

    const feedItem = buildPublishedSellFeedItem(publishedItem);
    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.id !== feedItem.id);
      return [feedItem, ...nextItems];
    });
  }, [category]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/home-items?offset=${nextOffsetRef.current}&limit=${HOME_FEED_PAGE_SIZE}${category ? `&category=${encodeURIComponent(category)}` : ""}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        throw new Error(`Failed to load home items: ${response.status}${responseBody ? ` ${responseBody}` : ""}`);
      }

      const data = (await response.json()) as HomeFeedResponse;

      startTransition(() => {
        setItems((currentItems) => [...currentItems, ...data.items]);
        setHasMore(data.hasMore);
      });

      nextOffsetRef.current = data.nextOffset;
    } catch (loadError) {
      console.error("[home-feed] loadMore failed", {
        category,
        error: loadError,
        offset: nextOffsetRef.current,
      });
      setError("상품을 더 불러오지 못했어요.");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  const allAds = items.filter((entry): entry is HomeFeedNativeAd => entry.type === "native-ad");
  const carouselAds = variant === "c"
    ? allAds
    : [];
  const feedItems = variant === "c"
    ? items.filter((entry) => entry.type !== "native-ad")
    : items;
  const dSections = variant === "d"
    ? buildDFeedSections(items)
    : [];

  return (
    <div>
      {variant === "c" ? <HomeNativeAdCarousel ads={carouselAds} variant={variant} /> : null}
      {variant === "d"
        ? dSections.map((section, sectionIndex) => (
          <div key={`d-section-${sectionIndex}`}>
            {section.heroAds.length > 0 ? <HomeNativeAdHeroCarousel ads={section.heroAds} variant={variant} /> : null}
            {section.entries.map((entry, index) => (
              entry.type === "native-ad"
                ? <HomeNativeAdHighlightCard ad={entry} index={index} key={entry.id} variant={variant} />
                : <MarketplaceListItem category={category} item={entry} key={entry.id} position={index} />
            ))}
          </div>
        ))
        : feedItems.map((entry, index) => (
          entry.type === "native-ad"
            ? (
              variant === "b"
                ? <HomeNativeAdBanner ad={entry} index={index} key={entry.id} variant={variant} />
                : <HomeNativeAdCard ad={entry} index={index} key={entry.id} variant={variant} />
            )
            : <MarketplaceListItem category={category} item={entry} key={entry.id} position={index} />
        ))}

      {feedItems.length === 0 && !isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center px-4 py-12 text-center">
          <p className="text-sm text-[#64748b]">선택한 카테고리에 등록된 상품이 아직 없어요.</p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 flex flex-col items-center gap-3 pb-6 text-center">
          <p className="text-sm text-[#64748b]">{error}</p>
          <button
            className="rounded-full border border-[#dbe1ea] px-4 py-2 text-sm font-medium text-[#111827]"
            onClick={() => {
              void loadMore();
            }}
            type="button"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {hasMore ? <div aria-hidden="true" className="h-8" ref={sentinelRef} /> : null}

      {isLoading ? (
        <p className="py-4 text-center text-sm text-[#94a3b8]">상품 불러오는 중...</p>
      ) : null}

      {hasMore && !isLoading ? (
        <div className="flex justify-center py-4">
          <button
            className="rounded-full border border-[#dbe1ea] bg-white px-5 py-2.5 text-sm font-medium text-[#111827] shadow-sm"
            onClick={() => {
              void loadMore();
            }}
            type="button"
          >
            상품 더 보기
          </button>
        </div>
      ) : null}
    </div>
  );
}

function buildDFeedSections(items: HomeFeedEntry[]) {
  const sections: DFeedSection[] = [];
  let currentEntries: HomeFeedEntry[] = [];
  let currentHeroAds: HomeFeedNativeAd[] = [];
  let marketplaceCount = 0;

  items.forEach((entry) => {
    if (entry.type === "marketplace-item" && marketplaceCount === HOME_FEED_PAGE_SIZE) {
      sections.push({ entries: currentEntries, heroAds: currentHeroAds });
      currentEntries = [];
      currentHeroAds = [];
      marketplaceCount = 0;
    }

    if (entry.type === "native-ad") {
      currentHeroAds.push(entry);
      return;
    }

    currentEntries.push(entry);
    marketplaceCount += 1;
  });

  if (currentEntries.length > 0 || currentHeroAds.length > 0) {
    sections.push({ entries: currentEntries, heroAds: currentHeroAds });
  }

  return sections;
}
