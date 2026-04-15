"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { trackEvent } from "@/lib/analytics/amplitude";
import { type HomeFeedItem } from "@/lib/marketplace";

const iconMore = "/icons/more.svg";

const PROMOTED_SUBTITLE_PLACEHOLDER = "\u00A0";
const iconLocation = "/icons/location.svg";
const iconChat = "/icons/chat.svg";
const iconHeart = "/icons/heart.svg";

export function MarketplaceListItem({
  item,
  category,
  position,
}: {
  item: HomeFeedItem;
  category?: string;
  position?: number;
}) {
  const isPromoted = Boolean(item.promoted);
  const detailHref = item.href ?? `/home/items/${item.slug}`;

  return (
    <article className="mb-4 border-b border-[#eceef2] pb-4">
      <Link
        className="flex items-start gap-[21px]"
        href={detailHref}
        onClick={() => {
          trackEvent("home_item_clicked", {
            category: category ?? "all",
            destination_path: detailHref,
            is_promoted: isPromoted,
            item_id: item.id,
            item_title: item.title,
            position,
            source: "home_feed",
          });
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={item.title}
          className="block shrink-0 rounded-[8px] object-cover"
          src={item.image}
          style={{
            width: 120,
            height: 120,
            minWidth: 120,
            maxWidth: 120,
            minHeight: 120,
            maxHeight: 120,
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
          <div className="flex items-start">
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 break-keep text-[16px] font-medium leading-[1.35] tracking-[-0.02em] text-black">
                {item.title}
              </h2>

              {isPromoted ? (
                <p className="mt-1 block text-[13px] leading-[1.35] text-[#b0b3ba]">
                  {item.subtitle ?? PROMOTED_SUBTITLE_PLACEHOLDER}
                </p>
              ) : (
                <>
                  <div className="mt-1 flex flex-wrap items-center gap-[4px] text-[13px] font-medium leading-[1.35] text-[#b0b3ba]">
                    <span className="inline-flex items-center gap-px">
                      <AppImage
                        alt=""
                        className="h-4 w-4"
                        height={16}
                        src={iconLocation}
                        width={16}
                      />
                      <span>{item.distance}</span>
                    </span>
                    <span>·</span>
                    <span>{item.town}</span>
                    <span>·</span>
                    <span>{item.postedAt}</span>
                  </div>

                  <p className="mt-0.5 text-[16px] font-bold leading-[1.35] text-black">{item.priceLabel}</p>
                </>
              )}
            </div>

            <span aria-hidden="true" className="ml-2 block h-6 w-6 shrink-0">
              <AppImage
                alt=""
                className="h-6 w-6"
                height={24}
                src={iconMore}
                width={24}
              />
            </span>
          </div>

          <div className="flex justify-end gap-1 text-[13px] text-[#d1d3d8]">
            {!isPromoted ? (
              <span className="inline-flex items-center gap-[2px]">
                <AppImage
                  alt=""
                  className="h-4 w-4"
                  height={16}
                  src={iconChat}
                  width={16}
                />
                <span className="text-[#b0b3ba]">{item.chats}</span>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-[2px]">
              <AppImage
                alt=""
                className="h-4 w-4"
                height={16}
                src={iconHeart}
                width={16}
              />
              <span className="text-[#b0b3ba]">{item.likes}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
