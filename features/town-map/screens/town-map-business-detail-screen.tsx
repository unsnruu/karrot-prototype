import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { TownMapBusinessMiniMap } from "@/features/town-map/components/town-map-business-mini-map";
import { type TownMapBusinessDetail } from "@/lib/town-map-business";

export function TownMapBusinessDetailScreen({ detail }: { detail: TownMapBusinessDetail }) {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-white pb-20">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-2 py-3">
            <Link
              aria-label="동네지도로 돌아가기"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]"
              href="/town-map"
            >
              <BackIcon />
            </Link>
            <div className="flex items-center gap-1">
              <button aria-label="찜하기" className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]" type="button">
                <HeartIcon />
              </button>
              <button aria-label="공유하기" className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827]" type="button">
                <ShareIcon />
              </button>
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
            <button className="text-[12px] text-[#9ca3af] underline" type="button">
              더보기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {detail.imageGallery.slice(0, 2).map((image, index) => (
              <div className="relative aspect-[144/200] overflow-hidden rounded-[8px] bg-[#e5e7eb]" key={`${detail.id}-image-${index}`}>
                <AppImage
                  alt={`${detail.name} 사진 ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 390px) 50vw, 180px"
                  src={image}
                />
              </div>
            ))}
          </div>
        </section>

        <nav className="mt-4 border-b border-[#edeef0] px-4">
          <div className="flex">
            <TabButton active label="홈" />
            <TabButton label={`후기 ${detail.reviewCount}`} />
            <TabButton label="사진" />
          </div>
        </nav>

        <section className="space-y-4 px-4 py-5">
          <InfoRow icon={<ClockIcon />} value={detail.businessHoursText} />
          <InfoRow
            icon={<PhoneIcon />}
            trailing={(
              <button className="rounded-full border border-[#d1d5db] px-[10px] py-[3px] text-[12px] leading-4 text-[#6b7280]" type="button">
                복사
              </button>
            )}
            value={detail.phoneNumber}
          />
          <InfoRow
            icon={<GlobeIcon />}
            value={detail.websiteLabel ?? "홈페이지, SNS를 추가해주세요."}
            valueClassName={detail.websiteUrl ? "text-[#111827] underline" : "text-[#9ca3af]"}
          />
          <InfoRow icon={<MenuIcon />} multiline value={detail.amenities.join(", ")} />
          <InfoRow icon={<PinIcon />} value={detail.roadAddress} />

          <div className="overflow-hidden rounded-[12px] border border-[#edeef0]">
            <div className="h-[126px]">
              <TownMapBusinessMiniMap label={detail.name} lat={detail.lat} lng={detail.lng} />
            </div>
          </div>
        </section>

        <Section title="소개">
          <div className="space-y-3 text-[14px] leading-[22px] text-[#4b5563]">
            {detail.introText.map((paragraph, index) => (
              <p key={`${detail.id}-intro-${index}`}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section title="대표 메뉴">
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
        </Section>

        <section className="px-5 py-8 text-center">
          <p className="text-[16px] font-bold leading-6 text-[#111827]">
            참여자님, {detail.name} 이용하셨나요?
          </p>
          <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">이웃에게 도움이 되는 생생한 후기를 남겨주세요.</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <span className="text-[30px] leading-none text-[#d1d5db]" key={`${detail.id}-rating-${index}`}>
                ★
              </span>
            ))}
          </div>
          <button
            className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#edeef0] bg-[#f8f9fa] px-5 py-[11px] text-[14px] font-medium leading-5 text-[#111827]"
            type="button"
          >
            업체 후기 쓰면 <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#facc15] text-[10px] text-white">₩</span> 당근머니 지급
          </button>
        </section>

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
                    <button aria-label="후기 더보기" className="px-1 text-[#9ca3af]" type="button">
                      <KebabIcon />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
                    <StarRow rating={review.rating} />
                    <span>{review.createdAtLabel}</span>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-[14px] leading-[22px] text-[#1f2937]">{review.content}</p>

                  <button
                    className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#edeef0] px-3 py-[7px] text-[12px] font-medium leading-4 text-[#4b5563]"
                    type="button"
                  >
                    <HelpfulIcon />
                    도움돼요
                  </button>
                </article>
              ))
            ) : (
              <p className="text-[14px] leading-5 text-[#9ca3af]">아직 등록된 후기가 없어요.</p>
            )}
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-[14px] font-medium leading-5 text-[#6b7280]" type="button">
            후기 더보기
            <ChevronDownIcon />
          </button>
        </Section>

        <footer className="bg-[#f8f9fa] px-6 py-6 text-[12px] leading-4 text-[#9ca3af]">
          <button className="underline" type="button">
            장소 삭제 신고
          </button>
          <p className="mt-2">마지막 수정일 {detail.updatedAtLabel}</p>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <section className="px-5 py-6">
      <h2 className="text-[18px] font-bold leading-7 text-[#111827]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TabButton({ active = false, label }: { active?: boolean; label: string }) {
  return (
    <button
      className={`flex-1 border-b-2 pb-[14px] pt-3 text-center text-[14px] font-bold leading-5 ${
        active ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6b7280]"
      }`}
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

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}
