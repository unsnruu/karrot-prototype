import { BottomNav } from "@/components/navigation/bottom-nav";
import { CafePostList } from "@/features/community/components/cafe-post-list";
import { CommunityHeader } from "@/features/community/components/community-header";
import { CommunityMeetupList } from "@/features/community/components/community-meetup-list";
import { CommunityPostList } from "@/features/community/components/community-post-list";
import { type CafePost, type CommunityMeetup, type CommunityPost, type CommunityTabKey } from "@/lib/community";

type CommunityScreenProps = {
  selectedTab: CommunityTabKey;
  posts: CommunityPost[];
  meetups: CommunityMeetup[];
  cafePosts: CafePost[];
};

export function CommunityScreen({ selectedTab, posts, meetups, cafePosts }: CommunityScreenProps) {
  return (
    <main className="min-h-screen bg-[#eef2f6] text-[#111827]">
      <div className="min-h-screen bg-white pb-24">
        <CommunityHeader selectedTab={selectedTab} />

        <section className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
          {selectedTab === "town" ? <CommunityPostList posts={posts} /> : null}
          {selectedTab === "meetup" ? <CommunityMeetupList meetups={meetups} /> : null}
          {selectedTab === "cafe" ? <CafePostList posts={cafePosts} /> : null}
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
