import Link from "next/link";
import { ArrowLeft, Bell, ChevronRight, EllipsisVertical, Eye, Plus, Share, Smile, ThumbsUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { AppToolbar } from "@/components/ui/app-toolbar";
import { ActionButton } from "@/components/ui/action-button";
import { IconButton } from "@/components/ui/icon-button";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CommunityCommentThread } from "@/features/community/components/community-comment-thread";
import { CommunityRecommendedPostRow } from "@/features/community/components/community-recommended-post-row";
import { trackElementClicked } from "@/lib/analytics/element-click";
import { type CommunityPost, type CommunityPostDetail } from "@/lib/community";

type CommunityPostDetailScreenProps = {
  detail: CommunityPostDetail;
  recommendations: CommunityPost[];
};

export function CommunityPostDetailScreen({
  detail,
  recommendations,
}: CommunityPostDetailScreenProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#0a0a0a]">
      <div className="min-h-screen w-full bg-[#f3f4f6] pb-28">
        <AppToolbar
          className="sticky top-0 z-20 border-b border-black/5 bg-white/95 px-4 pb-2 pt-5 backdrop-blur sm:px-6"
          innerClassName="mobile-shell-wide"
          leading={
            <Link
              aria-label="뒤로 가기"
              className="flex h-8 w-8 items-center justify-center text-black"
              href="/community"
              onClick={() => {
                trackElementClicked({
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_post_detail_back_button",
                  surface: "header",
                  path: pathname,
                  destinationPath: "/community",
                });
              }}
            >
              <ArrowLeft aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
            </Link>
          }
          trailing={
            <>
              <IconButton
                ariaLabel="알림"
                onClick={() => {
                  trackElementClicked({
                    screenName: "community_post_detail",
                    targetType: "button",
                    targetName: "community_post_detail_notification_button",
                    surface: "header",
                    path: pathname,
                  });
                }}
                pendingFeatureLabel="커뮤니티 알림 확인"
                returnTo="/community"
              >
                <Bell aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
              <IconButton
                ariaLabel="공유"
                onClick={() => {
                  trackElementClicked({
                    screenName: "community_post_detail",
                    targetType: "button",
                    targetName: "community_post_detail_share_button",
                    surface: "header",
                    path: pathname,
                  });
                }}
                pendingFeatureLabel="커뮤니티 글 공유하기"
                returnTo="/community"
              >
                <Share aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
              <IconButton
                ariaLabel="더보기"
                onClick={() => {
                  trackElementClicked({
                    screenName: "community_post_detail",
                    targetType: "button",
                    targetName: "community_post_detail_menu_button",
                    surface: "header",
                    path: pathname,
                  });
                }}
                pendingFeatureLabel="커뮤니티 글 메뉴"
                returnTo="/community"
              >
                <EllipsisVertical aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
            </>
          }
        />

        <section className="mobile-shell-wide mt-0 bg-white px-5 pb-8 pt-8 sm:px-6">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-3 py-2 text-[13px] font-medium tracking-[-0.02em] text-[#0a0a0a]">
            <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[#d1d5dc]">
              <CardIcon />
            </span>
            {detail.badgeLabel}
            <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.5} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <UserAvatar alt={detail.author.name} fallback={detail.author.name.slice(0, 1)} size="lg" src={detail.author.avatar} />
            <div>
              <p className="text-sm font-medium tracking-[-0.02em] text-[#0a0a0a]">{detail.author.name}</p>
              <p className="mt-1 text-xs text-[#99a1af]">{detail.author.activityLabel}</p>
            </div>
          </div>

          <h1 className="mt-7 text-[31px] font-semibold tracking-[-0.04em] text-black">{detail.title}</h1>

          <div className="mt-4 space-y-4 text-[16px] leading-[1.55] tracking-[-0.02em] text-[#111111]">
            {detail.bodyParagraphs.map((paragraph, index) => (
              <p key={`${detail.id}-body-${index}`} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {detail.image ? (
            <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl">
              <AppImage alt={detail.title} className="object-cover" fill sizes="(max-width: 640px) 100vw, 640px" src={detail.image} />
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-2 text-sm text-[#99a1af]">
            <Eye aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            {detail.viewSummary}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ActionButton
              className="rounded-full text-sm font-medium"
              leading={<ThumbsUp aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
              onClick={() => {
                trackElementClicked({
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_post_like_button",
                  surface: "content",
                  path: pathname,
                });
              }}
              pendingFeatureLabel="커뮤니티 글 공감하기"
              returnTo="/community"
              size="small"
              variant="neutralOutline"
            >
              공감하기
            </ActionButton>
            <ActionButton
              className="rounded-full text-sm font-medium"
              onClick={() => {
                trackElementClicked({
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_post_save_button",
                  surface: "content",
                  path: pathname,
                });
              }}
              pendingFeatureLabel="커뮤니티 글 저장하기"
              returnTo="/community"
              size="small"
              variant="neutralOutline"
            >
              저장
            </ActionButton>
          </div>
        </section>

        <section className="mobile-shell-wide mt-3 bg-white">
          <div className="flex items-center justify-between border-b border-[#f3f4f6] px-5 py-4">
            <h2 className="text-base font-medium tracking-[-0.02em] text-[#0a0a0a]">댓글 {detail.commentsList.length}</h2>
            <div className="flex items-center gap-2 text-base">
              <PendingFeatureLink
                className="font-medium text-black"
                featureLabel="댓글 정렬 바꾸기"
                returnTo="/community"
                tracking={{
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_comment_sort_register_order",
                  surface: "comments",
                  path: pathname,
                }}
              >
                등록순
              </PendingFeatureLink>
              <span className="text-[#d1d5dc]">|</span>
              <PendingFeatureLink
                className="font-medium text-[#6a7282]"
                featureLabel="댓글 정렬 바꾸기"
                returnTo="/community"
                tracking={{
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_comment_sort_latest_order",
                  surface: "comments",
                  path: pathname,
                }}
              >
                최신순
              </PendingFeatureLink>
            </div>
          </div>

          <div className="divide-y divide-[#f3f4f6]">
            {detail.commentsList.length ? (
              detail.commentsList.map((comment) => (
                <div className="px-5 py-4" key={comment.id}>
                  <CommunityCommentThread comment={comment} />
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-sm text-[#9ca3af]">아직 댓글이 없어요.</div>
            )}
          </div>
        </section>

        <section className="mobile-shell-wide mt-3 bg-white px-5 pb-28 pt-8 sm:px-6">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-black">추천글</h2>
          <div className="mt-4">
            {recommendations.map((post) => (
              <CommunityRecommendedPostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/95 backdrop-blur">
        <div className="mobile-shell-wide flex items-center gap-3 px-2 py-2 pb-10 sm:px-4">
          <IconButton
            ariaLabel="댓글 추가"
            className="text-[#6b7280]"
            onClick={() => {
              trackElementClicked({
                screenName: "community_post_detail",
                targetType: "button",
                targetName: "community_comment_add_button",
                surface: "comment_input",
                path: pathname,
              });
            }}
            pendingFeatureLabel="댓글 작성하기"
            returnTo="/community"
          >
            <Plus aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
          </IconButton>
          <div className="flex h-10 flex-1 items-center justify-between rounded-full bg-[#f2f4f5] px-4 text-base text-[#aeb2b5]">
            <span>댓글을 입력해주세요.</span>
            <Smile aria-hidden="true" className="h-6 w-6 text-[#9ca3af]" strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </main>
  );
}

function CardIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
      <rect fill="currentColor" height="8" rx="1.2" width="8" x="2" y="2" />
      <path d="M4 4.5h4M4 6.5h2.5" stroke="#d1d5dc" strokeLinecap="round" strokeWidth=".8" />
    </svg>
  );
}
