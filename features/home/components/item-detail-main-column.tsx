"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import {
  BellIcon,
  ChevronRightIcon,
  InfoIcon,
} from "@/features/home/components/item-detail-icons";
import { ItemDetailKakaoMap } from "@/features/home/components/item-detail-kakao-map";
import { formatPrice, type HomeFeedItem, type MarketplaceItem, type SellerProfile } from "@/lib/marketplace";

function SellerSection({ seller }: { seller: SellerProfile }) {
  const sellerTemperature = `${seller.mannerScore.toFixed(1)}°C`;
  return (
    <section className="border-b border-black/10 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-[6px]">
          <AppImage
            alt={seller.name}
            className="h-[42px] w-[42px] rounded-full border border-black/10 object-cover"
            height={42}
            src={seller.avatar}
            width={42}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-medium leading-none text-black">{seller.name}</p>
            <p className="mt-1 text-[13px] leading-none text-[#898991]">{seller.town}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-0.5">
            <p className="text-base font-semibold leading-none text-[#ff6f0f]">{sellerTemperature}</p>
            <span aria-hidden="true" className="text-xl leading-none">
              😊
            </span>
          </div>
          <p className="text-xs text-[#8b8c91] underline underline-offset-2">매너온도</p>
        </div>
      </div>
    </section>
  );
}

function ItemBodySection({ item }: { item: MarketplaceItem }) {
  const categoryLabel = item.sellingPoints[0] ?? item.condition;
  const locationHref = item.slug ? `/home/items/${item.slug}/location` : `/home/items/${item.id}/location`;
  const hasMeetupLocation = item.meetupLat != null && item.meetupLng != null && Boolean(item.meetupHint.trim());
  return (
    <section className="py-6">
      <div className="space-y-4">
        <h1 className="max-w-[16ch] text-[22px] font-bold leading-[1.35] tracking-[-0.03em] text-black sm:text-[26px]">
          {item.title}
        </h1>
        <p className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-black sm:text-[26px]">
          {formatPrice(item.priceLabel)}
        </p>
        <p className="text-sm leading-none text-[#8b8c91] sm:text-[15px]">
          {categoryLabel} · {item.postedAt}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <p className="whitespace-pre-line text-[16px] leading-[1.7] text-black sm:text-[17px]">{item.description}</p>

        {hasMeetupLocation ? (
          <Link className="block space-y-3" href={locationHref}>
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2">
              <p className="text-base font-semibold leading-none text-black">거래 희망 장소</p>
              <span className="flex items-center text-base leading-none text-black">
                <span>{item.meetupHint}</span>
                <ChevronRightIcon className="ml-0.5" />
              </span>
            </div>

            <ItemDetailKakaoMap
              lat={item.meetupLat}
              lng={item.meetupLng}
              meetupAddress={item.meetupAddress}
              meetupHint={item.meetupHint}
              title={item.title}
            />

            <p className="text-[13px] leading-none text-[#1d1c21]">{item.distance} 근처에서 거래할 수 있어요</p>
          </Link>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-[13px] leading-none text-[#8b8c91]">
        <span>채팅 {item.chats}</span>
        <span>·</span>
        <span>관심 {item.likes}</span>
        <span>·</span>
        <span>조회 {Math.max(170, item.likes * 7 + item.chats * 2)}</span>
      </div>

      <PendingFeatureLink
        className="mt-5 inline-flex text-sm leading-none text-[#8b8c91] underline underline-offset-2"
        featureLabel="게시글 신고하기"
        returnTo="/home"
      >
        이 게시글 신고하기
      </PendingFeatureLink>
    </section>
  );
}

function RecommendationsSection({ items }: { items: HomeFeedItem[] }) {
  if (items.length === 0) return null;
  const firstRecommendationHref = `/home/items/${items[0].slug}`;

  return (
    <section className="py-7">
      <Link className="flex items-center justify-between" href={firstRecommendationHref}>
        <h2 className="text-[18px] font-bold leading-none text-black">다른 물품 보러가기</h2>
        <ChevronRightIcon className="text-black" />
      </Link>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5">
        {items.map((relatedItem) => (
          <Link className="space-y-3" href={`/home/items/${relatedItem.slug}`} key={relatedItem.id}>
            <AppImage
              alt={relatedItem.title}
              className="aspect-[1.32/1] w-full rounded-[12px] object-cover"
              height={180}
              src={relatedItem.image}
              width={240}
            />
            <div className="space-y-2">
              <p className="truncate text-sm leading-none text-black">{relatedItem.title}</p>
              <p className="text-sm font-bold leading-none text-black">{relatedItem.priceLabel ?? "가격 문의"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ItemDetailMainColumn({
  item,
  seller,
  adItem,
  recommendationItems,
}: {
  item: MarketplaceItem;
  seller: SellerProfile;
  adItem?: HomeFeedItem;
  recommendationItems: HomeFeedItem[];
}) {
  return (
    <div className="min-w-0">
      <SellerSection seller={seller} />
      <ItemBodySection item={item} />
      {adItem ? (
        <section className="py-3">
          <ItemDetailAdCard item={adItem} />
        </section>
      ) : null}
      <RecommendationsSection items={recommendationItems} />
      <section className="flex items-start gap-5 pb-[134px] pt-2">
        <KeywordAlert itemTitle={item.title} />
      </section>
    </div>
  );
}

export function ItemDetailAdCard({ item }: { item: HomeFeedItem }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1">
        <h2 className="text-[18px] font-bold leading-none text-black">혹시 이 상품 찾으시나요?</h2>
        <span className="text-[18px] font-bold leading-none text-black">·</span>
        <span className="text-[18px] font-bold leading-none text-black">광고</span>
        <InfoIcon className="ml-0.5" />
      </div>

      <article className="flex gap-[18px]">
        <AppImage
          alt={item.title}
          className="h-[108px] w-[108px] rounded-[8px] border border-black/10 object-cover"
          height={108}
          src={item.image}
          width={108}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-base leading-[1.35] text-black">{item.title}</p>
            <p className="mt-2 text-[13px] leading-none text-[#878a8f]">쿠팡</p>
            <p className="mt-2 text-base font-bold leading-none text-black">{item.priceLabel ?? "가격 문의"}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export function KeywordAlert({ itemTitle }: { itemTitle: string }) {
  return (
    <>
      <p className="flex-1 text-sm leading-[1.5] text-black">
        이웃들이 <span className="font-semibold">{itemTitle.split(" ")[0]}</span> 게시글 올리면 바로 알려드릴까요?
      </p>
      <PendingFeatureLink
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f2f4f5] px-4 py-2 text-sm font-semibold text-black"
        featureLabel="키워드 알림 받기"
        returnTo="/home"
      >
        <BellIcon />
        <span>알림 받기</span>
      </PendingFeatureLink>
    </>
  );
}
