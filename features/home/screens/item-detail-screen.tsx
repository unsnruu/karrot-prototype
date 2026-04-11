import { ItemDetailBottomBar } from "@/features/home/components/item-detail-bottom-bar";
import { ItemDetailHero } from "@/features/home/components/item-detail-hero";
import { ItemDetailMainColumn } from "@/features/home/components/item-detail-main-column";
import {
  itemDetailUnifiedAd,
  type HomeFeedItem,
  type MarketplaceItem,
  type SellerProfile,
} from "@/lib/marketplace";

type ItemDetailScreenProps = {
  item: MarketplaceItem;
  seller: SellerProfile;
  relatedItems: HomeFeedItem[];
};

export function ItemDetailScreen({ item, seller, relatedItems }: ItemDetailScreenProps) {
  const recommendationItems = relatedItems.slice(0, 6);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto min-h-screen w-full max-w-screen-sm bg-white">
        <ItemDetailHero image={item.image} title={item.title} />

        <div className="w-full px-4 pt-4 sm:px-5">
          <ItemDetailMainColumn
            adItem={itemDetailUnifiedAd}
            item={item}
            recommendationItems={recommendationItems}
            seller={seller}
          />
        </div>
      </div>

      <ItemDetailBottomBar chatHref={`/chat/${item.id}?source=detail`} />
    </main>
  );
}
