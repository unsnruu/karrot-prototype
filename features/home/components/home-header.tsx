"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl bg-white/95 px-4 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <button className="flex items-center gap-0.5" type="button">
            <span className="text-[22px] font-bold tracking-[-0.03em] text-black">합정동</span>
            <AppImage alt="" className="h-6 w-6" height={24} src={iconChevronDown} width={24} />
          </button>
          <div className="flex items-center gap-3">
            <button aria-label="검색" type="button">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconSearch} width={32} />
            </button>
            <button aria-label="알림" type="button">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconBell} width={32} />
            </button>
            <button aria-label="메뉴" type="button">
              <AppImage alt="" className="h-8 w-8" height={32} src={iconMenu} width={32} />
            </button>
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
                href={buildCategoryHref(pathname, searchParams, category.label)}
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

function buildCategoryHref(pathname: string, searchParams: URLSearchParams, label: string) {
  const nextParams = new URLSearchParams(searchParams.toString());

  if (label === "전체") {
    nextParams.delete("category");
  } else {
    nextParams.set("category", label);
  }

  const nextQuery = nextParams.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
