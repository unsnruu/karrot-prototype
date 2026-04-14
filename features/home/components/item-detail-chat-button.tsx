"use client";

import { useRouter } from "next/navigation";
import { ensureLocalChatThread } from "@/lib/local-chat-storage";

type ItemDetailChatButtonProps = {
  avatarImage?: string;
  chatKey: string;
  chatHref: string;
  itemId: string;
  sellerName: string;
  town: string;
};

export function ItemDetailChatButton({
  avatarImage,
  chatKey,
  chatHref,
  itemId,
  sellerName,
  town,
}: ItemDetailChatButtonProps) {
  const router = useRouter();

  return (
    <button
      className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] bg-[#ff6f0f] text-[18px] font-semibold text-white"
      onClick={() => {
        ensureLocalChatThread({
          chatKey,
          itemId,
          sellerName,
          town,
          avatarImage,
        });
        router.push(chatHref);
      }}
      type="button"
    >
      채팅하기
    </button>
  );
}
