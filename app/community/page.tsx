import { CommunityScreen } from "@/features/community/screens/community-screen";
import { getCommunityPosts } from "@/lib/server-data";

export default async function CommunityPage() {
  const posts = await getCommunityPosts();

  return <CommunityScreen posts={posts} />;
}
