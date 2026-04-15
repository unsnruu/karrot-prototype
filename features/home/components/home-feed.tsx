"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { HomeNativeAdCard } from "@/features/home/components/home-native-ad-card";
import { MarketplaceListItem } from "@/features/home/components/marketplace-list-item";
import { buildPublishedSellFeedItem, readPublishedSellItem } from "@/lib/local-sell-storage";
import { HOME_FEED_PAGE_SIZE, type HomeFeedEntry } from "@/lib/marketplace";

type HomeFeedResponse = {
  items: HomeFeedEntry[];
  hasMore: boolean;
  nextOffset: number;
};

export function HomeFeed({
  initialItems,
  initialHasMore,
  initialNextOffset,
  category,
}: {
  initialItems: HomeFeedEntry[];
  initialHasMore: boolean;
  initialNextOffset: number;
  category?: string;
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

  return (
    <div>
      {items.map((entry) => (
        entry.type === "native-ad"
          ? <HomeNativeAdCard ad={entry} key={entry.id} />
          : <MarketplaceListItem item={entry} key={entry.id} />
      ))}

      {items.length === 0 && !isLoading ? (
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
