import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ListSectionProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  empty?: ReactNode;
  itemsClassName?: string;
  title?: ReactNode;
  titleMeta?: ReactNode;
  trailing?: ReactNode;
};

export function ListSection({
  children,
  className,
  containerClassName,
  empty,
  itemsClassName,
  title,
  titleMeta,
  trailing,
}: ListSectionProps) {
  const hasHeader = Boolean(title || titleMeta || trailing);

  return (
    <section className={className}>
      {hasHeader ? (
        <div className={cn("mb-6 flex items-start justify-between gap-4", containerClassName)}>
          <div>
            {title ? <h2 className="text-[18px] font-bold leading-7 tracking-[-0.03em] text-[#0a0a0a]">{title}</h2> : null}
            {titleMeta ? <div className="mt-1 text-[13px] leading-5 tracking-[-0.015em] text-[#6a7282]">{titleMeta}</div> : null}
          </div>
          {trailing}
        </div>
      ) : null}

      {empty ?? <div className={itemsClassName}>{children}</div>}
    </section>
  );
}

type ListEmptyStateProps = {
  bordered?: boolean;
  children: ReactNode;
  className?: string;
};

export function ListEmptyState({
  bordered = false,
  children,
  className,
}: ListEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[240px] items-center justify-center px-4 py-12 text-center",
        bordered && "rounded-[24px] border border-dashed border-[#dbe1ea]",
        className,
      )}
    >
      {children}
    </div>
  );
}
