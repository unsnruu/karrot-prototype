import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type ChatCategory } from "@/lib/chat";

export function ChatCategoryChip({ category }: { category: ChatCategory }) {
  const className = category.active ? "bg-[#2a3038] text-white" : "bg-[#f3f4f5] text-[#1a1c20]";

  return (
    <PendingFeatureLink
      className={`flex h-10 shrink-0 items-center justify-center gap-1 rounded-full px-4 text-sm font-medium ${className}`}
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
