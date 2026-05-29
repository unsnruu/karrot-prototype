"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListEmptyState, ListSection } from "@/components/ui/list-section";
import { CommunityPostCard } from "@/features/community/components/community-post-card";
import { trackEvent } from "@/lib/analytics/amplitude";
import { type VisitorExperimentVariant } from "@/lib/analytics/experiment-assignment";
import { type CommunityPost } from "@/lib/community";

const COMMUNITY_POST_PAGE_SIZE = 80;

type CommunityPostListProps = {
  posts: CommunityPost[];
  experimentVariant: VisitorExperimentVariant;
  emptyMessage?: string;
};

export function CommunityPostList({
  posts,
  experimentVariant,
  emptyMessage = "게시글이 아직 없어요.",
}: CommunityPostListProps) {
  const pathname = usePathname();
  const [visibleCount, setVisibleCount] = useState(COMMUNITY_POST_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const trackedLoadedCountsRef = useRef<Set<number>>(new Set());
  const hasMore = visibleCount < posts.length;
  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);

  useEffect(() => {
    setVisibleCount(COMMUNITY_POST_PAGE_SIZE);
    trackedLoadedCountsRef.current = new Set();
  }, [posts]);

  const loadMore = useCallback(() => {
    setVisibleCount((currentCount) => {
      const nextVisibleCount = Math.min(currentCount + COMMUNITY_POST_PAGE_SIZE, posts.length);

      if (nextVisibleCount > currentCount && !trackedLoadedCountsRef.current.has(nextVisibleCount)) {
        trackedLoadedCountsRef.current.add(nextVisibleCount);
        trackEvent("community_posts_loaded", {
          screen_name: "community",
          surface: "post_list",
          path: pathname,
          previous_loaded_count: currentCount,
          loaded_count: nextVisibleCount,
          page_size: COMMUNITY_POST_PAGE_SIZE,
          load_index: Math.ceil(nextVisibleCount / COMMUNITY_POST_PAGE_SIZE),
          total_count: posts.length,
          has_more: nextVisibleCount < posts.length,
        });
      }

      return nextVisibleCount;
    });
  }, [pathname, posts.length]);

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
          loadMore();
        }
      },
      { rootMargin: "480px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (posts.length === 0) {
    return (
      <ListEmptyState>
        <p className="text-sm text-[#64748b]">{emptyMessage}</p>
      </ListEmptyState>
    );
  }

  return (
    <ListSection itemsClassName="border-t border-[#eceef2]">
      {visiblePosts.map((post) => (
        <CommunityPostCard experimentVariant={experimentVariant} key={post.id} post={post} />
      ))}
      {hasMore ? <div aria-hidden="true" className="h-12" ref={sentinelRef} /> : null}
    </ListSection>
  );
}
