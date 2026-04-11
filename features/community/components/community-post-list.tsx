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
      <div className="flex min-h-[240px] items-center justify-center px-4 py-12 text-center">
        <p className="text-sm text-[#64748b]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid border-t border-[#eceef2] lg:grid-cols-2 lg:gap-x-8">
      {posts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
