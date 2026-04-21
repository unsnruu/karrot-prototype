"use client";

import { SeedActionButtonExperiment } from "@/components/ui/experiments/seed-action-button";
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
    <SeedActionButtonExperiment
      className="flex-1 text-[18px] font-semibold"
      fullWidth
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
      size="medium"
      variant="brandSolid"
    >
      채팅하기
    </SeedActionButtonExperiment>
  );
}
