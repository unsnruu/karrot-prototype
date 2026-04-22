"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { appendNavigationQuery } from "@/lib/tab-navigation";
import { type TownMapBusinessNewsFeedPost } from "@/lib/town-map-business-news";

export function TownMapPostCard({ post }: { post: TownMapBusinessNewsFeedPost }) {
  const pathname = usePathname();
  const href = appendNavigationQuery(`/town-map/businesses/${post.businessId}`, { tab: "town-map" });
  const secondaryImageSrc =
    post.businessImageSrc && post.businessImageSrc !== post.imageSrc ? post.businessImageSrc : null;

  return (
    <Link
      className="flex flex-col gap-2"
      href={href}
      onClick={() => {
        trackEvent(
          "element_clicked",
          buildElementClickedEventProperties({
            screenName: "town_map",
            targetType: "card",
            targetName: "town_map_post_card",
            surface: "bottom_sheet",
            path: pathname,
            targetId: post.id,
            destinationPath: href,
          }),
        );
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          {post.businessImageSrc ? (
            <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <AppImage alt="" className="object-cover" fill sizes="20px" src={post.businessImageSrc} />
            </div>
          ) : (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffefe4] text-[10px] font-bold text-[#ff7a00]">
              소식
            </div>
          )}
          <span className="text-[14px] font-semibold leading-[1.5] text-black">{post.businessName}</span>
          <div className="flex min-w-0 items-center gap-1 text-[13px] leading-none text-[#b0b3ba]">
            <span className="truncate">{post.businessCategory}</span>
            <span>·</span>
            <span className="shrink-0">{post.postedAtLabel}</span>
          </div>
        </div>

        <div className="min-w-0 text-black">
          <h2 className="mt-2 text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-black">{post.title}</h2>
          <p
            className="mt-0.5 overflow-hidden whitespace-pre-line text-[16px] leading-[1.5] text-black"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {post.body}
          </p>
        </div>
      </div>

      {post.imageSrc ? (
        <div className="grid h-40 grid-cols-2 gap-[2px] overflow-hidden rounded-[20px]">
          <div className="relative h-40 overflow-hidden rounded-l-[20px]">
            <AppImage alt={`${post.businessName} 소식 이미지`} className="object-cover" fill sizes="50vw" src={post.imageSrc} />
          </div>
          {secondaryImageSrc ? (
            <div className="relative h-40 overflow-hidden rounded-r-[20px]">
              <AppImage alt={`${post.businessName} 대표 이미지`} className="object-cover" fill sizes="50vw" src={secondaryImageSrc} />
            </div>
          ) : (
            <div className="relative h-40 overflow-hidden rounded-r-[20px]">
              <AppImage alt={`${post.businessName} 소식 이미지`} className="object-cover" fill sizes="50vw" src={post.imageSrc} />
            </div>
          )}
        </div>
      ) : null}
    </Link>
  );
}
