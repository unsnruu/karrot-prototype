import { AvatarFallback, AvatarImage, AvatarRoot } from "@seed-design/react";
import { cn } from "@/lib/utils";

type SeedUserAvatarExperimentProps = {
  alt: string;
  className?: string;
  fallback?: string;
  imageClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string | null;
};

function resolveSeedAvatarSize(size: NonNullable<SeedUserAvatarExperimentProps["size"]>) {
  if (size === "sm") return "36";
  if (size === "md") return "42";
  if (size === "lg") return "42";
  return "42";
}

export function SeedUserAvatarExperiment({
  alt,
  className,
  fallback,
  imageClassName,
  size = "md",
  src,
}: SeedUserAvatarExperimentProps) {
  return (
    <AvatarRoot className={cn("shrink-0", className)} size={resolveSeedAvatarSize(size)}>
      {src ? <AvatarImage alt={alt} className={cn("object-cover", imageClassName)} src={src} /> : null}
      {fallback ? <AvatarFallback>{fallback}</AvatarFallback> : null}
    </AvatarRoot>
  );
}
