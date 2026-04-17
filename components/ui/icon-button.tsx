import type { ReactNode } from "react";
import Link from "next/link";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { cn } from "@/lib/utils";

export function IconButton({
  ariaLabel,
  children,
  className,
  href,
  onClick,
  pendingFeatureLabel,
  replace,
  returnTo,
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  pendingFeatureLabel?: string;
  replace?: boolean;
  returnTo?: string;
}) {
  const nextClassName = cn("flex h-8 w-8 items-center justify-center", className);

  if (href) {
    return (
      <Link aria-label={ariaLabel} className={nextClassName} href={href} replace={replace}>
        {children}
      </Link>
    );
  }

  if (pendingFeatureLabel) {
    return (
      <PendingFeatureLink
        aria-label={ariaLabel}
        className={nextClassName}
        featureLabel={pendingFeatureLabel}
        returnTo={returnTo}
      >
        {children}
      </PendingFeatureLink>
    );
  }

  return (
    <button aria-label={ariaLabel} className={nextClassName} onClick={onClick} type="button">
      {children}
    </button>
  );
}
