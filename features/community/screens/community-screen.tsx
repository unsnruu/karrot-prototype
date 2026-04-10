import { BottomNav } from "@/components/navigation/bottom-nav";
import { type CommunityPost } from "@/lib/community";
import { CommunityBannerLink } from "@/features/community/components/community-banner-link";
import { CommunityHeader } from "@/features/community/components/community-header";
import { CommunityPostCard } from "@/features/community/components/community-post-card";

export function CommunityScreen({ posts }: { posts: CommunityPost[] }) {
  return (
    <main className="min-h-screen bg-[#eef2f6] text-[#111827]">
      <div className="min-h-screen bg-white pb-24">
        <CommunityHeader />

        <section className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
          <CommunityBannerLink />

          <div className="mt-4 grid border-t border-[#eceef2] lg:grid-cols-2 lg:gap-x-8">
            {posts.map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
