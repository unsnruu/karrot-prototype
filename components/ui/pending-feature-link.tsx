import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

type PendingFeatureLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  children: ReactNode;
  featureLabel: string;
  returnTo?: string;
};

export function PendingFeatureLink({ children, featureLabel, returnTo, ...props }: PendingFeatureLinkProps) {
  return (
    <Link {...props} href={buildPendingFeatureHref(returnTo, featureLabel)}>
      {children}
    </Link>
  );
}
