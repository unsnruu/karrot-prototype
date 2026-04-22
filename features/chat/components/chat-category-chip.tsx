import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { selectionChipClassName } from "@/components/ui/selection-chip";
import { type ChatCategory } from "@/lib/chat";

export function ChatCategoryChip({ category }: { category: ChatCategory }) {
  return (
    <PendingFeatureLink
      className={selectionChipClassName({ active: category.active })}
      featureLabel={category.label || "채팅 필터"}
      returnTo="/chat"
      tracking={{
        screenName: "chat_landing",
        targetType: "chip",
        targetName: "chat_category_chip",
        surface: "header",
        path: "/chat",
        targetId: category.label || "filter",
      }}
    >
      {category.icon === "filter" ? <SlidersHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={1.4} /> : null}
      {category.icon ? null : <span>{category.label}</span>}
      {category.hasChevron ? <ChevronDown aria-hidden="true" className="h-3 w-3" strokeWidth={1.2} /> : null}
    </PendingFeatureLink>
  );
}
