import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppToolbarProps = {
  center?: ReactNode;
  className?: string;
  innerClassName?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppToolbar({
  center,
  className,
  innerClassName,
  leading,
  trailing,
}: AppToolbarProps) {
  return (
    <header className={className}>
      <div className={cn("flex items-center justify-between", innerClassName)}>
        <div className="flex min-w-8 items-center gap-2">{leading}</div>
        {center ? <div className="min-w-0 flex-1">{center}</div> : <div className="flex-1" />}
        <div className="flex min-w-8 items-center justify-end gap-2">{trailing}</div>
      </div>
    </header>
  );
}
