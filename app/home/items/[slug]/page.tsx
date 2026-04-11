import { notFound } from "next/navigation";
import { ItemDetailScreen } from "@/features/home/screens/item-detail-screen";
import { getHomeFeedPage, getMarketplaceItemDetail } from "@/lib/marketplace-data";

export default async function HomeItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, feedPage] = await Promise.all([
    getMarketplaceItemDetail(slug),
    getHomeFeedPage({ limit: 8 }),
  ]);

  if (!detail) {
    notFound();
  }

  const relatedItems = feedPage.items.filter((item) => item.id !== detail.item.id);

  return <ItemDetailScreen item={detail.item} relatedItems={relatedItems} seller={detail.seller} />;
}
