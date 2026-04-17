import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { selectionChipClassName } from "@/components/ui/selection-chip";
import { type ChatCategory } from "@/lib/chat";

export function ChatCategoryChip({ category }: { category: ChatCategory }) {
  return (
    <PendingFeatureLink
      className={selectionChipClassName({ active: category.active })}
      featureLabel={category.label || "채팅 필터"}
      returnTo="/chat"
    >
      {category.icon === "filter" ? <FilterIcon /> : null}
      {category.icon ? null : <span>{category.label}</span>}
      {category.hasChevron ? <ChevronDownSmallIcon /> : null}
    </PendingFeatureLink>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M2.5 4.5H13.5M4.5 8H11.5M6.5 11.5H9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <circle cx="5.4" cy="4.5" fill="currentColor" r="1.1" />
      <circle cx="10.6" cy="8" fill="currentColor" r="1.1" />
      <circle cx="7.4" cy="11.5" fill="currentColor" r="1.1" />
    </svg>
  );
}

function ChevronDownSmallIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}
