"use client";

import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import { type TownMapSearchCategory } from "@/lib/town-map";
import { cn } from "@/lib/utils";

export function TownMapCategoryChip({ category }: { category: TownMapSearchCategory }) {
  return (
    <PendingFeatureLink
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium text-black shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)]",
        category.active ? "bg-gradient-to-b from-white to-[#fff8eb]" : "bg-white",
      )}
      featureLabel={`${category.label} 카테고리 보기`}
      onClick={() => {
        trackEvent("town_map_category_selected", {
          category_id: category.id,
          category_label: category.label,
          source: "town_map_screen",
        });
      }}
      returnTo="/town-map"
    >
      <span className="relative h-4 w-4 shrink-0">
        <AppImage alt="" className="object-contain" fill sizes="16px" src={category.icon} />
      </span>
      <span>{category.label}</span>
    </PendingFeatureLink>
  );
}
