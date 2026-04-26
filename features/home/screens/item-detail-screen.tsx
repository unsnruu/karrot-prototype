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
  const detailHref = createDetailHref(item.slug ?? item.id, returnTo);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mobile-shell min-h-screen bg-white">
        <ItemDetailHero image={item.image} returnTo={returnTo} title={item.title} />

        <div className="w-full px-4 pt-4 sm:px-5">
          <ItemDetailMainColumn
            adItem={itemDetailUnifiedAd}
            item={item}
            recommendationItems={recommendationItems}
            returnTo={returnTo}
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
        returnTo={returnTo}
        sellerName={seller.name}
        town={item.town}
      />
    </main>
  );
}

function createDetailHref(slug: string, returnTo?: string) {
  const baseHref = `/home/items/${slug}`;

  if (!returnTo) {
    return baseHref;
  }

  return appendNavigationQuery(baseHref, { returnTo });
}
