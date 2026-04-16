import { homeExperimentVariants, isHomeExperimentVariant } from "@/lib/home-experiment";
import { notFound, redirect } from "next/navigation";

export function generateStaticParams() {
  return homeExperimentVariants.map((variant) => ({ variant }));
}

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
