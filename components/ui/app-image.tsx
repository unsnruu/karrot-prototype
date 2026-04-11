import Image, { type ImageProps } from "next/image";

export function AppImage(props: ImageProps) {
  const { src, unoptimized, alt, ...rest } = props;
  const shouldBypassOptimization =
    typeof src === "string" &&
    (src.startsWith("/api/item-images/") || src.startsWith("https://www.figma.com/api/mcp/asset/"));

  return (
    <Image
      alt={alt}
      src={src}
      unoptimized={unoptimized ?? shouldBypassOptimization}
      {...rest}
    />
  );
}
