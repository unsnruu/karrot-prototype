"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { formatSellPriceText } from "@/lib/sell-flow";

const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "delete"],
];

export function SellPriceScreen() {
  const router = useRouter();
  const { draft, hydrated, setPriceText } = useSellFlow();

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      router.replace("/home/sell");
    }
  }, [draft.photos.length, hydrated, router]);

  const formattedPrice = formatSellPriceText(draft.priceText);

  const handleAppend = (digit: string) => {
    setPriceText(`${draft.priceText}${digit}`);
  };

  const handleDelete = () => {
    setPriceText(draft.priceText.slice(0, -1));
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col bg-[#f9fafb]">
        <header className="flex h-[60px] items-center px-4">
          <Link aria-label="글쓰기 화면으로 돌아가기" className="flex h-9 w-9 items-center justify-center" href="/home/sell/write">
            <BackIcon />
          </Link>
          <h1 className="flex-1 pr-9 text-center text-[20px] font-bold tracking-[-0.03em] text-[#111827]">가격 설정</h1>
        </header>

        <section className="bg-white">
          <div className="rounded-[14px] border-[1.5px] border-[#ff6f0f] px-8 py-8">
            <div className="flex items-center text-[17px] leading-[1.5]">
              <span className="mr-1 text-[#ff6f0f]">₩</span>
              <span className={formattedPrice ? "text-[#111827]" : "text-[#9ca3af]"}>
                {formattedPrice || "가격을 입력해주세요."}
              </span>
            </div>
          </div>
        </section>

        <div className="h-2 bg-[#f3f4f6]" />

        <section className="bg-white px-4 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[6px] text-[#9ca3af]">
              <AutoPriceIcon />
              <span className="text-[15px] font-semibold">자동 판매 모드</span>
            </div>
            <div className="h-[31px] w-[51px] rounded-full bg-[#e5e7eb] p-[2px]">
              <div className="ml-auto h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)]" />
            </div>
          </div>

          <p className="mt-5 max-w-[293px] text-[13px] leading-[1.55] text-[#9ca3af]">
            아무것도 하지 않아도 당근이 알아서 자동으로 게시글을 끌어올리고 가격을 내리며 판매를 도와드려요.
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-[#f3f4f6] px-4 py-3 text-[13px] text-[#374151]">
            <InfoIcon />
            <p>
              최소 5,000원부터 자동 판매 모드를 <span className="font-semibold">사용할 수 있어요.</span>
            </p>
          </div>
        </section>

        <div className="mt-auto bg-[#868b94]">
          <button
            className={`h-[62px] w-full text-[17px] font-bold ${
              draft.priceText ? "bg-[#ff6f0f] text-white" : "bg-[#868b94] text-[#d1d3d8]"
            }`}
            disabled={!draft.priceText}
            onClick={() => router.push("/home/sell/write")}
            type="button"
          >
            완료
          </button>
        </div>

        <section className="grid grid-cols-3 border-t border-[#c9c9c9] bg-[#d1d5db]">
          {keypadRows.flat().map((key, index) => {
            if (!key) {
              return <div className="h-14 border-b border-r border-[#c9c9c9] bg-[#d1d5db]" key={`blank-${index}`} />;
            }

            if (key === "delete") {
              return (
                <button
                  className="flex h-14 items-center justify-center border-b border-[#c9c9c9] bg-[#d1d5db] text-[#374151]"
                  key={key}
                  onClick={handleDelete}
                  type="button"
                >
                  <DeleteIcon />
                </button>
              );
            }

            return (
              <button
                className="flex h-14 flex-col items-center justify-center border-b border-r border-[#c9c9c9] bg-white text-[#111827]"
                key={key}
                onClick={() => handleAppend(key)}
                type="button"
              >
                <span className="text-[26px] leading-none">{key}</span>
                {key !== "0" ? <span className="mt-1 text-[9px] font-medium tracking-[1px] text-[#6b7280]">{keypadLabel(key)}</span> : null}
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function keypadLabel(value: string) {
  switch (value) {
    case "2":
      return "ABC";
    case "3":
      return "DEF";
    case "4":
      return "GHI";
    case "5":
      return "JKL";
    case "6":
      return "MNO";
    case "7":
      return "PQRS";
    case "8":
      return "TUV";
    case "9":
      return "WXYZ";
    default:
      return "";
  }
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[10px] text-[#111827]" fill="none" viewBox="0 0 10 18">
      <path d="M9 1L1 9l8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function AutoPriceIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-[#4b5563]" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="currentColor" r="10" />
      <path d="M12 10v5" stroke="#fff" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="7.3" fill="#fff" r="1" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-7" fill="none" viewBox="0 0 28 20">
      <path d="M10 4h11a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10L4 10l6-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 8l4 4M18 8l-4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
