"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export function HistoryBackButton({
  ariaLabel,
  children,
  className,
  fallbackHref,
  onClick,
  preferFallback = false,
}: {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  fallbackHref: string;
  onClick?: () => void;
  preferFallback?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        onClick?.();
        if (preferFallback) {
          router.replace(fallbackHref);
          return;
        }

        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.replace(fallbackHref);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
