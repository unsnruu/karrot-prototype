"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export function HistoryBackButton({
  children,
  className,
  fallbackHref,
}: {
  children: ReactNode;
  className?: string;
  fallbackHref: string;
}) {
  const router = useRouter();

  return (
    <button
      className={className}
      onClick={() => {
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
