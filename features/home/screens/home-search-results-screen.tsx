"use client";

import Link from "next/link";
import { Bell, ChevronRight, MessageSquare, Search, ThumbsUp, X } from "lucide-react";
import { useMemo } from "react";
import { AppImage } from "@/components/ui/app-image";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { type CommunityPost } from "@/lib/community";

type HomeSearchResultsScreenProps = {
  activeTab: "all" | "community";
  posts: CommunityPost[];
  query: string;
};

const resultTabs = ["전체", "동네생활", "동네업체", "모임", "업체소식"];

export function HomeSearchResultsScreen({ activeTab, posts, query }: HomeSearchResultsScreenProps) {
  const normalizedQuery = query.trim() || "맛집";
  const isCommunityFocused = activeTab === "community";
  const communityResults = useMemo(() => filterCommunityPosts(posts, normalizedQuery), [posts, normalizedQuery]);
  const maxVisiblePosts = isCommunityFocused ? 12 : normalizedQuery === "맛집" ? 4 : 8;
  const listPosts = communityResults.slice(0, maxVisiblePosts);
  const returnTo = `/home/search/results?query=${encodeURIComponent(normalizedQuery)}${isCommunityFocused ? "&tab=community" : ""}`;
  const canExpandCommunity = !isCommunityFocused && communityResults.length > listPosts.length;
  const communityMoreHref = `/home/search/results?query=${encodeURIComponent(normalizedQuery)}&tab=community`;

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white">
        <header className="sticky top-0 z-20 bg-white">
          <div className="px-4 pb-4 pt-8">
            <div className="flex h-12 items-center gap-3">
              <Link aria-label="뒤로 가기" className="flex h-10 w-10 shrink-0 items-center justify-center text-black" href="/home/search">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>

              <Link className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[12px] bg-[#f2f3f5] px-4" href={`/home/search?query=${encodeURIComponent(normalizedQuery)}`}>
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#9ca3af]" strokeWidth={2} />
                <span className="min-w-0 flex-1 truncate text-[18px] font-medium text-[#111827]">{normalizedQuery}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9ca3af] text-white">
                  <X aria-hidden="true" className="h-2.5 w-2.5" strokeWidth={2.4} />
                </span>
              </Link>

              <Link className="shrink-0 text-[16px] font-medium text-[#111827]" href="/home">
                닫기
              </Link>
            </div>

            <nav className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {resultTabs.map((tab) => (
                <button
                  className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-normal leading-[1.45] tracking-[-0.02em] ${
                    (isCommunityFocused ? tab === "동네생활" : tab === "전체") ? "bg-[#252c33] text-white" : "bg-[#f4f5f6] text-[#111827]"
                  }`}
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="h-3 bg-[#f4f5f7]" />
        </header>

        <section className="bg-white px-5 pb-8 pt-8">
          {isCommunityFocused ? (
            <div className="flex gap-1">
              <button className="rounded-full border border-[#252c33] px-4 py-2 text-[14px] font-normal leading-[1.45] tracking-[-0.02em] text-[#111827]" type="button">
                추천순
              </button>
              <button className="rounded-full border border-[#e5e7eb] px-4 py-2 text-[14px] font-normal leading-[1.45] tracking-[-0.02em] text-[#111827]" type="button">
                최신순
              </button>
            </div>
          ) : (
            <h1 className="text-[24px] font-bold tracking-[-0.03em] text-[#111827]">동네생활</h1>
          )}

          <div className="mt-8">
            {listPosts.map((post) => (
            <CommunitySearchResultRow key={post.id} post={post} returnTo={returnTo} />
            ))}
          </div>

          {canExpandCommunity ? (
            <Link
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#f4f5f7] text-[17px] font-bold tracking-[-0.02em] text-[#111827]"
              href={communityMoreHref}
            >
              동네생활 더보기
              <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
            </Link>
          ) : null}
        </section>

        {isCommunityFocused ? (
          <div className="fixed inset-x-0 bottom-8 z-20 flex justify-center pointer-events-none">
            <button className="pointer-events-auto flex h-12 items-center gap-3 rounded-full bg-[#252c33] px-6 text-[16px] font-bold tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)]" type="button">
              <Bell aria-hidden="true" className="h-5 w-5 fill-current" strokeWidth={0} />
              동네생활 맛집 알림 받기
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function CommunitySearchResultRow({ post, returnTo }: { post: CommunityPost; returnTo: string }) {
  const searchParams = new URL(returnTo, "http://localhost").searchParams;
  const highlightTerm = searchParams.get("query") ?? "";

  return (
    <article className="border-b border-[#edf0f2] py-6">
      <Link className="block" href={`/community/${post.id}?returnTo=${encodeURIComponent(returnTo)}`}>
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-[16px] font-normal leading-[1.32] tracking-[-0.03em] text-[#111827]">
              <HighlightedText text={post.title} term={highlightTerm} />
            </h2>
            <p className="mt-2 line-clamp-2 text-[14px] leading-[1.45] tracking-[-0.02em] text-[#5f6977]">
              <HighlightedText text={post.bodyPreview} term={highlightTerm} />
            </p>
          </div>
          {post.image ? (
            <AppImage alt="" className="h-[96px] w-[96px] shrink-0 rounded-[9px] object-cover" height={96} src={post.image} width={96} />
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-[14px] leading-none text-[#9ca3af]">
          <p className="min-w-0 truncate">
            {post.town} · {post.postedAt} · 조회 {post.views}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            {typeof post.likes === "number" && post.likes > 0 ? (
              <span className="inline-flex items-center gap-1">
                <ThumbsUp aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={0} />
                {post.likes}
              </span>
            ) : null}
            {post.comments > 0 ? (
              <span className="inline-flex items-center gap-1">
                <MessageSquare aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={0} />
                {post.comments}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

function HighlightedText({ term, text }: { term: string; text: string }) {
  if (!term) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span className="font-semibold" key={`${part}-${index}`}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function filterCommunityPosts(posts: CommunityPost[], query: string) {
  const normalizedQuery = query.toLowerCase();

  return posts
    .filter((post) => {
      const searchableText = [post.title, post.summary, post.excerpt, post.bodyPreview].join(" ").toLowerCase();
      return searchableText.includes(normalizedQuery);
    })
    .sort((a, b) => Number(b.image ? 1 : 0) - Number(a.image ? 1 : 0));
}
