"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/action-button";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { formatSellPriceText } from "@/lib/sell-flow";

const AUTO_FILLED_PRICE = "75000";

export function SellPriceScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { draft, hydrated, setPriceText } = useSellFlow();
  const hasTrackedScreenView = useRef(false);

  useEffect(() => {
    if (hydrated && draft.photos.length === 0) {
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
      }),
    );
  }, [draft.photos.length, draft.priceText, hydrated, pathname]);

  const formattedPrice = formatSellPriceText(draft.priceText);
  const handleAutoFillPrice = () => {
    setPriceText(AUTO_FILLED_PRICE);
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col bg-[#f9fafb]">
        <header className="flex h-[60px] items-center px-4">
          <Link
            aria-label="글쓰기 화면으로 돌아가기"
            className="flex h-9 w-9 items-center justify-center"
            href="/home/sell/write"
            onClick={() => {
              trackEvent("element_clicked", buildElementClickedEventProperties({
                screenName: "sell_price",
                targetType: "button",
                targetName: "sell_price_back_button",
                surface: "header",
                path: pathname,
                destinationPath: "/home/sell/write",
              }));
            }}
          >
            <ChevronLeft aria-hidden="true" className="h-[18px] w-[10px] text-[#111827]" strokeWidth={1.8} />
          </Link>
          <h1 className="flex-1 pr-9 text-center text-[20px] font-bold tracking-[-0.03em] text-[#111827]">가격 설정</h1>
        </header>

        <section className="bg-white">
          <button
            className="w-full rounded-[14px] border-[1.5px] border-[#ff6f0f] px-8 py-8 text-left"
            onClick={() => {
              trackEvent("element_clicked", buildElementClickedEventProperties({
                screenName: "sell_price",
                targetType: "field",
                targetName: "sell_price_autofill_field",
                surface: "content",
                path: pathname,
              }));
              handleAutoFillPrice();
            }}
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
          <ActionButton
            className={draft.priceText ? "rounded-none text-[17px]" : "rounded-none bg-[#868b94] text-[17px] text-[#d1d3d8]"}
            disabled={!draft.priceText}
            fullWidth
            onClick={() => {
              trackEvent("element_clicked", buildElementClickedEventProperties({
                screenName: "sell_price",
                targetType: "button",
                targetName: "sell_price_complete_button",
                surface: "sticky_footer",
                path: pathname,
                destinationPath: "/home/sell/write",
              }));
              router.push("/home/sell/write");
            }}
            size="large"
            variant={draft.priceText ? "brandSolid" : "neutralSolid"}
          >
            완료
          </ActionButton>
        </div>
      </div>
    </main>
  );
}
