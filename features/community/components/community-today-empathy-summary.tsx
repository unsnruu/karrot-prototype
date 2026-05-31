"use client";

import { CircleQuestionMark, EllipsisVertical, ThumbsUp, TrendingUp } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackComponentInteracted } from "@/lib/analytics/component-interaction";
import { trackElementClicked } from "@/lib/analytics/element-click";
import { getCommunityEmpathyRecords, type CommunityEmpathyRecord } from "@/lib/community-empathy";

export function CommunityTodayEmpathySummary() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<CommunityEmpathyRecord[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const latestRecord = records[0];

  useEffect(() => {
    const nextRecords = getCommunityEmpathyRecords();
    const nextLatestRecord = nextRecords[0];

    setRecords(nextRecords);

    if (searchParams.get("empathySheet") === "open" && nextLatestRecord) {
      setIsSheetOpen(true);
      trackComponentInteracted({
        componentName: "community_today_empathy_sheet",
        interactionType: "open",
        screenName: "community",
        surface: "today_empathy_sheet",
        path: pathname,
        entrySource: "callout",
        targetId: nextLatestRecord.id,
      });
    }
  }, [pathname, searchParams]);

  if (!latestRecord) {
    return null;
  }

  function openSheet(entrySource: "summary" | "more") {
    setIsSheetOpen(true);
    trackComponentInteracted({
      componentName: "community_today_empathy_sheet",
      interactionType: "open",
      screenName: "community",
      surface: "today_empathy_sheet",
      path: pathname,
      entrySource: entrySource === "more" ? "more_button" : "summary_card",
      targetId: latestRecord.id,
    });
    trackElementClicked({
      screenName: "community",
      targetType: "button",
      targetName: entrySource === "more" ? "community_today_empathy_more_button" : "community_today_empathy_summary_button",
      surface: "today_empathy_summary",
      path: pathname,
      targetId: latestRecord.id,
    });
  }

  return (
    <>
      <section className="mb-4" aria-label="오늘의 공감 모아보기">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[14px] font-bold leading-[1.5] tracking-[-0.02em] text-black">오늘의 공감 모아보기</h2>
          <button className="text-[13px] font-medium tracking-[-0.02em] text-[#555d6d]" onClick={() => openSheet("more")} type="button">
            더보기
          </button>
        </div>
        <button
          className="flex h-10 w-full items-center gap-3 rounded-[4px] bg-[#f3f4f5] px-3 text-left"
          onClick={() => openSheet("summary")}
          type="button"
        >
          <ReactionIcon className="h-5 w-5 shrink-0 text-[#ff6f0f]" record={latestRecord} />
          <span className="min-w-0 flex-1 truncate text-[16px] tracking-[-0.02em] text-black">
            <strong className="font-medium">{latestRecord.postTitle}</strong>
            {latestRecord.reactionType === "curious" ? "가 궁금해요." : "에 공감했어요."}
          </span>
        </button>
      </section>

      {isSheetOpen ? (
        <div className="fixed inset-0 z-30 bg-black/55" role="presentation">
          <button
            aria-label="오늘의 공감 모아보기 닫기"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => {
              setIsSheetOpen(false);
              trackComponentInteracted({
                componentName: "community_today_empathy_sheet",
                interactionType: "close",
                screenName: "community",
                surface: "today_empathy_sheet",
                path: pathname,
                entrySource: "backdrop",
              });
            }}
            type="button"
          />
          <section
            aria-label="오늘의 공감 모아보기"
            className="mobile-shell-wide absolute inset-x-0 bottom-0 max-h-[calc(100vh-88px)] overflow-y-auto rounded-t-[16px] bg-white px-5 pb-12 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.12)] sm:px-6"
          >
            <div className="mx-auto h-[3px] w-9 rounded-full bg-[#d9d9d9]" />
            <div className="mt-7">
              <h2 className="text-[24px] font-bold leading-[1.5] tracking-[-0.03em] text-black">오늘의 공감 모아보기</h2>
              <p className="mt-1 text-[14px] tracking-[-0.02em] text-[#555d6d]">다른 사람에게는 공개되지 않아요.</p>
            </div>
            <div className="mt-10 space-y-10">
              {records.map((record) => (
                <article className="space-y-3" key={record.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-1">
                      <ReactionIcon
                        className={`h-6 w-6 shrink-0 ${record.reactionType === "curious" ? "text-[#2f7df6]" : "text-[#ff6f0f]"}`}
                        record={record}
                      />
                      <span className="truncate text-[12px] font-medium tracking-[-0.02em] text-[#555d6d]">{record.reactionLabel}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-[12px] font-medium tracking-[-0.02em] text-[#555d6d]">
                      방금
                      <EllipsisVertical aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                  </div>
                  <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-black">
                    <strong className="font-medium">{record.postTitle}</strong>에
                    <br />
                    {record.description}
                  </p>
                  <button
                    className="text-[12px] font-bold tracking-[-0.02em] text-[#ff6600]"
                    onClick={() => {
                      setIsSheetOpen(false);
                      trackElementClicked({
                        screenName: "community",
                        targetType: "button",
                        targetName:
                          record.reactionType === "curious" ? "community_today_empathy_return_button" : "community_today_empathy_comments_button",
                        surface: "today_empathy_sheet",
                        path: pathname,
                        targetId: record.id,
                      });
                    }}
                    type="button"
                  >
                    {record.reactionType === "curious" ? "다시 보러 가기" : "+1 댓글 더보기"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function ReactionIcon({ className, record }: { className: string; record: CommunityEmpathyRecord }) {
  if (record.reactionType === "curious") {
    return <CircleQuestionMark aria-hidden="true" className={className} strokeWidth={1.9} />;
  }

  if (record.reactionType === "like") {
    return <ThumbsUp aria-hidden="true" className={className} strokeWidth={1.9} />;
  }

  return <TrendingUp aria-hidden="true" className={className} strokeWidth={1.9} />;
}
