import { HeartIcon } from "@/features/home/components/item-detail-icons";
import { ItemDetailChatButton } from "@/features/home/components/item-detail-chat-button";

export function ItemDetailBottomBar({
  avatarImage,
  chatKey,
  chatHref,
  itemId,
  sellerName,
  town,
}: {
  avatarImage?: string;
  chatKey: string;
  chatHref: string;
  itemId: string;
  sellerName: string;
  town: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="mobile-shell flex items-center gap-3 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <button aria-label="관심 상품 추가" className="flex h-[52px] w-9 items-center justify-center text-[#d6d7dc]" type="button">
          <HeartIcon />
        </button>
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
