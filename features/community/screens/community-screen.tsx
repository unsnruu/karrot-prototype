import { BottomNav } from "@/components/navigation/bottom-nav";
import { CafePostList } from "@/features/community/components/cafe-post-list";
import { CommunityHeader } from "@/features/community/components/community-header";
import { CommunityMeetupList } from "@/features/community/components/community-meetup-list";
import { CommunityPostList } from "@/features/community/components/community-post-list";
import { type CafePost, type CommunityMeetup, type CommunityPost, type CommunityTabKey, type CommunityTopicFilterKey } from "@/lib/community";

type CommunityScreenProps = {
  selectedTab: CommunityTabKey;
  selectedTopic: CommunityTopicFilterKey;
  posts: CommunityPost[];
  meetups: CommunityMeetup[];
  cafePosts: CafePost[];
};

export function CommunityScreen({ selectedTab, selectedTopic, posts, meetups, cafePosts }: CommunityScreenProps) {
  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <div className="mobile-shell-wide flex min-h-screen flex-col bg-white pb-24 shadow-none">
        <CommunityHeader selectedTab={selectedTab} selectedTopic={selectedTopic} />

        <section className={`w-full flex-1 pb-28 ${selectedTab === "town" ? "px-4 pt-5" : ""}`}>
          {selectedTab === "town" ? <CommunityPostList posts={posts} /> : null}
          {selectedTab === "meetup" ? <CommunityMeetupList meetups={meetups} /> : null}
          {selectedTab === "cafe" ? <CafePostList posts={cafePosts} /> : null}
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
