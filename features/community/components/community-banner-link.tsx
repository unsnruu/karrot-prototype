"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { communityBanner } from "@/lib/community";

export function CommunityBannerLink() {
  const pathname = usePathname();

  return (
    <Link
      className="flex items-center gap-[7px] rounded-[12px] bg-[#eff6ff] px-4 py-5"
      href="/town-map"
      onClick={() => {
        trackEvent(
          "element_clicked",
          buildElementClickedEventProperties({
            screenName: "community",
            targetType: "banner",
            targetName: "community_town_map_banner",
            surface: "meetup_banner",
            path: pathname,
            destinationPath: "/town-map",
          }),
        );
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[1.4] text-black">
          {communityBanner.title}
          <br />
          {communityBanner.description}
        </p>
        <div className="mt-[7px] flex items-center gap-1">
          <span className="text-[12px] font-bold text-black">{communityBanner.ctaLabel}</span>
          <span className="text-[24px] font-semibold leading-none text-black">›</span>
        </div>
      </div>
      <AppImage
        alt="동네지도 안내"
        className="h-[72px] w-[72px] shrink-0 object-contain"
        height={72}
        src={communityBanner.image}
        width={72}
      />
    </Link>
  );
}
