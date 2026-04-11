import { type CafePost } from "@/lib/community";

export function CafePostCard({ post }: { post: CafePost }) {
  return (
    <article className="rounded-[24px] border border-[#eceef2] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-black">
            <span className="mr-1">{post.emoji}</span>
            {post.cafeName}
          </p>
          <p className="mt-1 text-xs text-[#868b94]">{post.cafeMeta}</p>
        </div>
      </div>

      <h2 className="mt-4 text-[18px] font-semibold leading-[1.35] tracking-[-0.03em] text-black">{post.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-[1.6] text-[#556070]">{post.excerpt}</p>

      {post.previewComment ? (
        <div className="mt-4 rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm text-[#556070]">{post.previewComment}</div>
      ) : null}

      <div className="mt-4 flex items-center gap-4 text-sm text-[#868b94]">
        <span>공감 {post.likes}</span>
        <span>댓글 {post.comments}</span>
        <span>조회 {post.views}</span>
      </div>
    </article>
  );
}
