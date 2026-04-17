"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/action-button";
import { AppImage } from "@/components/ui/app-image";
import { FieldButton } from "@/components/ui/field-button";
import { PageHeader } from "@/components/ui/page-header";
import { SelectionChipButton } from "@/components/ui/selection-chip";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { resolveHomeHrefFromPathname } from "@/lib/home-experiment";
import { savePublishedSellItem } from "@/lib/local-sell-storage";
import { formatSellPriceText } from "@/lib/sell-flow";
import { buildSellPreviewItem } from "@/lib/sell-flow";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";
import { prototypeViewerUser } from "@/lib/prototype-user";

const AUTO_FILLED_TITLE = "향수 일괄 판매해요";

const AUTO_FILLED_DESCRIPTION = `향수 여러 개 한 번에 정리하려고 올려요 :)
하나씩 모아두었던 제품들인데 사용 빈도가 적어서 이번에 일괄로 판매합니다.

전부 실내 보관했고
전체적으로 상태는 괜찮은 편이에요.
제품마다 사용감이나 잔량 차이는 조금 있어서
자세한 건 사진으로 확인 부탁드려요!

향이 궁금하시거나
상태 더 보고 싶으시면 편하게 채팅 주세요.
개별 판매보다는 일괄 판매 우선으로 생각하고 있어서
한 번에 가져가실 분이면 더 좋을 것 같아요 🙏

거래는 시간 맞춰서 진행 가능하고
너무 무리한 네고만 아니면 편하게 문의 주세요.
필요하시면 추가 사진도 보내드릴게요.`;

export function SellWriteScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    draft,
    hydrated,
    isReadyToSubmit,
    setAcceptPriceSuggestion,
    setDescription,
    setTitle,
    setTradeType,
  } = useSellFlow();
  const hasTrackedScreenView = useRef(false);
  const homeHref = resolveHomeHrefFromPathname(pathname);

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      trackEvent("sell_flow_redirected_missing_photos", {
        source: "sell_write",
        target_step: "photos",
      });
      router.replace("/home/sell/photos");
    }
  }, [draft.photos.length, hydrated, router]);

  useEffect(() => {
    if (!hydrated || hasTrackedScreenView.current) {
      return;
    }

    hasTrackedScreenView.current = true;
    trackEvent(
      "screen_viewed",
      buildScreenViewedEventProperties({
        pathname,
        queryString: "",
        additionalProperties: {
          flow_name: "sell",
          has_description: Boolean(draft.description),
          has_location: Boolean(draft.location),
          has_price: Boolean(draft.priceText),
          has_title: Boolean(draft.title),
          photo_count: draft.photos.length,
          step_name: "write",
        },
      }),
    );
  }, [draft.description, draft.location, draft.photos.length, draft.priceText, draft.title, hydrated, pathname]);

  const handleAutoFillTitle = () => {
    setTitle(AUTO_FILLED_TITLE);
  };

  const handleAutoFillDescription = () => {
    setDescription(AUTO_FILLED_DESCRIPTION);
  };

  const handleComplete = () => {
    trackEvent("sell_form_completed", {
      has_location: Boolean(draft.location),
      photo_count: draft.photos.length,
      price_text: draft.priceText || undefined,
      trade_type: draft.tradeType,
    });
    const nextItem = buildSellPreviewItem(draft);
    savePublishedSellItem(nextItem);
    router.push("/home/sell/preview");
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white pb-[108px]">
        <PageHeader
          leading={
            <Link aria-label="홈으로 닫기" className="flex h-10 w-10 items-center justify-center" href={homeHref}>
              <CloseIcon />
            </Link>
          }
          title="내 물건 팔기"
          trailing={
            <Link
              className="text-[14px] font-medium text-[#9ca3af]"
              href={buildPendingFeatureHref("/home/sell/write", "판매글 임시저장")}
            >
              임시저장
            </Link>
          }
        />

        <section className="flex gap-2 overflow-x-auto border-b border-[#f3f4f6] px-4 py-4">
          <Link
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[14px] border-2 border-[#d1d5db] bg-white"
            href="/home/sell/photos"
          >
            <CameraMiniIcon />
            <span className="mt-1 text-[11px] font-medium text-[#4b5563]">{draft.photos.length}/4</span>
          </Link>

          {draft.photos.map((photo, index) => (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border-2 border-[#e5e7eb]" key={`${photo}-${index}`}>
              <AppImage alt={`선택한 사진 ${index + 1}`} className="h-full w-full object-cover" fill sizes="64px" src={photo} />
            </div>
          ))}
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">제목</p>
          <button
            className="mt-3 w-full border-0 p-0 text-left text-[15px] text-[#111827] focus:outline-none"
            onClick={handleAutoFillTitle}
            type="button"
          >
            <span className={draft.title ? "text-[#111827]" : "text-[#99a1af]"}>
              {draft.title || "탭해서 제목 자동 완성"}
            </span>
          </button>
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">자세한 설명</p>
          <button
            className="mt-4 block min-h-[168px] w-full rounded-[14px] border border-[#e5e7eb] px-[13px] py-3 text-left text-[14px] leading-[1.6] focus:border-[#ff6f0f] focus:outline-none"
            onClick={handleAutoFillDescription}
            type="button"
          >
            <span className={draft.description ? "whitespace-pre-wrap text-[#111827]" : "text-[#99a1af]"}>
              {draft.description || "탭해서 자세한 설명 자동 완성"}
            </span>
          </button>
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">가격</p>

          <div className="mt-3 flex gap-2">
            <TradeChip
              active={draft.tradeType === "sell"}
              label="판매하기"
              onClick={() => setTradeType("sell")}
            />
            <TradeChip
              active={draft.tradeType === "share"}
              label="나눔하기"
              onClick={() => setTradeType("share")}
            />
          </div>

          {draft.tradeType !== "share" ? (
            <>
              <Link
                className="mt-4 flex h-[48px] items-center justify-between border-t border-[#f3f4f6] text-[15px] text-[#111827]"
                href="/home/sell/price"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#9ca3af]">₩</span>
                  <span className={draft.priceText ? "text-[#111827]" : "text-[#99a1af]"}>
                    {draft.priceText ? formatSellPriceText(draft.priceText) : "가격을 입력해주세요."}
                  </span>
                </div>
                <ChevronRightIcon />
              </Link>

              <label className="mt-1 flex items-center gap-2 text-[14px] text-[#374151]">
                <input
                  checked={draft.acceptPriceSuggestion}
                  className="h-5 w-5 rounded-[4px] border-2 border-[#d1d5db] text-[#ff6f0f] focus:ring-[#ff6f0f]"
                  onChange={(event) => setAcceptPriceSuggestion(event.target.checked)}
                  type="checkbox"
                />
                가격 제안 받기
              </label>
            </>
          ) : null}
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">거래 정보</p>

          <FieldButton
            className="mt-3"
            href="/home/sell/location"
            label="거래 희망 장소"
            placeholder="위치 추가"
            value={draft.location?.label}
          />
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#f3f4f6] bg-white px-4 pb-[calc(13px+env(safe-area-inset-bottom))] pt-3">
        <div className="mobile-shell">
          <ActionButton
            className={isReadyToSubmit ? "rounded-[14px] text-[16px]" : "rounded-[14px] bg-[#9ca3af] text-[16px] text-[#d1d3d8]"}
            disabled={!isReadyToSubmit}
            fullWidth
            onClick={handleComplete}
            size="large"
            variant={isReadyToSubmit ? "brandSolid" : "neutralSolid"}
          >
            작성 완료
          </ActionButton>
        </div>
      </div>
    </main>
  );
}

function TradeChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <SelectionChipButton
      active={active}
      className={
        active
          ? "border border-[#ff6f0f] bg-[#ff6f0f] text-white"
          : "border border-[#d1d5db] bg-white text-[#4b5563]"
      }
      onClick={onClick}
      size="sm"
    >
      {label}
    </SelectionChipButton>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}

function CameraMiniIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-[#9ca3af]" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 8.5h3.2l1.3-2h7l1.3 2H20a1.5 1.5 0 0 1 1.5 1.5V17A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17v-7A1.5 1.5 0 0 1 4 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
