"use client";

import { usePathname, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
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
  const pathname = usePathname();

  return (
    <button
      className="flex h-[52px] flex-1 items-center justify-center rounded-[8px] bg-[#ff6f0f] text-[18px] font-semibold text-white"
      onClick={() => {
        trackEvent(
          "element_clicked",
          buildElementClickedEventProperties({
            screenName: "item_detail",
            targetType: "button",
            targetName: "item_detail_chat_button_open_chat",
            surface: "sticky_footer",
            path: pathname,
            targetId: itemId,
            destinationPath: chatHref,
            additionalProperties: {
              chat_key: chatKey,
              seller_name: sellerName,
              town,
            },
          }),
        );

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
