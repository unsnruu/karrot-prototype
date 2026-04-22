"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export function HistoryBackButton({
  children,
  className,
  fallbackHref,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  fallbackHref: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  return (
    <button
      className={className}
      onClick={() => {
        onClick?.();
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
