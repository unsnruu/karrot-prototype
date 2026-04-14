import { ItemDetailBottomBar } from "@/features/home/components/item-detail-bottom-bar";
import { ItemDetailHero } from "@/features/home/components/item-detail-hero";
import { ItemDetailMainColumn } from "@/features/home/components/item-detail-main-column";
import { appendNavigationQuery } from "@/lib/tab-navigation";
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
  returnTo?: string;
};

export function ItemDetailScreen({ item, seller, relatedItems, returnTo }: ItemDetailScreenProps) {
  const recommendationItems = relatedItems.slice(0, 6);
  const detailHref = `/home/items/${item.slug ?? item.id}`;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mobile-shell min-h-screen bg-white">
        <ItemDetailHero image={item.image} returnTo={returnTo} title={item.title} />

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
