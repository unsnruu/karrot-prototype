import { TownMapScreen } from "@/features/town-map/screens/town-map-screen";
import { isHomeExperimentVariant } from "@/lib/home-experiment";
import { getTownMapPins } from "@/lib/town-map-business-data";
import { notFound } from "next/navigation";

export default async function ExperimentTownMapPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;

  if (!isHomeExperimentVariant(variant)) {
    notFound();
  }

  const pins = await getTownMapPins();

  return <TownMapScreen pins={pins} />;
}
