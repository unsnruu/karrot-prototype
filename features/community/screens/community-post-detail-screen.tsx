"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Check, ChevronRight, EllipsisVertical, Eye, ImageIcon, MapPin, Pencil, Plus, Send, Share, Smile, ThumbsUp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { AppImage } from "@/components/ui/app-image";
import { AppToolbar } from "@/components/ui/app-toolbar";
import { ActionButton } from "@/components/ui/action-button";
import { IconButton } from "@/components/ui/icon-button";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CommunityCommentThread } from "@/features/community/components/community-comment-thread";
import { CommunityRecommendedPostRow } from "@/features/community/components/community-recommended-post-row";
import { trackElementClicked } from "@/lib/analytics/element-click";
import { type CommunityComment, type CommunityPost, type CommunityPostDetail } from "@/lib/community";

type CommunityPostDetailScreenProps = {
  detail: CommunityPostDetail;
  recommendations: CommunityPost[];
};

const PRESET_COMMENT_BODY = "잘 보고 가요";

export function CommunityPostDetailScreen({
  detail,
  recommendations,
}: CommunityPostDetailScreenProps) {
  const pathname = usePathname();
  const [comments, setComments] = useState(detail.commentsList);
  const [commentDraft, setCommentDraft] = useState("");
  const [isCommentInputFocused, setIsCommentInputFocused] = useState(false);
  const [hasLikedPost, setHasLikedPost] = useState(false);
  const [selectedAlertTags, setSelectedAlertTags] = useState<string[]>([]);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const hasComments = comments.length > 0;
  const alertTags = buildSimilarPostAlertTags(detail);
  const canSubmitComment = commentDraft.trim().length > 0;
  const shouldShowSubmitButton = isCommentInputFocused || canSubmitComment;
  const likeCount = (detail.likes ?? 0) + (hasLikedPost ? 1 : 0);
  const shouldShowLikeCount = hasLikedPost || likeCount > 0;

  function addComment() {
    const body = (commentInputRef.current?.value ?? commentDraft).trim();
    if (!body) {
      return;
    }

    const nextComment: CommunityComment = {
      id: `local-comment-${Date.now()}`,
      authorName: "나",
      metaLabel: "방금",
      body,
    };

    setComments((currentComments) => [...currentComments, nextComment]);
    setCommentDraft("");
    setIsCommentInputFocused(false);
    commentInputRef.current?.blur();

    trackElementClicked({
      screenName: "community_post_detail",
      targetType: "button",
      targetName: "community_comment_submit_button",
      surface: "comment_input",
      path: pathname,
    });
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addComment();
  }

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
          <PendingFeatureLink
            className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-3 py-2 text-[13px] font-medium tracking-[-0.02em] text-[#0a0a0a]"
            featureLabel={`${detail.badgeLabel} 게시판 보기`}
            returnTo={pathname}
            tracking={{
              screenName: "community_post_detail",
              targetType: "button",
              targetName: "community_post_badge_button",
              surface: "content",
              path: pathname,
              targetId: detail.badgeLabel,
            }}
          >
            <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[#d1d5dc]">
              <CardIcon />
            </span>
            {detail.badgeLabel}
            <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.5} />
          </PendingFeatureLink>

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
            <button
              aria-pressed={hasLikedPost}
              className={`inline-flex h-11 min-w-[78px] items-center justify-center gap-2.5 rounded-full border px-4 text-[17px] font-medium tracking-[-0.02em] transition-colors ${
                hasLikedPost ? "border-[#ff6f0f] text-[#ff6f0f]" : "border-[#e5e7eb] text-[#6b7280]"
              }`}
              onClick={() => {
                setHasLikedPost((current) => !current);
                trackElementClicked({
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_post_like_button",
                  surface: "content",
                  path: pathname,
                });
              }}
              type="button"
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                  hasLikedPost ? "bg-[#ff9b6a] text-white" : "bg-transparent text-[#6b7280]"
                }`}
              >
                <ThumbsUp aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={2} />
              </span>
              {shouldShowLikeCount ? <span>{likeCount}</span> : <span className="text-[14px]">공감하기</span>}
            </button>
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
          <div className={`flex items-center justify-between px-5 py-4 ${hasComments ? "border-b border-[#f3f4f6]" : ""}`}>
            <h2 className="text-base font-medium tracking-[-0.02em] text-[#0a0a0a]">댓글 {comments.length}</h2>
            {hasComments ? (
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
            ) : null}
          </div>

          <div className="divide-y divide-[#f3f4f6]">
            {hasComments ? (
              comments.map((comment) => (
                <div className="px-5 py-4" key={comment.id}>
                  <CommunityCommentThread comment={comment} />
                </div>
              ))
            ) : (
              <div className="px-5 pb-20 pt-14 text-center">
                <p className="text-[16px] leading-none tracking-[-0.02em] text-[#9ca3af]">첫 댓글을 남겨보세요.</p>
                <button
                  className="mt-8 inline-flex h-12 items-center justify-center gap-1.5 rounded-[10px] bg-[#f2f3f5] px-6 text-[16px] font-semibold tracking-[-0.02em] text-[#111827]"
                  onClick={() => {
                    trackElementClicked({
                      screenName: "community_post_detail",
                      targetType: "button",
                      targetName: "community_empty_comment_write_button",
                      surface: "comments_empty",
                      path: pathname,
                    });
                    commentInputRef.current?.focus();
                  }}
                  type="button"
                >
                  <Pencil aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  댓글 쓰기
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mobile-shell-wide mt-3 overflow-hidden bg-white px-5 py-8 sm:px-6">
          <h2 className="text-[14px] font-semibold leading-[1.35] tracking-[-0.02em] text-[#111827]">
            비슷한 게시글이 올라오면 바로 알려드릴까요?
          </h2>
          <div className="mt-7 flex gap-3 overflow-x-auto pb-1">
            {alertTags.map((tag) => {
              const isSelected = selectedAlertTags.includes(tag);

              return (
                <button
                  aria-pressed={isSelected}
                  className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border px-4 text-[14px] font-medium tracking-[-0.02em] ${
                    isSelected ? "border-black bg-[#f5f5f5] text-[#111827]" : "border-[#e5e7eb] bg-white text-[#6b7280]"
                  }`}
                  key={tag}
                  onClick={() => {
                    setSelectedAlertTags((currentTags) =>
                      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag],
                    );
                    trackElementClicked({
                      screenName: "community_post_detail",
                      targetType: "chip",
                      targetName: "community_similar_post_alert_tag",
                      surface: "similar_post_alert",
                      path: pathname,
                      targetId: tag,
                    });
                  }}
                  type="button"
                >
                  {isSelected ? (
                    <Check aria-hidden="true" className="h-5 w-5 text-[#111827]" strokeWidth={1.8} />
                  ) : (
                    <Plus aria-hidden="true" className="h-5 w-5 text-[#a1a6ae]" strokeWidth={1.8} />
                  )}
                  {tag}
                </button>
              );
            })}
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
            ariaLabel="사진 추가"
            className="text-[#6b7280]"
            onClick={() => {
              trackElementClicked({
                screenName: "community_post_detail",
                targetType: "button",
                targetName: "community_comment_image_button",
                surface: "comment_input",
                path: pathname,
              });
            }}
            pendingFeatureLabel="댓글 사진 첨부"
            returnTo="/community"
          >
            <ImageIcon aria-hidden="true" className="h-7 w-7" strokeWidth={1.9} />
          </IconButton>
          <IconButton
            ariaLabel="장소 추가"
            className="text-[#6b7280]"
            onClick={() => {
              trackElementClicked({
                screenName: "community_post_detail",
                targetType: "button",
                targetName: "community_comment_location_button",
                surface: "comment_input",
                path: pathname,
              });
            }}
            pendingFeatureLabel="댓글 장소 첨부"
            returnTo="/community"
          >
            <MapPin aria-hidden="true" className="h-7 w-7" strokeWidth={1.9} />
          </IconButton>
          <form className="flex h-12 flex-1 items-center justify-between rounded-full bg-[#f2f4f5] px-5" onSubmit={handleCommentSubmit}>
            <input
              className="min-w-0 flex-1 bg-transparent text-[16px] tracking-[-0.02em] text-[#111827] outline-none placeholder:text-[#aeb2b5]"
              onBlur={() => {
                setIsCommentInputFocused(false);
              }}
              onClick={() => {
                if (!commentDraft.trim()) {
                  setCommentDraft(PRESET_COMMENT_BODY);
                }
              }}
              onFocus={() => {
                setIsCommentInputFocused(true);
                if (!commentDraft.trim()) {
                  setCommentDraft(PRESET_COMMENT_BODY);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  addComment();
                }
              }}
              placeholder="댓글을 입력해주세요."
              readOnly
              ref={commentInputRef}
              value={commentDraft}
            />
            {canSubmitComment ? (
              <button
                aria-label="댓글 입력 지우기"
                className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center text-[#9ca3af]"
                onClick={() => {
                  setCommentDraft("");
                  setIsCommentInputFocused(false);
                  commentInputRef.current?.blur();
                  trackElementClicked({
                    screenName: "community_post_detail",
                    targetType: "button",
                    targetName: "community_comment_clear_button",
                    surface: "comment_input",
                    path: pathname,
                  });
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              </button>
            ) : null}
            <button
              aria-label="이모지"
              className="ml-3 text-[#9ca3af]"
              onClick={() => {
                trackElementClicked({
                  screenName: "community_post_detail",
                  targetType: "button",
                  targetName: "community_comment_emoji_button",
                  surface: "comment_input",
                  path: pathname,
                });
              }}
              type="button"
            >
              <Smile aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
            </button>
          </form>
          {shouldShowSubmitButton ? (
            <button
              aria-label="댓글 등록"
              className="flex h-12 w-10 shrink-0 items-center justify-center text-[#c5c9cf] enabled:text-[#ff7f2a]"
              disabled={!canSubmitComment}
              onClick={() => {
                addComment();
              }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              type="button"
            >
              <Send aria-hidden="true" className="h-8 w-8" strokeWidth={2} />
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function buildSimilarPostAlertTags(detail: CommunityPostDetail) {
  const titleTags = detail.title
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((word) => word.length >= 2)
    .slice(0, 3);

  return Array.from(new Set([detail.topic, ...titleTags, detail.town])).slice(0, 5);
}

function CardIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
      <rect fill="currentColor" height="8" rx="1.2" width="8" x="2" y="2" />
      <path d="M4 4.5h4M4 6.5h2.5" stroke="#d1d5dc" strokeLinecap="round" strokeWidth=".8" />
    </svg>
  );
}
