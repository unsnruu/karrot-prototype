import { type HomeFeedNativeAd } from "@/lib/marketplace";

export type HomeExperimentSurface = "inline_card" | "inline_banner" | "top_carousel";

export function buildHomeExperimentTownMapHref({
  ad,
  index,
  surface,
}: {
  ad: HomeFeedNativeAd;
  index: number;
  surface: HomeExperimentSurface;
}) {
  if (!ad.href.startsWith("/town-map")) {
    return ad.href;
  }

  const separator = ad.href.includes("?") ? "&" : "?";

  return `${ad.href}${separator}entry_source=home_native_ad&entry_surface=${surface}&entry_target_id=${ad.id}&entry_target_position=${index}&entry_target_name=home_native_ad&entry_target_type=ad`;
}
