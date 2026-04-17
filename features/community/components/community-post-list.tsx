import { ListEmptyState, ListSection } from "@/components/ui/list-section";
import { CommunityPostCard } from "@/features/community/components/community-post-card";
import { type CommunityPost } from "@/lib/community";

type CommunityPostListProps = {
  posts: CommunityPost[];
  emptyMessage?: string;
};

export function CommunityPostList({
  posts,
  emptyMessage = "게시글이 아직 없어요.",
}: CommunityPostListProps) {
  if (posts.length === 0) {
    return (
      <ListEmptyState>
        <p className="text-sm text-[#64748b]">{emptyMessage}</p>
      </ListEmptyState>
    );
  }

  return (
    <ListSection itemsClassName="border-t border-[#eceef2]">
      {posts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </ListSection>
  );
}
