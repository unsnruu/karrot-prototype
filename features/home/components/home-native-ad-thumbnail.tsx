"use client";

import { AppImage } from "@/components/ui/app-image";

const adMarkImage = "https://www.figma.com/api/mcp/asset/65d59106-dae8-4a0d-9173-adb3a3c3dd12";

export function HomeNativeAdThumbnail({
  alt,
  src,
  size,
}: {
  alt: string;
  src: string;
  size: 60 | 100 | 120;
}) {
  const markBoxSize = size === 60 ? 16 : 28;
  const markOffset = size === 60 ? 7 : 8;
  const markImageHeight = size === 60 ? 10 : 17;
  const markImageWidth = size === 60 ? 6 : 10;

  return (
    <div className="relative shrink-0" style={{ height: size, width: size }}>
      <AppImage
        alt={alt}
        className="rounded-[8px] object-cover"
        height={size}
        src={src}
        width={size}
      />
      <span
        className="absolute top-0 inline-flex items-center justify-center rounded-b-[2px] bg-white"
        style={{ height: markBoxSize, left: markOffset, width: markBoxSize }}
      >
        <AppImage
          alt=""
          className="object-contain"
          height={markImageHeight}
          src={adMarkImage}
          width={markImageWidth}
        />
      </span>
    </div>
  );
}
