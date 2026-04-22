import { TownMapScreen } from "@/features/town-map/screens/town-map-screen";
import { getTownMapPins } from "@/lib/town-map-business-data";
import { getTownMapBusinessNewsFeedPosts } from "@/lib/town-map-business-news-data";

export default async function TownMapPage() {
  const [pins, newsPosts] = await Promise.all([
    getTownMapPins(),
    getTownMapBusinessNewsFeedPosts(),
  ]);

  return <TownMapScreen newsPosts={newsPosts} pins={pins} />;
}
