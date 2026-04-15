import { MyKarrotScreen } from "@/features/my-karrot/screens/my-karrot-screen";
import { isHomeExperimentVariant } from "@/lib/home-experiment";
import { notFound } from "next/navigation";

export default async function ExperimentMyKarrotPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;

  if (!isHomeExperimentVariant(variant)) {
    notFound();
  }

  return <MyKarrotScreen />;
}
