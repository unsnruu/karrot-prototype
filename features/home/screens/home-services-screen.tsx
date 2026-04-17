"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { IconButton } from "@/components/ui/icon-button";
import { PageHeader } from "@/components/ui/page-header";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { useHomeNavigationHistory } from "@/features/home/components/home-navigation-history-provider";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { resolveHomeHrefFromPathname } from "@/lib/home-experiment";
import { homeServiceSections } from "@/lib/home-services";
import { usePathname, useRouter } from "next/navigation";

export function HomeServicesScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { getPreviousPath } = useHomeNavigationHistory();
  const homeHref = resolveHomeHrefFromPathname(pathname);

  const handleBack = () => {
    const previousPath = getPreviousPath();

    if (previousPath) {
      router.push(previousPath);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(homeHref);
  };

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <div className="mobile-shell-wide min-h-screen bg-white">
        <PageHeader
          className="z-20"
          innerClassName="h-[60px] px-5"
          leading={
            <IconButton ariaLabel="뒤로가기" onClick={handleBack}>
              <span className="text-[#0a0a0a]">
                <ArrowLeftIcon />
              </span>
            </IconButton>
          }
          title={<span className="text-[18px] font-medium leading-7 text-[#0a0a0a]">전체 서비스</span>}
        />

        <div className="px-5 pb-12 pt-6">
          <div className="space-y-8">
            {homeServiceSections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[14px] font-medium leading-5 text-[#101828]">{section.title}</h2>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  {section.items.map((item) =>
                    item.href ? (
                      <Link className="flex items-center gap-3 rounded-[10px] pl-3" href={item.href} key={item.label}>
                        <ServiceIcon icon={item.icon} label={item.label} />
                        <span className="text-[16px] font-medium leading-6 text-[#101828]">{item.label}</span>
                      </Link>
                    ) : (
                      <PendingFeatureLink
                        className="flex items-center gap-3 rounded-[10px] pl-3 text-left"
                        featureLabel={item.label}
                        key={item.label}
                        returnTo={pathname}
                      >
                        <ServiceIcon icon={item.icon} label={item.label} />
                        <span className="text-[16px] font-medium leading-6 text-[#101828]">{item.label}</span>
                      </PendingFeatureLink>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ServiceIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#ff6f0f]">
      <AppImage alt="" className="h-5 w-5" height={20} src={icon} width={20} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
