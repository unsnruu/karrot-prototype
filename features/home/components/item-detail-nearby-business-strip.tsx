"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { type NearbyTownMapBusinessCard } from "@/lib/town-map-business-data";
import { appendNavigationQuery } from "@/lib/tab-navigation";

export function ItemDetailNearbyBusinessStrip({
  businesses,
  detailHref,
  itemTitle,
  meetupHint,
}: {
  businesses: NearbyTownMapBusinessCard[];
  detailHref: string;
  itemTitle: string;
  meetupHint: string;
}) {
  const pathname = usePathname();

  if (businesses.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-5 pr-4">
        {businesses.map((business, index) => {
          const href = appendNavigationQuery(`/town-map/businesses/${business.id}`, {
            tab: "town-map",
            returnTo: detailHref,
          });

          return (
            <Link
              className="flex w-[247px] shrink-0 snap-start gap-4 rounded-[16px]"
              href={href}
              key={business.id}
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "item_detail",
                    targetType: "card",
                    targetName: "item_detail_nearby_business_card",
                    surface: "content",
                    path: pathname,
                    targetId: business.id,
                    targetPosition: index + 1,
                    destinationPath: href,
                  }),
                );
              }}
            >
              <div className="relative h-[108px] w-[108px] shrink-0 overflow-hidden rounded-[12px] bg-[#f1f3f5]">
                <AppImage
                  alt={business.name}
                  className="object-cover"
                  fill
                  sizes="108px"
                  src={business.image}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
                <div className="min-w-0 leading-[1.5]">
                  <p className="truncate text-[16px] font-semibold text-black">{business.name}</p>
                  <p className="truncate text-[14px] font-medium text-[#868b94]">{business.category}</p>
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex min-w-0 items-center gap-1 text-[13px] leading-none text-[#868b94]">
                    <p className="truncate">{business.townLabel}</p>
                    <span aria-hidden="true">·</span>
                    <p className="truncate">단골 {business.regularCount}</p>
                  </div>

                  <div className="flex items-center gap-0.5 text-[13px] leading-none text-[#ff6f0f]">
                    <StarIcon />
                    <p className="font-semibold">{business.rating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 16 16">
      <path d="M8 1.2 9.8 5l4.2.6-3.1 3 0.7 4.2L8 10.8 4.4 12.8l0.7-4.2-3.1-3L6.2 5 8 1.2Z" />
    </svg>
  );
}
