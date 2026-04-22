import { EllipsisVertical, Reply, ThumbsUp } from "lucide-react";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { UserAvatar } from "@/components/ui/user-avatar";
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
      <UserAvatar
        alt={comment.authorName}
        className={isReply ? "h-8 w-8" : "h-10 w-10"}
        fallback={comment.authorName.slice(0, 1)}
        size={isReply ? "sm" : "md"}
        src={comment.authorAvatar}
      />

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
            <EllipsisVertical aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </PendingFeatureLink>
        </div>

        <p className="mt-1 text-xs text-[#9ca3af]">{comment.metaLabel}</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-5 tracking-[-0.015em] text-[#0a0a0a]">{comment.body}</p>

        <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[#6b7280]">
          <PendingFeatureLink className="inline-flex items-center gap-1" featureLabel="댓글 좋아요" returnTo="/community">
            <ThumbsUp aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
            좋아요
          </PendingFeatureLink>
          <PendingFeatureLink className="inline-flex items-center gap-1" featureLabel="답글 작성하기" returnTo="/community">
            <Reply aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
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
