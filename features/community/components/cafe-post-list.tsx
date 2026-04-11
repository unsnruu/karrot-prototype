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
    <section className="mt-6">
      <h2 className="mb-5 text-[22px] font-bold tracking-[-0.03em] text-black">{cafeSectionTitle}</h2>

      {posts.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-[#dbe1ea] px-4 py-12 text-center">
          <p className="text-sm text-[#64748b]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {posts.map((post) => (
            <CafePostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
