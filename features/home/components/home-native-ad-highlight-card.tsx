"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { buildHomeExperimentTownMapHref } from "@/lib/analytics/home-experiment";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconMore = "/icons/more.svg";
const iconHeart = "/icons/heart.svg";

export function HomeNativeAdHighlightCard({
  ad,
  index,
}: {
  ad: HomeFeedNativeAd;
  index: number;
}) {
  const trackedHref = buildHomeExperimentTownMapHref({
    ad,
    index,
    surface: "inline_card",
  });

  return (
    <article className="mb-4 rounded-[8px] bg-[#ffe8db] p-2">
      <Link
        className="flex items-start gap-[21px]"
        href={trackedHref}
        onClick={() => {
          trackEvent(
            "element_clicked",
            buildElementClickedEventProperties({
              screenName: "home",
              targetType: "card",
              targetName: "home_native_ad",
              surface: "inline_card",
              path: "/home",
              targetId: ad.id,
              targetPosition: index,
              destinationPath: trackedHref,
            }),
          );
        }}
      >
        <AppImage
          alt={ad.title}
          className="block h-[120px] w-[120px] shrink-0 rounded-[8px] object-cover"
          height={120}
          src={ad.image}
          width={120}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="flex items-start">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 break-keep text-[16px] font-medium leading-[1.35] tracking-[-0.02em] text-black">
                {ad.title}
              </h2>
              <p className="mt-1 text-[13px] leading-[1.35] text-[#b0b3ba]">{ad.feature}</p>
            </div>

            <span aria-hidden="true" className="ml-2 block h-6 w-6 shrink-0">
              <AppImage alt="" className="h-6 w-6" height={24} src={iconMore} width={24} />
            </span>
          </div>

          <div className="flex justify-end">
            <span className="inline-flex shrink-0 items-center gap-[2px] text-[#b0b3ba]">
              <AppImage alt="" className="h-4 w-4" height={16} src={iconHeart} width={16} />
              <span className="text-[13px] leading-none">{ad.likes}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
