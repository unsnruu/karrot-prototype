"use client";

import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import { type TownMapQuickAction } from "@/lib/town-map";

export function TownMapQuickActionCard({ action }: { action: TownMapQuickAction }) {
  return (
    <PendingFeatureLink
      className="flex flex-col items-center gap-2 text-center"
      featureLabel={action.label}
      onClick={() => {
        trackEvent("town_map_quick_action_clicked", {
          action_id: action.id,
          action_label: action.label,
          source: "town_map_bottom_sheet",
        });
      }}
      returnTo="/town-map"
    >
      <div className="relative h-[58px] w-[68px] overflow-hidden rounded-[19px] border border-black/10 bg-white">
        <AppImage alt={action.label} className="object-cover" fill sizes="68px" src={action.image} />
      </div>
      <span className="text-[13px] font-semibold leading-[1.25] text-black">{action.label}</span>
    </PendingFeatureLink>
  );
}
