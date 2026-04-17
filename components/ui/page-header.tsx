import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  centeredTitle?: boolean;
  className?: string;
  innerClassName?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  title?: ReactNode;
};

export function PageHeader({
  centeredTitle = true,
  className,
  innerClassName,
  leading,
  title,
  trailing,
}: PageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-10 border-b border-[#f3f4f6] bg-white", className)}>
      <div className={cn("relative flex h-14 items-center px-4", innerClassName)}>
        <div className="z-10 flex min-w-10 items-center justify-start">{leading}</div>
        {title ? (
          centeredTitle ? (
            <h1 className="pointer-events-none absolute inset-x-14 text-center text-[20px] font-bold tracking-[-0.03em] text-[#111827]">
              {title}
            </h1>
          ) : (
            <div className="flex-1 px-4">{title}</div>
          )
        ) : null}
        <div className="z-10 ml-auto flex min-w-10 items-center justify-end">{trailing}</div>
      </div>
    </header>
  );
}
