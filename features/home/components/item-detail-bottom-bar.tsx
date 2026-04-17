"use client";

import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { HeartIcon } from "@/features/home/components/item-detail-icons";
import { ItemDetailChatButton } from "@/features/home/components/item-detail-chat-button";
import { usePathname, useSearchParams } from "next/navigation";

export function ItemDetailBottomBar({
  avatarImage,
  chatKey,
  chatHref,
  itemId,
  returnTo,
  sellerName,
  town,
}: {
  avatarImage?: string;
  chatKey: string;
  chatHref: string;
  itemId: string;
  returnTo?: string;
  sellerName: string;
  town: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const homeHref = returnTo ?? searchParams.get("returnTo") ?? pathname;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="mobile-shell flex items-center gap-3 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <PendingFeatureLink
          aria-label="관심 상품 추가"
          className="flex h-[52px] w-9 items-center justify-center text-[#d6d7dc]"
          featureLabel="관심 상품 추가하기"
          returnTo={homeHref}
        >
          <HeartIcon />
        </PendingFeatureLink>
        <ItemDetailChatButton
          avatarImage={avatarImage}
          chatKey={chatKey}
          chatHref={chatHref}
          itemId={itemId}
          sellerName={sellerName}
          town={town}
        />
      </div>
    </div>
  );
}
