import { EllipsisVertical, ThumbsUp } from "lucide-react";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type TownMapBusinessDetail } from "@/lib/town-map-business";

type BusinessReview = TownMapBusinessDetail["reviews"][number];

export function TownMapBusinessReviewList({
  backHref,
  reviews,
  showHelpfulAction = false,
}: {
  backHref: string;
  reviews: BusinessReview[];
  showHelpfulAction?: boolean;
}) {
  if (!reviews.length) {
    return <p className="text-[14px] leading-5 text-[#9ca3af]">아직 등록된 후기가 없어요.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <BusinessReviewCard backHref={backHref} key={review.id} review={review} showHelpfulAction={showHelpfulAction} />
      ))}
    </div>
  );
}

function BusinessReviewCard({
  backHref,
  review,
  showHelpfulAction,
}: {
  backHref: string;
  review: BusinessReview;
  showHelpfulAction: boolean;
}) {
  return (
    <article className="border-b border-[#edeef0] pb-5 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e7eb] text-[13px] font-bold text-[#6b7280]">
            {review.authorName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[14px] font-bold leading-5 text-[#111827]">{review.authorName}</p>
              {review.badge ? (
                <span className="rounded-[8px] bg-[rgba(255,138,61,0.1)] px-1 py-0.5 text-[10px] font-bold leading-[15px] text-[#ff8a3d]">
                  {review.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[12px] leading-4 text-[#9ca3af]">{review.authorSummary}</p>
          </div>
        </div>
        <PendingFeatureLink aria-label="후기 더보기" className="px-1 text-[#9ca3af]" featureLabel="후기 메뉴" returnTo={backHref}>
          <EllipsisVertical aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </PendingFeatureLink>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
        <StarRow rating={review.rating} />
        <span>{review.createdAtLabel}</span>
      </div>

      <p className="mt-3 whitespace-pre-line text-[14px] leading-[22px] text-[#1f2937]">{review.content}</p>

      {showHelpfulAction ? (
        <PendingFeatureLink
          className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#edeef0] px-3 py-[7px] text-[12px] font-medium leading-4 text-[#4b5563]"
          featureLabel="후기 도움돼요"
          returnTo={backHref}
        >
          <ThumbsUp aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          도움돼요
        </PendingFeatureLink>
      ) : null}
    </article>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="mr-1 flex items-center gap-0.5 text-[11px] leading-none">
      {Array.from({ length: 5 }).map((_, index) => (
        <span className={index < rating ? "text-[#ff8a3d]" : "text-[#d1d5db]"} key={`star-${index}`}>
          ★
        </span>
      ))}
    </span>
  );
}
