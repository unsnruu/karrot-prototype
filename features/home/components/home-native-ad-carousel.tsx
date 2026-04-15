"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { HomeNativeAdThumbnail } from "@/features/home/components/home-native-ad-thumbnail";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconMore = "/icons/more.svg";
const iconHeart = "/icons/heart.svg";

export function HomeNativeAdCarousel({ ads }: { ads: HomeFeedNativeAd[] }) {
  if (!ads.length) {
    return null;
  }

  return (
    <section className="mb-3 overflow-x-auto px-4 pb-1 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
      <div className="flex gap-2">
        {ads.map((ad) => (
          <article className="w-[320px] shrink-0 rounded-[8px] bg-[#eeeff1] p-2" key={ad.id}>
            <Link className="flex items-start gap-[21px]" href={ad.href}>
              <HomeNativeAdThumbnail alt={ad.title} size={100} src={ad.image} />

              <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 break-keep text-[16px] font-medium leading-[1.4] tracking-[-0.02em] text-black">
                      {ad.title}
                    </h2>
                    <p className="mt-1 text-[13px] leading-[1.35] text-[#868b94]">{ad.feature}</p>
                  </div>

                  <span aria-hidden="true" className="ml-2 block h-6 w-6 shrink-0">
                    <AppImage
                      alt=""
                      className="h-6 w-6"
                      height={24}
                      src={iconMore}
                      width={24}
                    />
                  </span>
                </div>

                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-[2px] text-[#b0b3ba]">
                    <AppImage
                      alt=""
                      className="h-4 w-4"
                      height={16}
                      src={iconHeart}
                      width={16}
                    />
                    <span className="text-[13px] leading-none">{ad.likes}</span>
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
