import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { cn } from "@/lib/utils";
import { type CommunityComment } from "@/lib/community";

export function CommunityCommentThread({
  comment,
  isReply = false,
}: {
  comment: CommunityComment;
  isReply?: boolean;
}) {
  return (
    <div className={cn("flex gap-3", isReply ? "pl-4" : "")}>
      <div className={cn("relative overflow-hidden rounded-full bg-[#e5e7eb]", isReply ? "h-8 w-8" : "h-10 w-10")}>
        {comment.authorAvatar ? (
          <AppImage
            alt={comment.authorName}
            className="object-cover"
            fill
            sizes={isReply ? "32px" : "40px"}
            src={comment.authorAvatar}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium tracking-[-0.02em] text-[#0a0a0a]">{comment.authorName}</span>
            {comment.badgeLabel ? (
              <span className="shrink-0 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
                {comment.badgeLabel}
              </span>
            ) : null}
          </div>
          <PendingFeatureLink aria-label="댓글 더보기" className="text-[#9ca3af]" featureLabel="댓글 메뉴" returnTo="/community">
            <KebabIcon />
          </PendingFeatureLink>
        </div>

        <p className="mt-1 text-xs text-[#9ca3af]">{comment.metaLabel}</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-5 tracking-[-0.015em] text-[#0a0a0a]">{comment.body}</p>

        <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[#6b7280]">
          <PendingFeatureLink className="inline-flex items-center gap-1" featureLabel="댓글 좋아요" returnTo="/community">
            <ThumbIcon />
            좋아요
          </PendingFeatureLink>
          <PendingFeatureLink className="inline-flex items-center gap-1" featureLabel="답글 작성하기" returnTo="/community">
            <ReplyIcon />
            {comment.replyCount ? `답글 ${comment.replyCount}` : "답글쓰기"}
          </PendingFeatureLink>
        </div>

        {comment.replies?.length ? (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommunityCommentThread comment={reply} isReply key={reply.id} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function KebabIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="4" r="1.4" />
      <circle cx="10" cy="10" r="1.4" />
      <circle cx="10" cy="16" r="1.4" />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M6.73 1.16a.75.75 0 0 1 .9.94l-.62 2.41h5.02c.95 0 1.55 1.01 1.1 1.84l-2.52 4.63a1.75 1.75 0 0 1-1.54.91H4.5a1.5 1.5 0 0 1-1.5-1.5V7.4c0-.29.08-.58.24-.83L5.9 2.13a1.75 1.75 0 0 1 .83-.73ZM2 7h-.25A.75.75 0 0 0 1 7.75v3.5c0 .41.34.75.75.75H2V7Z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M6.25 5 3.5 7.75 6.25 10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M4 7.75h5a3.5 3.5 0 0 1 3.5 3.5v.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
