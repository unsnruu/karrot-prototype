"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ItemDetailBottomBar } from "@/features/home/components/item-detail-bottom-bar";
import { ItemDetailHero } from "@/features/home/components/item-detail-hero";
import { ItemDetailMainColumn } from "@/features/home/components/item-detail-main-column";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import {
  buildSellPreviewItem,
  buildSellPreviewRecommendations,
  buildSellPreviewSeller,
  isSellFlowReady,
} from "@/lib/sell-flow";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import { itemDetailUnifiedAd } from "@/lib/marketplace";

export function SellPreviewScreen() {
  const router = useRouter();
  const { draft, hydrated } = useSellFlow();

  useEffect(() => {
    if (hydrated && !isSellFlowReady(draft)) {
      router.replace("/home/sell/write");
    }
  }, [draft, hydrated, router]);

  const item = buildSellPreviewItem(draft);
  const seller = buildSellPreviewSeller();
  const recommendationItems = buildSellPreviewRecommendations();
  const detailHref = "/home/sell/preview";

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mobile-shell min-h-screen bg-white">
        <ItemDetailHero image={item.image} returnTo="/home/sell/write" title={item.title} />

        <div className="w-full px-4 pt-4 sm:px-5">
          <ItemDetailMainColumn
            adItem={itemDetailUnifiedAd}
            item={item}
            recommendationItems={recommendationItems}
            seller={seller}
          />
        </div>
      </div>

      <ItemDetailBottomBar
        avatarImage={item.image}
        chatKey={item.slug ?? item.id}
        chatHref={appendNavigationQuery(`/chat/${item.slug ?? item.id}`, {
          tab: "chat",
          returnTo: detailHref,
        })}
        itemId={item.id}
        sellerName={seller.name}
        town={item.town}
      />
    </main>
  );
}
