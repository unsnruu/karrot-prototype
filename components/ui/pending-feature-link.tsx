"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { trackElementClicked, type ElementClickedEventPropertiesInput } from "@/lib/analytics/element-click";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

type PendingFeatureLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  children: ReactNode;
  featureLabel: string;
  returnTo?: string;
  tracking?: ElementClickedEventPropertiesInput;
};

export function PendingFeatureLink({ children, featureLabel, returnTo, tracking, onClick, ...props }: PendingFeatureLinkProps) {
  return (
    <Link
      {...props}
      href={buildPendingFeatureHref(returnTo, featureLabel)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && tracking) {
          trackElementClicked(tracking);
        }
      }}
    >
      {children}
    </Link>
  );
}
