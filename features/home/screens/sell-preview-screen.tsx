"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildScreenViewedEventProperties } from "@/lib/analytics/screen-view";
import { ItemDetailHero } from "@/features/home/components/item-detail-hero";
import { ItemDetailMainColumn } from "@/features/home/components/item-detail-main-column";
import { SellPreviewBottomBar } from "@/features/home/components/sell-preview-bottom-bar";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { readPublishedSellItem } from "@/lib/local-sell-storage";
import {
  buildSellPreviewItem,
  buildSellPreviewRecommendations,
  buildSellPreviewSeller,
  isSellFlowReady,
} from "@/lib/sell-flow";
import { itemDetailUnifiedAd } from "@/lib/marketplace";

export function SellPreviewScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { draft, hydrated } = useSellFlow();
  const publishedItem = readPublishedSellItem();
  const hasTrackedScreenView = useRef(false);

  useEffect(() => {
    if (hydrated && !publishedItem && !isSellFlowReady(draft)) {
      router.replace("/home/sell/write");
    }
  }, [draft, hydrated, publishedItem, router]);

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
  }, [draft.photos.length, hydrated, pathname, publishedItem]);

  const item = publishedItem ?? buildSellPreviewItem(draft);
  const seller = buildSellPreviewSeller();
  const recommendationItems = buildSellPreviewRecommendations();
  const detailHref = `/home/items/${item.slug ?? item.id}`;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mobile-shell min-h-screen bg-white">
        <ItemDetailHero image={item.image} returnTo="/home/sell/write" title={item.title} />

        <div className="w-full px-4 pt-4 sm:px-5">
          <ItemDetailMainColumn
            adItem={itemDetailUnifiedAd}
            detailHref={detailHref}
            item={item}
            nearbyBusinesses={[]}
            recommendationItems={recommendationItems}
            seller={seller}
          />
        </div>
      </div>

      <SellPreviewBottomBar />
    </main>
  );
}
