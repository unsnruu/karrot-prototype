"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { useExposureTracking } from "@/lib/analytics/exposure";
import { type NearbyTownMapBusinessCard } from "@/lib/town-map-business-data";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import { ChevronRightIcon } from "@/features/home/components/item-detail-icons";
import { type ItemDetailNearbyBusinessVariant } from "@/lib/analytics/visitor-experiment";

export function ItemDetailNearbyBusinessStrip({
  businesses,
  detailHref,
  meetupHint,
  variant,
}: {
  businesses: NearbyTownMapBusinessCard[];
  detailHref: string;
  meetupHint: string;
  variant: ItemDetailNearbyBusinessVariant;
}) {
  const pathname = usePathname();
  const hasTrackedInteraction = useRef(false);
  const exposureRef = useExposureTracking<HTMLElement>({
    eventType: "component_exposed",
    eventProperties: {
      component_name: "item_detail_nearby_business_carousel",
      screen_name: "item_detail",
      surface: "content",
      path: pathname,
    },
    threshold: 0,
  });

  if (businesses.length === 0) {
    return null;
  }

  const browseHref = appendNavigationQuery("/town-map", {
    tab: "town-map",
    returnTo: detailHref,
  });
  const isOrangeButtonVariant = variant === "cta_button_color_change_orange";
  const isNeutralButtonVariant = variant === "cta_button_color_change_neutral";

  return (
    <section className="space-y-3" ref={exposureRef}>
      <h2 className="text-[18px] font-bold leading-none text-black">거래 장소 근처의 방문할 만한 곳이에요</h2>

      <div
        className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          if (hasTrackedInteraction.current || event.currentTarget.scrollLeft <= 8) {
            return;
          }

          hasTrackedInteraction.current = true;
          trackEvent("component_interacted", {
            component_name: "item_detail_nearby_business_carousel",
            interaction_type: "scroll",
            screen_name: "item_detail",
            surface: "content",
          });
        }}
      >
        <div className="flex min-w-max gap-5 pr-4">
          {businesses.map((business, index) => {
            const href = appendNavigationQuery(`/town-map/businesses/${business.id}`, {
              tab: "town-map",
              returnTo: detailHref,
            });

            return (
              <Link
                className="flex w-[203px] shrink-0 snap-start items-start gap-4 rounded-[16px]"
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
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#f1f3f5]">
                  <AppImage alt={business.name} className="object-cover" fill sizes="64px" src={business.image} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="min-w-0 leading-[1.5]">
                    <p className="truncate text-[16px] font-semibold text-black">{business.name}</p>
                    <p className="truncate text-[13px] font-medium leading-[1.5] text-[#868b94]">{business.category}</p>
                  </div>

                  <div className="flex items-center gap-0.5 text-[13px] leading-none text-[#ff6f0f]">
                    <StarIcon />
                    <p className="font-semibold">{business.rating.toFixed(1)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#1a1c20]">
          <span className="font-semibold">{meetupHint} </span>
          <span>근처에서 다른 장소도 함께 둘러보세요</span>
        </p>

        <Link
          className={
            isOrangeButtonVariant
              ? "inline-flex shrink-0 items-center rounded-full bg-[#ff6600] py-[6px] pl-[14px] pr-[10px] text-[13px] font-semibold leading-[1.5] text-white"
              : isNeutralButtonVariant
                ? "inline-flex shrink-0 items-center rounded-full bg-[#2a3038] py-[6px] pl-[14px] pr-[10px] text-[13px] font-semibold leading-[1.5] text-white"
                : "inline-flex shrink-0 items-center rounded-full border border-black/10 bg-white py-[6px] pl-[14px] pr-[10px] text-[13px] font-medium leading-[1.5] text-black"
          }
          href={browseHref}
          onClick={() => {
            trackEvent(
              "element_clicked",
              buildElementClickedEventProperties({
                screenName: "item_detail",
                targetType: "button",
                targetName: "item_detail_nearby_business_browse_button",
                surface: "content",
                path: pathname,
                destinationPath: browseHref,
              }),
            );
          }}
        >
          <span>구경하기</span>
          <ChevronRightIcon className="ml-0.5 h-6 w-6" />
        </Link>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 16 16">
      <path d="M8 1.2 9.8 5l4.2.6-3.1 3 0.7 4.2L8 10.8 4.4 12.8l0.7-4.2-3.1-3L6.2 5 8 1.2Z" />
    </svg>
  );
}
