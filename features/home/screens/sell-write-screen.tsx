"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { formatSellPriceText } from "@/lib/sell-flow";
import { prototypeViewerUser } from "@/lib/prototype-user";

export function SellWriteScreen() {
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

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      router.replace("/home/sell");
    }
  }, [draft.photos.length, hydrated, router]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white pb-[108px]">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#f3f4f6] bg-white px-4">
          <Link aria-label="홈으로 닫기" className="flex h-10 w-10 items-center justify-center" href="/home">
            <CloseIcon />
          </Link>
          <h1 className="text-[20px] font-bold tracking-[-0.03em] text-[#111827]">내 물건 팔기</h1>
          <button className="text-[14px] font-medium text-[#9ca3af]" type="button">
            임시저장
          </button>
        </header>

        <section className="flex gap-2 overflow-x-auto border-b border-[#f3f4f6] px-4 py-4">
          <Link
            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[14px] border-2 border-[#d1d5db] bg-white"
            href="/home/sell"
          >
            <CameraMiniIcon />
            <span className="mt-1 text-[11px] font-medium text-[#4b5563]">{draft.photos.length}/10</span>
          </Link>

          {draft.photos.map((photo, index) => (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border-2 border-[#e5e7eb]" key={`${photo}-${index}`}>
              <AppImage alt={`선택한 사진 ${index + 1}`} className="h-full w-full object-cover" fill sizes="64px" src={photo} />
            </div>
          ))}
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">제목</p>
          <input
            className="mt-3 w-full border-0 p-0 text-[15px] text-[#111827] placeholder:text-[#99a1af] focus:outline-none"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력해주세요."
            type="text"
            value={draft.title}
          />
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">자세한 설명</p>
          <textarea
            className="mt-4 h-[168px] w-full resize-none rounded-[14px] border border-[#e5e7eb] px-[13px] py-3 text-[14px] leading-[1.6] text-[#111827] placeholder:text-[#99a1af] focus:border-[#ff6f0f] focus:outline-none"
            onChange={(event) => setDescription(event.target.value)}
            placeholder={
              "합정동에 올릴 게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)\n\n신뢰할 수 있는 거래를 위해 자세히 적어주세요. 과학기술정보통신부, 한국 인터넷진흥원과 함께 해요."
            }
            value={draft.description}
          />
          <button
            className="mt-4 inline-flex h-[34px] items-center justify-center rounded-[10px] border border-[#d1d5db] px-4 text-[13px] font-medium text-[#374151]"
            type="button"
          >
            자주 쓰는 문구
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
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">거래 정보</p>

          <Link
            className="mt-3 flex min-h-[52px] items-center justify-between rounded-[14px] border border-[#e5e7eb] px-4 py-3"
            href="/home/sell/location"
          >
            <span className="text-[15px] font-medium text-[#374151]">거래 희망 장소</span>
            <span className="flex items-center gap-1 text-[14px] font-medium text-[#9ca3af]">
              {draft.location?.label ?? "위치 추가"}
              <ChevronRightIcon />
            </span>
          </Link>
        </section>

        <section className="border-b border-[#f3f4f6] px-4 py-3">
          <button className="flex items-center gap-1 text-[14px] font-medium text-[#374151]" type="button">
            보여줄 동네 선택
            <ChevronRightIcon small />
          </button>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#9ca3af]">{prototypeViewerUser.town} 기준으로 게시글이 보여져요.</p>
        </section>

        <section className="px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[15px] text-[#9ca3af]">남현동에 같은 글 올리기</p>
            <div className="h-[31px] w-[51px] rounded-full bg-[#e5e7eb] p-[2px]">
              <div className="h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#f3f4f6] bg-white px-4 pb-[calc(13px+env(safe-area-inset-bottom))] pt-3">
        <div className="mobile-shell">
          <button
            className={`flex h-[54px] w-full items-center justify-center rounded-[14px] text-[16px] font-bold ${
              isReadyToSubmit ? "bg-[#ff6f0f] text-white" : "bg-[#9ca3af] text-[#d1d3d8]"
            }`}
            disabled={!isReadyToSubmit}
            onClick={() => router.push("/home/sell/preview")}
            type="button"
          >
            작성 완료
          </button>
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
    <button
      className={`inline-flex h-[37px] items-center justify-center rounded-full border px-4 text-[14px] font-medium ${
        active ? "border-[#ff6f0f] bg-[#ff6f0f] text-white" : "border-[#d1d5db] bg-white text-[#4b5563]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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

function ChevronRightIcon({ small = false }: { small?: boolean }) {
  return (
    <svg aria-hidden="true" className={small ? "h-3 w-3" : "h-[14px] w-[14px]"} fill="none" viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
