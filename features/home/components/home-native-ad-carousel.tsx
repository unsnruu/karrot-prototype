"use client";

import Link from "next/link";
import { useRef } from "react";
import { AppImage } from "@/components/ui/app-image";
import { HomeNativeAdThumbnail } from "@/features/home/components/home-native-ad-thumbnail";
import { useHomeExperimentImpression } from "@/features/home/components/use-home-experiment-impression";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { buildHomeExperimentEventProperties, buildHomeExperimentTownMapHref } from "@/lib/analytics/home-experiment";
import { type HomeExperimentVariant } from "@/lib/home-experiment";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconMore = "/icons/more.svg";
const iconHeart = "/icons/heart.svg";

function HomeNativeAdCarouselItem({
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
    surface: "top_carousel",
    variant,
  });
  const trackedHref = buildHomeExperimentTownMapHref({
    ad,
    index,
    surface: "top_carousel",
    variant,
  });
  const impressionRef = useHomeExperimentImpression(eventProperties);

  return (
    <article className="w-[320px] shrink-0 rounded-[8px] bg-[#eeeff1] p-2" ref={impressionRef}>
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
              surface: "top_carousel",
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
  );
}

export function HomeNativeAdCarousel({
  ads,
  variant,
}: {
  ads: HomeFeedNativeAd[];
  variant: HomeExperimentVariant;
}) {
  const hasTrackedInteraction = useRef(false);

  if (!ads.length) {
    return null;
  }

  return (
    <section
      className="mb-3 overflow-x-auto px-4 pb-1 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6"
      onScroll={(event) => {
        if (hasTrackedInteraction.current || event.currentTarget.scrollLeft <= 8) {
          return;
        }

        hasTrackedInteraction.current = true;
        trackEvent("home_experiment_carousel_interacted", {
          ad_count: ads.length,
          experiment_name: "home_to_town_map_entry",
          experiment_surface: "top_carousel",
          experiment_variant: variant,
        });
      }}
    >
      <div className="flex gap-2">
        {ads.map((ad, index) => (
          <HomeNativeAdCarouselItem ad={ad} index={index} key={ad.id} variant={variant} />
        ))}
      </div>
    </section>
  );
}
