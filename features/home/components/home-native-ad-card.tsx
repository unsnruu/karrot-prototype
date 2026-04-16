"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import {
  buildHomeExperimentElementExposedProperties,
  buildHomeExperimentEventProperties,
  buildHomeExperimentTownMapHref,
} from "@/lib/analytics/home-experiment";
import { type HomeExperimentVariant } from "@/lib/home-experiment";
import { type HomeFeedNativeAd } from "@/lib/marketplace";
import { useHomeExperimentImpression } from "@/features/home/components/use-home-experiment-impression";

const iconMore = "/icons/more.svg";
const iconHeart = "/icons/heart.svg";
const adMarkImage = "https://www.figma.com/api/mcp/asset/65d59106-dae8-4a0d-9173-adb3a3c3dd12";

export function HomeNativeAdCard({
  ad,
  index,
  variant,
}: {
  ad: HomeFeedNativeAd;
  index: number;
  variant: HomeExperimentVariant;
}) {
  const eventProperties = buildHomeExperimentEventProperties({
    ad,
    index,
    surface: "inline_card",
    variant,
  });
  const trackedHref = buildHomeExperimentTownMapHref({
    ad,
    index,
    surface: "inline_card",
    variant,
  });
  const impressionRef = useHomeExperimentImpression(
    buildHomeExperimentElementExposedProperties({
      ad,
      index,
      surface: "inline_card",
      variant,
    }),
  );

  return (
    <article className="mb-4 border-b border-[#eceef2] pb-4" ref={impressionRef}>
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
              additionalProperties: {
                ad_destination: ad.destination,
                ad_feature: ad.feature,
                experiment_name: eventProperties.experiment_name,
                experiment_surface: eventProperties.experiment_surface,
                experiment_variant: eventProperties.experiment_variant,
              },
            }),
          );
        }}
      >
        <div className="relative h-[120px] w-[120px] shrink-0">
          <AppImage
            alt={ad.title}
            className="block h-[120px] w-[120px] rounded-[8px] object-cover"
            height={120}
            src={ad.image}
            width={120}
          />
          <span className="absolute left-2 top-0 inline-flex h-7 w-7 items-center justify-center rounded-b-[2px] bg-white">
            <AppImage
              alt=""
              className="h-[17px] w-[10px]"
              height={17}
              src={adMarkImage}
              width={10}
            />
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="flex items-start">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 break-keep text-[16px] font-medium leading-[1.35] tracking-[-0.02em] text-black">
                {ad.title}
              </h2>
              <p className="mt-1 text-[13px] leading-[1.35] text-[#b0b3ba]">{ad.feature}</p>
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
            <span className="inline-flex shrink-0 items-center gap-[2px] text-[#b0b3ba]">
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
  );
}
