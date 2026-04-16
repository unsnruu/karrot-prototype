import Image, { type ImageProps } from "next/image";

export function shouldBypassImageOptimization(src: string) {
  if (src.startsWith("https://www.figma.com/api/mcp/asset/")) {
    return true;
  }

  try {
    const { pathname } = new URL(src);
    return pathname.includes("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

export function AppImage(props: ImageProps) {
  const { src, unoptimized, alt, ...rest } = props;
  const shouldBypassOptimization =
    typeof src === "string" && shouldBypassImageOptimization(src);

  return (
    <Image
      alt={alt}
      src={src}
      unoptimized={unoptimized ?? shouldBypassOptimization}
      {...rest}
    />
  );
}
