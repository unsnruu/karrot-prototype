"use client";

import { useState } from "react";
import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { TownMapBusinessMiniMap } from "@/features/town-map/components/town-map-business-mini-map";
import { type TownMapBusinessDetail } from "@/lib/town-map-business";

export function TownMapBusinessDetailScreen({
  detail,
  backHref,
}: {
  detail: TownMapBusinessDetail;
  backHref: string;
}) {
  const [activeTab, setActiveTab] = useState<BusinessDetailTab>("news");
  const newsPosts = buildNewsPosts(detail);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell-compact min-h-screen bg-white pb-28">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-2 py-3">
            <Link
              aria-label="동네지도로 돌아가기"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]"
              href={backHref}
            >
              <BackIcon />
            </Link>
            <div className="flex items-center gap-1">
              <PendingFeatureLink aria-label="찜하기" className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]" featureLabel="업체 찜하기" returnTo={backHref}>
                <HeartIcon />
              </PendingFeatureLink>
              <PendingFeatureLink aria-label="공유하기" className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]" featureLabel="업체 공유하기" returnTo={backHref}>
                <ShareIcon />
              </PendingFeatureLink>
            </div>
          </div>
        </header>

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
            <PendingFeatureLink className="text-[12px] text-[#9ca3af] underline" featureLabel="이웃 제보 자세히 보기" returnTo={backHref}>
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
            <TabButton active={activeTab === "home"} label="홈" onClick={() => setActiveTab("home")} />
            <TabButton active={activeTab === "news"} label="소식" onClick={() => setActiveTab("news")} />
            <TabButton active={activeTab === "reviews"} label="후기" onClick={() => setActiveTab("reviews")} />
            <TabButton active={activeTab === "photos"} label="사진" onClick={() => setActiveTab("photos")} />
          </div>
        </nav>

        {activeTab === "home" ? (
          <>
            <section className="space-y-4 px-4 py-5">
              <InfoRow icon={<ClockIcon />} value={detail.businessHoursText} />
              <InfoRow
                icon={<PhoneIcon />}
                trailing={(
                  <PendingFeatureLink className="rounded-full border border-[#d1d5db] px-[10px] py-[3px] text-[12px] leading-4 text-[#6b7280]" featureLabel="전화번호 복사" returnTo={backHref}>
                    복사
                  </PendingFeatureLink>
                )}
                value={detail.phoneNumber}
              />
              <InfoRow
                icon={<GlobeIcon />}
                value="홈페이지, SNS를 추가해주세요."
                valueClassName="text-[#9ca3af]"
              />
              <InfoRow icon={<MenuIcon />} multiline value={detail.amenities.join(", ")} />
              <InfoRow icon={<PinIcon />} value={detail.roadAddress} />

              <div className="overflow-hidden rounded-[12px] border border-[#edeef0]">
                <div className="h-[126px]">
                  <TownMapBusinessMiniMap label={detail.name} lat={detail.lat} lng={detail.lng} />
                </div>
              </div>
              <PendingFeatureLink
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#f8f9fa] py-[10px] text-[14px] font-medium leading-5 text-[#374151]"
                featureLabel="업체 정보 수정 및 추가"
                returnTo={backHref}
              >
                <EditInfoIcon />
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
              <PendingFeatureLink className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[14px] font-medium leading-5 text-[#6b7280]" featureLabel="가격 더보기" returnTo={backHref}>
                가격 더보기
                <ChevronDownIcon />
              </PendingFeatureLink>
            </Section>

            <Section title="후기">
              <div className="space-y-6">
                {detail.reviews.length ? (
                  detail.reviews.map((review) => (
                    <article className="border-b border-[#edeef0] pb-5 last:border-b-0 last:pb-0" key={review.id}>
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
                          <KebabIcon />
                        </PendingFeatureLink>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
                        <StarRow rating={review.rating} />
                        <span>{review.createdAtLabel}</span>
                      </div>

                      <p className="mt-3 whitespace-pre-line text-[14px] leading-[22px] text-[#1f2937]">{review.content}</p>

                      <PendingFeatureLink
                        className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#edeef0] px-3 py-[7px] text-[12px] font-medium leading-4 text-[#4b5563]"
                        featureLabel="후기 도움돼요"
                        returnTo={backHref}
                      >
                        <HelpfulIcon />
                        도움돼요
                      </PendingFeatureLink>
                    </article>
                  ))
                ) : (
                  <p className="text-[14px] leading-5 text-[#9ca3af]">아직 등록된 후기가 없어요.</p>
                )}
              </div>

              <PendingFeatureLink className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[14px] font-medium leading-5 text-[#6b7280]" featureLabel="후기 더보기" returnTo={backHref}>
                후기 더보기
                <ChevronDownIcon />
              </PendingFeatureLink>
            </Section>

            <section className="px-5 py-8 text-center">
              <p className="text-[16px] font-bold leading-6 text-[#111827]">이곳을 이용한 생생한 경험을 짧은 영상으로 보여주세요.</p>
              <PendingFeatureLink
                className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#f8f9fa] px-5 py-[10px] text-[14px] font-bold leading-5 text-[#1f2937]"
                featureLabel="스토리 올리기"
                returnTo={backHref}
              >
                <StoryIcon />
                스토리 올리기
              </PendingFeatureLink>
            </section>

            <footer className="bg-[#f8f9fa] px-6 py-6 text-[12px] leading-4 text-[#9ca3af]">
              <PendingFeatureLink className="underline" featureLabel="장소 삭제 신고" returnTo={backHref}>
                장소 삭제 신고
              </PendingFeatureLink>
              <p className="mt-2">마지막 수정일 {detail.updatedAtLabel}</p>
            </footer>
          </>
        ) : null}

        {activeTab === "news" ? (
          <section className="px-4 pb-8 pt-2">
            {newsPosts.map((post, index) => (
              <article className="border-b border-[#edeef0] py-4 first:pt-3 last:border-b-0" key={post.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6]">
                      {post.avatar ? <AppImage alt="" className="object-cover" fill sizes="28px" src={post.avatar} /> : null}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-4 text-[#111827]">{detail.name}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-[#9ca3af]">
                        {post.metaPrimary} · {post.metaSecondary} · {post.postedAt}
                      </p>
                    </div>
                  </div>
                  <PendingFeatureLink aria-label="소식 더보기" className="px-1 text-[#9ca3af]" featureLabel="소식 메뉴" returnTo={backHref}>
                    <KebabIcon />
                  </PendingFeatureLink>
                </div>

                <div className="mt-3">
                  <p className="whitespace-pre-line text-[15px] leading-6 text-[#111827]">
                    <span className="font-bold">{post.title}</span>
                    {"\n"}
                    {post.body}
                    <span className="text-[#868b94]"> ... 더보기</span>
                  </p>
                </div>

                <div className={post.images.length > 1 ? "mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-[4px]" : "mt-3 overflow-hidden rounded-[4px]"}>
                  {post.images.map((image, imageIndex) => (
                    <div className={`relative ${post.images.length > 1 ? "aspect-[154/118]" : "aspect-[320/170]"}`} key={`${post.id}-image-${imageIndex}`}>
                      <AppImage
                        alt={`${detail.name} 소식 이미지 ${imageIndex + 1}`}
                        className="object-cover"
                        fill
                        sizes={post.images.length > 1 ? "(max-width: 640px) 50vw, 180px" : "(max-width: 640px) 100vw, 360px"}
                        src={image}
                      />
                    </div>
                  ))}
                </div>

                {index === 1 ? (
                  <div className="mt-3 rounded-[4px] border border-[#e5e7eb] bg-white px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#ff7a00] text-white">
                        <SparkIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium leading-4 text-[#111827]">{detail.name} 서비스 예약</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#9ca3af]">{post.serviceCaption}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === "reviews" ? (
          <Section title="후기">
            <div className="space-y-6">
              {detail.reviews.length ? (
                detail.reviews.map((review) => (
                  <article className="border-b border-[#edeef0] pb-5 last:border-b-0 last:pb-0" key={review.id}>
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
                        <KebabIcon />
                      </PendingFeatureLink>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
                      <StarRow rating={review.rating} />
                      <span>{review.createdAtLabel}</span>
                    </div>

                    <p className="mt-3 whitespace-pre-line text-[14px] leading-[22px] text-[#1f2937]">{review.content}</p>
                  </article>
                ))
              ) : (
                <p className="text-[14px] leading-5 text-[#9ca3af]">아직 등록된 후기가 없어요.</p>
              )}
            </div>
          </Section>
        ) : null}

        {activeTab === "photos" ? (
          <section className="grid grid-cols-2 gap-1 px-4 py-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const image = detail.imageGallery[index % Math.max(detail.imageGallery.length, 1)] ?? detail.imageGallery[0];

              if (!image) {
                return null;
              }

              return (
                <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#f3f4f6]" key={`${detail.id}-photo-${index}`}>
                  <AppImage alt={`${detail.name} 사진 ${index + 1}`} className="object-cover" fill sizes="50vw" src={image} />
                </div>
              );
            })}
          </section>
        ) : null}

        <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[375px] -translate-x-1/2 gap-2 border-t border-[#edeef0] bg-white px-4 py-3">
          <PendingFeatureLink className="flex-1 rounded-[8px] bg-[#f3f4f6] py-[13px] text-[15px] font-bold leading-5 text-[#374151]" featureLabel="전화 문의" returnTo={backHref}>
            전화 문의
          </PendingFeatureLink>
          <PendingFeatureLink className="flex-1 rounded-[8px] bg-[#ff6f0f] py-[13px] text-[15px] font-bold leading-5 text-white" featureLabel="채팅 문의" returnTo={backHref}>
            채팅 문의
          </PendingFeatureLink>
        </div>
      </div>
    </main>
  );
}

type BusinessDetailTab = "home" | "news" | "reviews" | "photos";

type BusinessNewsPost = {
  id: string;
  avatar: string | null;
  metaPrimary: string;
  metaSecondary: string;
  postedAt: string;
  title: string;
  body: string;
  images: string[];
  serviceCaption: string;
};

function buildNewsPosts(detail: TownMapBusinessDetail): BusinessNewsPost[] {
  const primaryImage = detail.imageGallery[0] ?? null;
  const secondaryImage = detail.imageGallery[1] ?? primaryImage;

  return [
    {
      id: `${detail.id}-news-1`,
      avatar: primaryImage,
      metaPrimary: "1km",
      metaSecondary: "응원중",
      postedAt: "12시간 전",
      title: `오늘의 ${detail.name} 소식`,
      body: `${detail.introText[0] ?? "매장 분위기와 서비스를 전하는 짧은 소식입니다."}\n방문 전 참고하실 수 있게 사진과 함께 전해드려요.`,
      images: [primaryImage, secondaryImage].filter(Boolean),
      serviceCaption: "2026년 05월 31일까지",
    },
    {
      id: `${detail.id}-news-2`,
      avatar: primaryImage,
      metaPrimary: "1km",
      metaSecondary: "응원중",
      postedAt: "19시간 전",
      title: `${detail.name} 이용안내`,
      body: `${detail.introText[1] ?? "예약과 방문 흐름을 미리 확인하실 수 있도록 안내해드려요."}\n방문 전에 확인하면 좋은 내용만 간단히 담았습니다.`,
      images: [secondaryImage || primaryImage].filter(Boolean),
      serviceCaption: "2026년 05월 31일까지",
    },
    {
      id: `${detail.id}-news-3`,
      avatar: primaryImage,
      metaPrimary: "1km",
      metaSecondary: "응원중",
      postedAt: "11일 전",
      title: `${detail.category} 준비 소식`,
      body: `${detail.roadAddress} 근처에서 쉽게 찾으실 수 있게 매장 소식을 꾸준히 전하고 있어요.\n처음 방문하시는 분도 편하게 둘러보실 수 있게 준비했습니다.`,
      images: [primaryImage || secondaryImage].filter(Boolean),
      serviceCaption: "2026년 05월 31일까지",
    },
  ];
}

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

function TabButton({ active = false, label, onClick }: { active?: boolean; label: string; onClick?: () => void }) {
  return (
    <button
      className={`flex-1 border-b-2 pb-[14px] pt-3 text-center text-[14px] font-bold leading-5 ${
        active ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6b7280]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="m12 20-1.4-1.27C5.4 14 2 10.91 2 7.1 2 4.01 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.01 22 7.1c0 3.81-3.4 6.9-8.6 11.64L12 20Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M12 16V5m0 0 4 4m-4-4-4 4M5 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v5l3 1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.03-.24c1.12.37 2.31.56 3.56.56a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.25.19 2.44.56 3.56a1 1 0 0 1-.24 1.03l-2.2 2.2Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12h16M12 3.5c2.3 2.35 3.5 5.18 3.5 8.5S14.3 18.15 12 20.5M12 3.5C9.7 5.85 8.5 8.68 8.5 12s1.2 6.15 3.5 8.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 21s6-5.69 6-11a6 6 0 1 0-12 0c0 5.31 6 11 6 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

function HelpfulIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
      <path d="M6.73 1.16a.75.75 0 0 1 .9.94l-.62 2.41h5.02c.95 0 1.55 1.01 1.1 1.84l-2.52 4.63a1.75 1.75 0 0 1-1.54.91H4.5a1.5 1.5 0 0 1-1.5-1.5V7.4c0-.29.08-.58.24-.83L5.9 2.13a1.75 1.75 0 0 1 .83-.73ZM2 7h-.25A.75.75 0 0 0 1 7.75v3.5c0 .41.34.75.75.75H2V7Z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`h-4 w-4 ${className}`.trim()} fill="none" viewBox="0 0 16 16">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
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

function EditInfoIcon() {
  return (
    <svg aria-hidden="true" className="h-[12px] w-[12px]" fill="none" viewBox="0 0 16 16">
      <path
        d="M11.91 1.84a1.5 1.5 0 0 1 2.12 2.12l-7.5 7.5-3.03.91.9-3.03 7.51-7.5Zm-6.93 8.13 1.05 1.05"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 1.5c.2 0 .38.13.44.32l.86 2.57c.03.1.11.18.21.21l2.57.86a.47.47 0 0 1 0 .88l-2.57.86a.35.35 0 0 0-.21.21l-.86 2.57a.47.47 0 0 1-.88 0L6.7 7.41a.35.35 0 0 0-.21-.21l-2.57-.86a.47.47 0 0 1 0-.88l2.57-.86c.1-.03.18-.11.21-.21l.86-2.57A.47.47 0 0 1 8 1.5Z" />
    </svg>
  );
}
