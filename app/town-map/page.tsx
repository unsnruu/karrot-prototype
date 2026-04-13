import { TownMapScreen } from "@/features/town-map/screens/town-map-screen";
import { getTownMapPins } from "@/lib/town-map-business-data";

export default async function TownMapPage() {
  const pins = await getTownMapPins();

  return <TownMapScreen pins={pins} />;
}
