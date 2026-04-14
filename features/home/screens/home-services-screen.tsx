"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { IconButton } from "@/components/ui/icon-button";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { useHomeNavigationHistory } from "@/features/home/components/home-navigation-history-provider";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { homeServiceSections } from "@/lib/home-services";
import { useRouter } from "next/navigation";

export function HomeServicesScreen() {
  const router = useRouter();
  const { getPreviousPath } = useHomeNavigationHistory();

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

    router.push("/home");
  };

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <div className="mobile-shell-wide min-h-screen bg-white">
        <header className="sticky top-0 z-20 border-b border-[#f3f4f6] bg-white">
          <div className="relative flex h-[60px] items-center px-5">
            <IconButton ariaLabel="뒤로가기" onClick={handleBack}>
              <span className="text-[#0a0a0a]">
                <ArrowLeftIcon />
              </span>
            </IconButton>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium leading-7 text-[#0a0a0a]">
              전체 서비스
            </h1>
          </div>
        </header>

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
                        returnTo="/home/services"
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
