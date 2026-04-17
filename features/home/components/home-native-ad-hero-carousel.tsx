"use client";

import Link from "next/link";
import { useRef } from "react";
import { AppImage } from "@/components/ui/app-image";
import { useHomeExperimentImpression } from "@/features/home/components/use-home-experiment-impression";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import {
  buildHomeExperimentElementExposedProperties,
  buildHomeExperimentEventProperties,
  buildHomeExperimentTownMapHref,
} from "@/lib/analytics/home-experiment";
import { type HomeExperimentVariant } from "@/lib/home-experiment";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

const iconMore = "/icons/more.svg";
const heroCardBackgrounds = ["#ffe8db", "#f3f4f5", "#fdefb9"] as const;

function HomeNativeAdHeroCarouselItem({
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
  const impressionRef = useHomeExperimentImpression(
    buildHomeExperimentElementExposedProperties({
      ad,
      index,
      surface: "top_carousel",
      variant,
    }),
  );

  return (
    <article
      className="shrink-0 rounded-[8px] p-3"
      ref={impressionRef}
      style={{
        backgroundColor: heroCardBackgrounds[index % heroCardBackgrounds.length],
        width: "80vw",
      }}
    >
      <Link
        className="flex items-start gap-3"
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
        <AppImage
          alt={ad.title}
          className="h-20 w-20 shrink-0 rounded-[6px] object-cover"
          height={80}
          src={ad.image}
          width={80}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 self-stretch">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-none text-[#6b7280]">{ad.feature}</p>
            </div>

            <AppImage alt="" className="h-6 w-6 shrink-0" height={24} src={iconMore} width={24} />
          </div>

          <h2 className="line-clamp-2 break-keep text-[14px] font-semibold leading-[1.4] tracking-[-0.02em] text-[#1a1c20]">
            {ad.title}
          </h2>
        </div>
      </Link>
    </article>
  );
}

export function HomeNativeAdHeroCarousel({
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
      className="-mx-4 mb-4 overflow-x-auto px-4 pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6"
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
          <HomeNativeAdHeroCarouselItem ad={ad} index={index} key={ad.id} variant={variant} />
        ))}
        <div aria-hidden="true" className="h-px w-4 shrink-0" />
      </div>
    </section>
  );
}
