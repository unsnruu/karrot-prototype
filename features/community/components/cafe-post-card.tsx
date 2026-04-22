import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type CafePost } from "@/lib/community";

export function CafePostCard({ post }: { post: CafePost }) {
  return (
    <article className="border-b border-[#f3f4f6] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-black text-[20px]">
            {post.emoji}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold leading-5 tracking-[-0.015em] text-[#0a0a0a]">{post.cafeName}</p>
            <p className="mt-0.5 text-[12px] leading-4 text-[#6a7282]">{post.cafeMeta}</p>
          </div>
        </div>
        <PendingFeatureLink
          className="h-[34px] shrink-0 rounded-[4px] border border-[#d1d5dc] px-4 text-[14px] font-medium text-[#0a0a0a]"
          featureLabel="카페 가입하기"
          returnTo="/community?tab=cafe"
          tracking={{
            screenName: "community",
            targetType: "button",
            targetName: "community_cafe_join_button",
            surface: "cafe_list",
            path: "/community",
            targetId: post.cafeName,
          }}
        >
          가입
        </PendingFeatureLink>
      </div>

      <PendingFeatureLink
        className="mt-4 block"
        featureLabel="카페 글 상세 보기"
        returnTo="/community?tab=cafe"
        tracking={{
          screenName: "community",
          targetType: "card",
          targetName: "community_cafe_post_card",
          surface: "cafe_list",
          path: "/community",
          targetId: post.cafeName,
        }}
      >
        <h2 className="text-[16px] font-semibold leading-6 tracking-[-0.02em] text-[#0a0a0a]">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-[14px] leading-[1.5] tracking-[-0.015em] text-[#364153]">{post.excerpt}</p>
        {post.previewComment ? <p className="mt-1 text-[14px] leading-5 tracking-[-0.015em] text-[#364153]">...더보기</p> : null}

        {post.previewComment ? (
          <div className="mt-4 flex items-center gap-2 rounded-full bg-[#f9fafb] px-4 py-3 text-[14px] leading-5 tracking-[-0.015em] text-[#4a5565]">
            <span className="h-6 w-6 shrink-0 rounded-full bg-[#d1d5dc]" />
            <span className="truncate">{post.previewComment}</span>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[14px] text-[#4a5565]">
            <span className="flex items-center gap-1.5">
              <ThumbUpIcon />
              {post.likes}
            </span>
            <span className="flex items-center gap-1.5">
              <CommentIcon />
              {post.comments}
            </span>
            <span className="flex items-center gap-1.5">
              <ShareIcon />
            </span>
          </div>
          <span className="text-[14px] leading-5 tracking-[-0.015em] text-[#6a7282]">조회 {post.views}</span>
        </div>
      </PendingFeatureLink>
    </article>
  );
}

function ThumbUpIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-[#6a7282]" fill="none" viewBox="0 0 20 20">
      <path
        d="M8.412 3.122a.938.938 0 0 1 1.13 1.179l-.772 2.996h6.275c1.062 0 1.736 1.127 1.235 2.053l-3.15 5.786a2.188 2.188 0 0 1-1.924 1.139H5.5a1.875 1.875 0 0 1-1.875-1.875V10.66c0-.364.1-.722.3-1.037l3.325-5.65a2.188 2.188 0 0 1 1.162-.851Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="M2.5 9.375h1.125v6.875H2.5a.625.625 0 0 1-.625-.625V10a.625.625 0 0 1 .625-.625Z" fill="currentColor" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-[#6a7282]" fill="none" viewBox="0 0 20 20">
      <path
        d="M4.167 4.792h11.666c.92 0 1.667.746 1.667 1.666v7.084c0 .92-.746 1.666-1.667 1.666H9.74l-3.907 2.5.887-2.5h-2.553A1.667 1.667 0 0 1 2.5 13.542V6.458c0-.92.746-1.666 1.667-1.666Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-[#6a7282]" fill="none" viewBox="0 0 20 20">
      <path
        d="M14.792 13.958a2.084 2.084 0 1 0 0 4.167 2.084 2.084 0 0 0 0-4.167ZM5.208 7.917a2.084 2.084 0 1 0 0 4.166 2.084 2.084 0 0 0 0-4.166ZM14.792 1.875a2.084 2.084 0 1 0 0 4.167 2.084 2.084 0 0 0 0-4.167Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="m6.967 9.11 6.066-3.378M6.967 10.89l6.066 3.378" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}
