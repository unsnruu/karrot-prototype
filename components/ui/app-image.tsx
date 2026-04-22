"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const TRANSPARENT_IMAGE_DATA_URI =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const DEFAULT_IMAGE_FALLBACK_SRC = "/images/fallback-placeholder.webp";

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

export function resolveFallbackSrc(src: ImageProps["src"], alt: string) {
  if (typeof src !== "string") {
    return src;
  }

  return alt.trim().length === 0 ? TRANSPARENT_IMAGE_DATA_URI : DEFAULT_IMAGE_FALLBACK_SRC;
}

export function AppImage(props: ImageProps) {
  const { src, unoptimized, alt, ...rest } = props;
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const shouldBypassOptimization =
    typeof currentSrc === "string" && shouldBypassImageOptimization(currentSrc);

  return (
    <Image
      alt={alt}
      onError={() => {
        setCurrentSrc((previousSrc) => {
          const fallbackSrc = resolveFallbackSrc(previousSrc, alt);
          return previousSrc === fallbackSrc ? previousSrc : fallbackSrc;
        });
      }}
      src={currentSrc}
      unoptimized={unoptimized ?? shouldBypassOptimization}
      {...rest}
    />
  );
}
