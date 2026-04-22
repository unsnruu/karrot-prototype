"use client";

import { ArrowLeft, ChevronDown, Clock3, Globe, Heart, MapPin, Menu, Phone, PencilLine, Share } from "lucide-react";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { AppToolbar } from "@/components/ui/app-toolbar";
import { IconButton } from "@/components/ui/icon-button";
import { UnderlineTabLink } from "@/components/ui/tabs";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { TownMapBusinessNewsList } from "@/features/town-map/components/town-map-business-news-list";
import { TownMapBusinessPhotoGrid } from "@/features/town-map/components/town-map-business-photo-grid";
import { TownMapBusinessReviewList } from "@/features/town-map/components/town-map-business-review-list";
import { TownMapBusinessMiniMap } from "@/features/town-map/components/town-map-business-mini-map";
import { type TownMapBusinessDetail } from "@/lib/town-map-business";
import { type TownMapBusinessNewsPost } from "@/lib/town-map-business-news";

export function TownMapBusinessDetailScreen({
  detail,
  backHref,
  activeTab,
  newsPosts,
  tabHrefs,
}: {
  detail: TownMapBusinessDetail;
  backHref: string;
  activeTab: BusinessDetailTab;
  newsPosts: TownMapBusinessNewsPost[];
  tabHrefs: Record<BusinessDetailTab, string>;
}) {
  const pathname = usePathname();
  const trackFooterAction = (targetName: "town_map_business_call_button" | "town_map_business_chat_button") => {
    trackEvent(
      "element_clicked",
      buildElementClickedEventProperties({
        screenName: "town_map_business_detail",
        targetType: "button",
        targetName,
        surface: "sticky_footer",
        path: pathname,
        targetId: detail.id,
      }),
    );
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell-compact min-h-screen bg-white pb-28">
        <AppToolbar
          className="sticky top-0 z-20 bg-white/95 px-2 py-3 backdrop-blur"
          leading={
            <IconButton
              ariaLabel="동네지도로 돌아가기"
              className="h-10 w-10 rounded-full text-[#111827]"
              href={backHref}
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "town_map_business_detail",
                    targetType: "button",
                    targetName: "town_map_business_back_button",
                    surface: "header",
                    path: pathname,
                    destinationPath: backHref,
                    targetId: detail.id,
                  }),
                );
              }}
            >
              <ArrowLeft aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
            </IconButton>
          }
          trailing={
            <>
              <IconButton
                ariaLabel="찜하기"
                className="h-10 w-10 rounded-full text-[#111827]"
                onClick={() => {
                  trackEvent(
                    "element_clicked",
                    buildElementClickedEventProperties({
                      screenName: "town_map_business_detail",
                      targetType: "button",
                      targetName: "town_map_business_like_button",
                      surface: "header",
                      path: pathname,
                      targetId: detail.id,
                    }),
                  );
                }}
                pendingFeatureLabel="업체 찜하기"
                returnTo={backHref}
              >
                <Heart aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
              <IconButton
                ariaLabel="공유하기"
                className="h-10 w-10 rounded-full text-[#111827]"
                onClick={() => {
                  trackEvent(
                    "element_clicked",
                    buildElementClickedEventProperties({
                      screenName: "town_map_business_detail",
                      targetType: "button",
                      targetName: "town_map_business_share_button",
                      surface: "header",
                      path: pathname,
                      targetId: detail.id,
                    }),
                  );
                }}
                pendingFeatureLabel="업체 공유하기"
                returnTo={backHref}
              >
                <Share aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </IconButton>
            </>
          }
        />

        <section className="px-4 pt-2">
          <h1 className="text-[24px] font-bold leading-8 tracking-[-0.03em] text-[#111827]">{detail.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-[14px] leading-5">
            <span className="font-bold text-[#ff8a3d]">★ {detail.rating.toFixed(1)}</span>
            <span className="text-[#9ca3af]">·</span>
            <span className="font-medium text-[#6b7280]">후기 {detail.reviewCount}</span>
          </div>
          <p className="mt-2 text-[14px] leading-5 text-[#868b94]">
            {detail.townLabel} · {detail.category}
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-[10px] bg-[#f8f9fa] px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5e7eb] text-[11px] font-bold text-[#6b7280]">
              이웃
            </div>
            <p className="flex-1 text-[14px] leading-5 text-[#4b5563]">
              <span className="font-bold text-[#111827]">{detail.informantName}</span> 이웃이 정보를 알려줬어요.
            </p>
            <PendingFeatureLink
              className="text-[12px] text-[#9ca3af] underline"
              featureLabel="이웃 제보 자세히 보기"
              returnTo={backHref}
              tracking={{
                screenName: "town_map_business_detail",
                targetType: "link",
                targetName: "town_map_business_informant_detail_link",
                surface: "overview",
                path: pathname,
                targetId: detail.id,
              }}
            >
              더보기
            </PendingFeatureLink>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {detail.imageGallery.slice(0, 2).map((image, index) => (
              <div className="relative aspect-[144/200] overflow-hidden rounded-[8px] bg-[#e5e7eb]" key={`${detail.id}-image-${index}`}>
                <AppImage
                  alt={`${detail.name} 사진 ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 50vw, 320px"
                  src={image}
                />
              </div>
            ))}
          </div>
        </section>

        <nav className="mt-4 border-b border-[#edeef0] px-4">
          <div className="flex">
            <TabButton active={activeTab === "home"} currentPath={pathname} href={tabHrefs.home} label="홈" tabKey="home" />
            <TabButton active={activeTab === "news"} currentPath={pathname} href={tabHrefs.news} label="소식" tabKey="news" />
            <TabButton active={activeTab === "reviews"} currentPath={pathname} href={tabHrefs.reviews} label="후기" tabKey="reviews" />
            <TabButton active={activeTab === "photos"} currentPath={pathname} href={tabHrefs.photos} label="사진" tabKey="photos" />
          </div>
        </nav>

        {activeTab === "home" ? (
          <>
            <section className="space-y-4 px-4 py-5">
              <InfoRow icon={<Clock3 aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />} value={detail.businessHoursText} />
              <InfoRow
                icon={<Phone aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                trailing={(
                  <PendingFeatureLink
                    className="rounded-full border border-[#d1d5db] px-[10px] py-[3px] text-[12px] leading-4 text-[#6b7280]"
                    featureLabel="전화번호 복사"
                    returnTo={backHref}
                    tracking={{
                      screenName: "town_map_business_detail",
                      targetType: "button",
                      targetName: "town_map_business_copy_phone_button",
                      surface: "info",
                      path: pathname,
                      targetId: detail.id,
                    }}
                  >
                    복사
                  </PendingFeatureLink>
                )}
                value={detail.phoneNumber}
              />
              <InfoRow
                icon={<Globe aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />}
                value="홈페이지, SNS를 추가해주세요."
                valueClassName="text-[#9ca3af]"
              />
              <InfoRow icon={<Menu aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />} multiline value={detail.amenities.join(", ")} />
              <InfoRow icon={<MapPin aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />} value={detail.roadAddress} />

              <div className="overflow-hidden rounded-[12px] border border-[#edeef0]">
                <div className="h-[126px]">
                  <TownMapBusinessMiniMap label={detail.name} lat={detail.lat} lng={detail.lng} />
                </div>
              </div>
              <PendingFeatureLink
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f8f9fa] py-[10px] text-[14px] font-medium leading-5 text-[#374151]"
                featureLabel="업체 정보 수정 및 추가"
                returnTo={backHref}
                tracking={{
                  screenName: "town_map_business_detail",
                  targetType: "button",
                  targetName: "town_map_business_edit_info_button",
                  surface: "info",
                  path: pathname,
                  targetId: detail.id,
                }}
              >
                <PencilLine aria-hidden="true" className="h-[12px] w-[12px]" strokeWidth={1.4} />
                정보 수정 및 추가
              </PendingFeatureLink>
            </section>

            <Section
              title="가격"
              trailing={(
                <span className="text-[11px] font-medium leading-4 text-[#9ca3af]">실제 메뉴 가격은 변동될 수 있어요.</span>
              )}
            >
              <div className="space-y-3">
                {detail.menuItems.map((menu) => (
                  <div className="flex items-start justify-between gap-4 border-b border-[#f3f4f6] pb-3 last:border-b-0 last:pb-0" key={menu.id}>
                    <div>
                      <p className="text-[14px] font-semibold leading-5 text-[#111827]">{menu.name}</p>
                      {menu.description ? <p className="mt-1 text-[13px] leading-5 text-[#6b7280]">{menu.description}</p> : null}
                    </div>
                    <p className="whitespace-nowrap text-[14px] font-bold leading-5 text-[#111827]">{menu.price}</p>
                  </div>
                ))}
              </div>
              <PendingFeatureLink
                className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[14px] font-medium leading-5 text-[#6b7280]"
                featureLabel="가격 더보기"
                returnTo={backHref}
                tracking={{
                  screenName: "town_map_business_detail",
                  targetType: "button",
                  targetName: "town_map_business_more_prices_button",
                  surface: "prices",
                  path: pathname,
                  targetId: detail.id,
                }}
              >
                가격 더보기
                <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
              </PendingFeatureLink>
            </Section>

            <Section title="후기">
              <TownMapBusinessReviewList backHref={backHref} reviews={detail.reviews} showHelpfulAction />

              <PendingFeatureLink
                className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[14px] font-medium leading-5 text-[#6b7280]"
                featureLabel="후기 더보기"
                returnTo={backHref}
                tracking={{
                  screenName: "town_map_business_detail",
                  targetType: "button",
                  targetName: "town_map_business_more_reviews_button",
                  surface: "reviews",
                  path: pathname,
                  targetId: detail.id,
                }}
              >
                후기 더보기
                <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
              </PendingFeatureLink>
            </Section>

            <section className="px-5 py-8 text-center">
              <p className="text-[16px] font-bold leading-6 text-[#111827]">이곳을 이용한 생생한 경험을 짧은 영상으로 보여주세요.</p>
              <PendingFeatureLink
                className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#f8f9fa] px-5 py-[10px] text-[14px] font-bold leading-5 text-[#1f2937]"
                featureLabel="스토리 올리기"
                returnTo={backHref}
                tracking={{
                  screenName: "town_map_business_detail",
                  targetType: "button",
                  targetName: "town_map_business_story_button",
                  surface: "story",
                  path: pathname,
                  targetId: detail.id,
                }}
              >
                <StoryIcon />
                스토리 올리기
              </PendingFeatureLink>
            </section>

            <footer className="bg-[#f8f9fa] px-6 py-6 text-[12px] leading-4 text-[#9ca3af]">
              <PendingFeatureLink
                className="underline"
                featureLabel="장소 삭제 신고"
                returnTo={backHref}
                tracking={{
                  screenName: "town_map_business_detail",
                  targetType: "link",
                  targetName: "town_map_business_report_link",
                  surface: "footer",
                  path: pathname,
                  targetId: detail.id,
                }}
              >
                장소 삭제 신고
              </PendingFeatureLink>
              <p className="mt-2">마지막 수정일 {detail.updatedAtLabel}</p>
            </footer>
          </>
        ) : null}

        {activeTab === "news" ? (
          <section className="px-4 pb-8 pt-2">
            <TownMapBusinessNewsList backHref={backHref} businessName={detail.name} newsPosts={newsPosts} />
          </section>
        ) : null}

        {activeTab === "reviews" ? (
          <Section title="후기">
            <TownMapBusinessReviewList backHref={backHref} reviews={detail.reviews} />
          </Section>
        ) : null}

        {activeTab === "photos" ? (
          <TownMapBusinessPhotoGrid businessId={detail.id} businessName={detail.name} imageGallery={detail.imageGallery} />
        ) : null}

        <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[375px] -translate-x-1/2 gap-2 border-t border-[#edeef0] bg-white px-4 py-3">
          <PendingFeatureLink
            className="flex-1 rounded-[8px] bg-[#f3f4f6] py-[13px] text-[15px] font-bold leading-5 text-[#374151]"
            featureLabel="전화 문의"
            onClick={() => trackFooterAction("town_map_business_call_button")}
            returnTo={backHref}
          >
            전화 문의
          </PendingFeatureLink>
          <PendingFeatureLink
            className="flex-1 rounded-[8px] bg-[#ff6f0f] py-[13px] text-[15px] font-bold leading-5 text-white"
            featureLabel="채팅 문의"
            onClick={() => trackFooterAction("town_map_business_chat_button")}
            returnTo={backHref}
          >
            채팅 문의
          </PendingFeatureLink>
        </div>
      </div>
    </main>
  );
}

type BusinessDetailTab = "home" | "news" | "reviews" | "photos";

function Section({
  title,
  trailing,
  children,
}: React.PropsWithChildren<{ title: string; trailing?: React.ReactNode }>) {
  return (
    <section className="px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold leading-7 text-[#111827]">{title}</h2>
        {trailing}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}


function TabButton({
  active = false,
  currentPath,
  href,
  label,
  tabKey,
}: {
  active?: boolean;
  currentPath: string;
  href: string;
  label: string;
  tabKey: BusinessDetailTab;
}) {
  return (
    <UnderlineTabLink
      active={active}
      href={href}
      onClick={() => {
        trackEvent(
          "element_clicked",
          buildElementClickedEventProperties({
            screenName: "town_map_business_detail",
            targetType: "tab",
            targetName: "town_map_business_tab",
            surface: "tab_bar",
            path: currentPath,
            targetId: tabKey,
            destinationPath: href,
          }),
        );
      }}
    >
      {label}
    </UnderlineTabLink>
  );
}

function InfoRow({
  icon,
  value,
  trailing,
  multiline = false,
  valueClassName = "text-[#111827]",
}: {
  icon: React.ReactNode;
  value: string;
  trailing?: React.ReactNode;
  multiline?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[2px] shrink-0 text-[#9ca3af]">{icon}</span>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <p className={`min-w-0 text-[14px] leading-[22px] ${multiline ? "whitespace-normal" : "whitespace-nowrap"} ${valueClassName}`}>
          {value}
        </p>
        {trailing}
      </div>
    </div>
  );
}


function StoryIcon() {
  return (
    <svg aria-hidden="true" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 2.2c.39 0 .7.31.7.7v4.4h4.4a.7.7 0 1 1 0 1.4H8.7v4.4a.7.7 0 1 1-1.4 0V8.7H2.9a.7.7 0 1 1 0-1.4h4.4V2.9c0-.39.31-.7.7-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
