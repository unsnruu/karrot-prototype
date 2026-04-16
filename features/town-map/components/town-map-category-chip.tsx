"use client";

import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { type TownMapSearchCategory } from "@/lib/town-map";
import { cn } from "@/lib/utils";

export function TownMapCategoryChip({ category }: { category: TownMapSearchCategory }) {
  const pathname = usePathname();

  return (
    <PendingFeatureLink
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium text-black shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)]",
        category.active ? "bg-gradient-to-b from-white to-[#fff8eb]" : "bg-white",
      )}
      featureLabel={`${category.label} 카테고리 보기`}
      onClick={() => {
        trackEvent(
          "element_clicked",
          buildElementClickedEventProperties({
            screenName: "town_map",
            targetType: "chip",
            targetName: "town_map_category_chip",
            surface: "header",
            path: pathname,
            targetId: category.id,
            additionalProperties: {
              category_label: category.label,
            },
          }),
        );
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
