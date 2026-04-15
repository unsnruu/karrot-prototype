import { isHomeExperimentVariant } from "@/lib/home-experiment";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ExperimentEntryPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;

  if (!isHomeExperimentVariant(variant)) {
    notFound();
  }

  redirect(`/exp/${variant}/home`);
}
