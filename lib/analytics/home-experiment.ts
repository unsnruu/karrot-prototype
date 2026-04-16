"use client";

import { buildElementExposedEventProperties } from "@/lib/analytics/element-exposed";
import { type HomeExperimentVariant } from "@/lib/home-experiment";
import { type HomeFeedNativeAd } from "@/lib/marketplace";

export type HomeExperimentSurface = "inline_card" | "inline_banner" | "top_carousel";

export function buildHomeExperimentEventProperties({
  ad,
  index,
  surface,
  variant,
}: {
  ad: HomeFeedNativeAd;
  index: number;
  surface: HomeExperimentSurface;
  variant: HomeExperimentVariant;
}) {
  return {
    ad_feature: ad.feature,
    ad_destination: ad.destination,
    ad_href: ad.href,
    experiment_name: "home_to_town_map_entry",
    experiment_surface: surface,
    experiment_variant: variant,
    target_id: ad.id,
    target_name: "home_native_ad",
    target_position: index,
    target_type: "ad",
  };
}

export function buildHomeExperimentElementExposedProperties({
  ad,
  index,
  surface,
  variant,
}: {
  ad: HomeFeedNativeAd;
  index: number;
  surface: HomeExperimentSurface;
  variant: HomeExperimentVariant;
}) {
  const experimentProperties = buildHomeExperimentEventProperties({
    ad,
    index,
    surface,
    variant,
  });

  return buildElementExposedEventProperties({
    screenName: "home",
    targetType: "ad",
    targetName: "home_native_ad",
    surface,
    path: "/home",
    targetId: ad.id,
    targetPosition: index,
    additionalProperties: {
      ad_destination: ad.destination,
      ad_feature: ad.feature,
      experiment_name: experimentProperties.experiment_name,
      experiment_surface: experimentProperties.experiment_surface,
      experiment_variant: experimentProperties.experiment_variant,
    },
  });
}

export function buildHomeExperimentTownMapHref({
  ad,
  index,
  surface,
  variant,
}: {
  ad: HomeFeedNativeAd;
  index: number;
  surface: HomeExperimentSurface;
  variant: HomeExperimentVariant;
}) {
  if (!ad.href.startsWith("/town-map")) {
    return ad.href;
  }

  const separator = ad.href.includes("?") ? "&" : "?";

  return `${ad.href}${separator}exp_source=home_experiment&exp_variant=${variant}&exp_surface=${surface}&exp_target_id=${ad.id}&exp_target_position=${index}&exp_target_name=home_native_ad&exp_target_type=ad`;
}
