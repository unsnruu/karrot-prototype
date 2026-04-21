import { BottomNav } from "@/components/navigation/bottom-nav";
import { HomeFeed } from "@/features/home/components/home-feed";
import { HomeFab } from "@/features/home/components/home-fab";
import { HomeHeader } from "@/features/home/components/home-header";
import { getHomeCategories, getHomeFeedPage } from "@/lib/marketplace-data";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategory = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category;
  const [{ items, hasMore, nextOffset }, categories] = await Promise.all([
    getHomeFeedPage({ category: selectedCategory }),
    getHomeCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <div className="min-h-screen bg-white pb-[84px]">
        <HomeHeader categories={categories} selectedCategory={selectedCategory} />

        <section className="mobile-shell-wide px-4 pb-6 pt-4 sm:px-6">
          <div className="rounded-[28px] bg-white lg:px-2">
            <HomeFeed
              category={selectedCategory}
              initialHasMore={hasMore}
              initialItems={items}
              initialNextOffset={nextOffset}
              key={selectedCategory ?? "all"}
            />
          </div>
        </section>

        <HomeFab />
        <BottomNav />
      </div>
    </main>
  );
}
