import { ListEmptyState, ListSection } from "@/components/ui/list-section";
import { CafePostCard } from "@/features/community/components/cafe-post-card";
import { cafeSectionTitle, type CafePost } from "@/lib/community";

type CafePostListProps = {
  posts: CafePost[];
  emptyMessage?: string;
};

export function CafePostList({
  posts,
  emptyMessage = "카페 인기글이 아직 없어요.",
}: CafePostListProps) {
  return (
    <ListSection
      className="bg-white px-4 py-6"
      empty={
        posts.length === 0 ? (
          <ListEmptyState bordered>
            <p className="text-sm text-[#64748b]">{emptyMessage}</p>
          </ListEmptyState>
        ) : undefined
      }
      title={cafeSectionTitle}
    >
      {posts.map((post) => (
        <CafePostCard key={post.id} post={post} />
      ))}
    </ListSection>
  );
}
