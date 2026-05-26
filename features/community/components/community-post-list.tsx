"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListEmptyState, ListSection } from "@/components/ui/list-section";
import { CommunityPostCard } from "@/features/community/components/community-post-card";
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
  const [visibleCount, setVisibleCount] = useState(COMMUNITY_POST_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < posts.length;
  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);

  useEffect(() => {
    setVisibleCount(COMMUNITY_POST_PAGE_SIZE);
  }, [posts]);

  const loadMore = useCallback(() => {
    setVisibleCount((currentCount) => Math.min(currentCount + COMMUNITY_POST_PAGE_SIZE, posts.length));
  }, [posts.length]);

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
