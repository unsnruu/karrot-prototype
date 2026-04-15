import Image, { type ImageProps } from "next/image";

export function AppImage(props: ImageProps) {
  const { src, unoptimized, alt, ...rest } = props;
  const shouldBypassOptimization =
    typeof src === "string" &&
    (
      src.startsWith("/api/item-images/")
      || src.startsWith("https://www.figma.com/api/mcp/asset/")
      || /^https:\/\/[^/]*supabase\.co\/storage\/v1\/object\/public\//.test(src)
    );

  return (
    <Image
      alt={alt}
      src={src}
      unoptimized={unoptimized ?? shouldBypassOptimization}
      {...rest}
    />
  );
}
