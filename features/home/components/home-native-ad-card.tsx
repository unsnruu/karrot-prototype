"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconHeart = "/icons/heart.svg";

export function HomeNativeAdCard({ ad }: { ad: HomeFeedNativeAd }) {
  return (
    <article className="mb-4 rounded-[16px] border border-[#cccccc] bg-white p-5">
      <Link className="flex items-start gap-[21px]" href={ad.href}>
        <AppImage
          alt={ad.title}
          className="block h-[120px] w-[120px] shrink-0 rounded-[10px] object-cover"
          height={120}
          src={ad.image}
          width={120}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="min-w-0">
            <h2 className="line-clamp-2 break-keep text-[16px] font-medium leading-[1.4] tracking-[-0.02em] text-black sm:text-[20px]">
              {ad.title}
            </h2>
            <p className="mt-1 text-[13px] leading-[1.35] text-[#b0b3ba] sm:text-[16px]">{ad.feature}</p>
          </div>

          <div className="flex justify-end">
            <span className="inline-flex items-center gap-[2px] text-[#b0b3ba]">
              <AppImage
                alt=""
                className="h-4 w-4 sm:h-5 sm:w-5"
                height={20}
                src={iconHeart}
                width={20}
              />
              <span className="text-[13px] leading-none sm:text-[16px]">{ad.likes}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
