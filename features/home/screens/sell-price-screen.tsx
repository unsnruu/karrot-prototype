"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { formatSellPriceText } from "@/lib/sell-flow";

const AUTO_FILLED_PRICE = "75000";

export function SellPriceScreen() {
  const router = useRouter();
  const { draft, hydrated, setPriceText } = useSellFlow();

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
      router.replace("/home/sell/photos");
    }
  }, [draft.photos.length, hydrated, router]);

  const formattedPrice = formatSellPriceText(draft.priceText);
  const handleAutoFillPrice = () => {
    setPriceText(AUTO_FILLED_PRICE);
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
          <button
            className="w-full rounded-[14px] border-[1.5px] border-[#ff6f0f] px-8 py-8 text-left"
            onClick={handleAutoFillPrice}
            type="button"
          >
            <div className="flex items-center text-[17px] leading-[1.5]">
              <span className="mr-1 text-[#ff6f0f]">₩</span>
              <span className={formattedPrice ? "text-[#111827]" : "text-[#9ca3af]"}>
                {formattedPrice || "탭해서 가격 자동 완성"}
              </span>
            </div>
          </button>
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
      </div>
    </main>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[10px] text-[#111827]" fill="none" viewBox="0 0 10 18">
      <path d="M9 1L1 9l8 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
