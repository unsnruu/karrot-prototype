import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

type PendingFeatureLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  children: ReactNode;
  returnTo?: string;
};

export function PendingFeatureLink({ children, returnTo, ...props }: PendingFeatureLinkProps) {
  return (
    <Link {...props} href={buildPendingFeatureHref(returnTo)}>
      {children}
    </Link>
  );
}
