"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { HomeNativeAdThumbnail } from "@/features/home/components/home-native-ad-thumbnail";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconChevronRight = "/icons/my-karrot/chevron-right.svg";

export function HomeNativeAdBanner({ ad }: { ad: HomeFeedNativeAd }) {
  return (
    <article className="mb-4">
      <Link
        className="flex items-start gap-2 overflow-hidden rounded-[8px] bg-[#2a3038] px-3 py-2"
        href={ad.href}
      >
        <HomeNativeAdThumbnail alt={ad.title} size={60} src={ad.image} />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 self-stretch">
          <h2 className="truncate text-[13px] font-medium leading-[1.4] tracking-[-0.02em] text-white">
            {ad.title.replace(/\n/g, " ")}
          </h2>
          <p className="truncate text-[13px] leading-none text-[#b0b3ba]">{ad.feature}</p>
        </div>

        <span className="flex h-[60px] items-center">
          <AppImage
            alt=""
            className="h-6 w-6 opacity-90 invert"
            height={24}
            src={iconChevronRight}
            width={24}
          />
        </span>
      </Link>
    </article>
  );
}
