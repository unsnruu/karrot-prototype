import { AppImage } from "@/components/ui/app-image";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  alt: string;
  className?: string;
  fallback?: string;
  imageClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string | null;
};

export function UserAvatar({
  alt,
  className,
  fallback,
  imageClassName,
  size = "md",
  src,
}: UserAvatarProps) {
  const sizeClassName =
    size === "sm"
      ? "h-8 w-8 text-[11px]"
      : size === "md"
        ? "h-10 w-10 text-[13px]"
        : size === "lg"
          ? "h-11 w-11 text-[13px]"
          : "h-[42px] w-[42px] text-[13px]";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-[#e5e7eb] text-[#6b7280]",
        sizeClassName,
        className,
      )}
    >
      {src ? (
        <AppImage
          alt={alt}
          className={cn("object-cover", imageClassName)}
          fill
          sizes={size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "44px" : "42px"}
          src={src}
        />
      ) : fallback ? (
        <span className="flex h-full w-full items-center justify-center font-bold">
          {fallback}
        </span>
      ) : null}
    </div>
  );
}
