import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

type LocationSelectionLayoutProps = {
  backHref: string;
  backLabel: string;
  headerTitle?: string;
  title: ReactNode;
  description: ReactNode;
  map: ReactNode;
  footerAction: ReactNode;
  replaceBack?: boolean;
};

export function LocationSelectionLayout({
  backHref,
  backLabel,
  headerTitle,
  title,
  description,
  map,
  footerAction,
  replaceBack = false,
}: LocationSelectionLayoutProps) {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col overflow-hidden bg-white">
        <PageHeader
          leading={
            <Link aria-label={backLabel} className="flex h-10 w-10 items-center justify-center" href={backHref} replace={replaceBack}>
              <CloseIcon />
            </Link>
          }
          title={headerTitle}
        />

        <section className="relative z-10 bg-white px-4 pb-4 pt-6">
          <h2 className="text-[20px] font-bold leading-[1.35] tracking-[-0.03em] text-[#111827]">{title}</h2>
          <p className="mt-2 text-[14px] leading-[1.5] text-[#6b7280]">{description}</p>
        </section>

        {map}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/92 to-transparent px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-16">
          <div className="mobile-shell pointer-events-auto">{footerAction}</div>
        </div>
      </div>
    </main>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}
