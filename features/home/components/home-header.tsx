"use client";

import Link from "next/link";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type HomeCategory } from "@/lib/marketplace";

const iconChevronDown = "/icons/chevron-down.svg";
const iconSearch = "/icons/search.svg";
const iconBell = "/icons/bell.svg";
const iconMenu = "/icons/menu.svg";
const iconCategoryChevron = "/icons/category-chevron.svg";

export function HomeHeader({
  categories,
  selectedCategory,
}: {
  categories: HomeCategory[];
  selectedCategory?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mobile-shell-wide bg-white/95 px-4 pt-5 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <PendingFeatureLink className="flex items-center gap-0.5" returnTo="/home">
            <span className="text-[22px] font-bold tracking-[-0.03em] text-black">합정동</span>
            <AppImage alt="" className="h-6 w-6" height={24} src={iconChevronDown} width={24} />
          </PendingFeatureLink>
          <div className="flex items-center gap-3">
            <PendingFeatureLink aria-label="검색" returnTo="/home">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconSearch} width={32} />
            </PendingFeatureLink>
            <PendingFeatureLink aria-label="알림" returnTo="/home">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconBell} width={32} />
            </PendingFeatureLink>
            <Link aria-label="메뉴" href="/home/services">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconMenu} width={32} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = (selectedCategory ?? "전체") === category.label;

            return (
              <Link
                className={`flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-[14px] font-medium leading-none ${
                  isActive ? "bg-[#2a3038] text-white" : "bg-[#f3f4f5] text-[#1a1c20]"
                }`}
                href={buildCategoryHref(category.label)}
                key={category.label}
                scroll={false}
              >
                {category.label}
                {category.hasChevron ? (
                  <AppImage alt="" className="ml-1 h-3 w-3" height={12} src={iconCategoryChevron} width={12} />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function buildCategoryHref(label: string) {
  if (label === "전체") {
    return "/home";
  } else {
    const nextParams = new URLSearchParams();
    nextParams.set("category", label);
    return `/home?${nextParams.toString()}`;
  }
}
