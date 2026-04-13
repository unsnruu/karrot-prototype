import Link from "next/link";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { ItemDetailKakaoMap } from "@/features/home/components/item-detail-kakao-map";
import { type MarketplaceItem } from "@/lib/marketplace";

export function ItemLocationScreen({ item }: { item: MarketplaceItem }) {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mobile-shell flex min-h-screen flex-col bg-white">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-2">
          <Link
            aria-label="뒤로 가기"
            className="flex h-10 w-10 items-center justify-center text-[#212529]"
            href={item.slug ? `/home/items/${item.slug}` : "/home"}
          >
            <ArrowLeftIcon />
          </Link>

          <h1 className="text-[20px] font-semibold leading-8 tracking-[-0.02em] text-black">거래 희망 장소</h1>

          <div className="h-10 w-10" />
        </header>

        <div className="flex-1 px-0 pb-0">
          <ItemDetailKakaoMap
            heightClassName="h-[calc(100dvh-56px)] min-h-[22rem]"
            lat={item.meetupLat}
            lng={item.meetupLng}
            meetupAddress={item.meetupAddress}
            meetupHint={item.meetupHint}
            rounded={false}
            title={item.title}
          />
        </div>
      </div>
    </main>
  );
}
