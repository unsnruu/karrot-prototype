"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { SelectionChipLink } from "@/components/ui/selection-chip";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { resolveHomeHrefFromPathname } from "@/lib/home-experiment";
import { type HomeCategory } from "@/lib/marketplace";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

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
  const queryString = searchParams.toString();
  const homeHref = resolveHomeHrefFromPathname(pathname);
  const homeServicesHref = "/home/services";

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mobile-shell-wide bg-white/95 px-4 pt-5 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <PendingFeatureLink
            className="flex items-center gap-0.5"
            featureLabel="동네 선택"
            onClick={() => {
              trackEvent(
                "element_clicked",
                buildElementClickedEventProperties({
                  screenName: "home",
                  targetType: "button",
                  targetName: "home_town_selector",
                  surface: "header",
                  path: pathname,
                  queryString,
                  destinationPath: buildPendingFeatureHref(homeHref, "동네 선택"),
                }),
              );
            }}
            returnTo={homeHref}
          >
            <span className="text-[22px] font-bold tracking-[-0.03em] text-black">합정동</span>
            <AppImage alt="" className="h-6 w-6" height={24} src={iconChevronDown} width={24} />
          </PendingFeatureLink>
          <div className="flex items-center gap-3">
            <PendingFeatureLink
              aria-label="검색"
              featureLabel="홈 검색"
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "home",
                    targetType: "button",
                    targetName: "home_search_input",
                    surface: "header",
                    path: pathname,
                    queryString,
                    destinationPath: buildPendingFeatureHref(homeHref, "홈 검색"),
                  }),
                );
              }}
              returnTo={homeHref}
            >
              <AppImage alt="" className="h-8 w-8" height={32} src={iconSearch} width={32} />
            </PendingFeatureLink>
            <PendingFeatureLink
              aria-label="알림"
              featureLabel="알림 확인"
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "home",
                    targetType: "button",
                    targetName: "home_notification_button",
                    surface: "header",
                    path: pathname,
                    queryString,
                    destinationPath: buildPendingFeatureHref(homeHref, "알림 확인"),
                  }),
                );
              }}
              returnTo={homeHref}
            >
              <AppImage alt="" className="h-8 w-8" height={32} src={iconBell} width={32} />
            </PendingFeatureLink>
            <Link
              aria-label="메뉴"
              href={homeServicesHref}
              onClick={() => {
                trackEvent(
                  "element_clicked",
                  buildElementClickedEventProperties({
                    screenName: "home",
                    targetType: "button",
                    targetName: "home_menu_button",
                    surface: "header",
                    path: pathname,
                    queryString,
                    destinationPath: homeServicesHref,
                  }),
                );
              }}
            >
              <AppImage alt="" className="h-8 w-8" height={32} src={iconMenu} width={32} />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = (selectedCategory ?? "전체") === category.label;

            return (
              <SelectionChipLink
                active={isActive}
                href={buildCategoryHref(category.label)}
                key={category.label}
                onClick={() => {
                  trackEvent(
                    "element_clicked",
                    buildElementClickedEventProperties({
                      screenName: "home",
                      targetType: "chip",
                      targetName: "home_category_chip",
                      surface: "header",
                      path: pathname,
                      queryString,
                      destinationPath: buildCategoryHref(category.label),
                    }),
                  );
                }}
                scroll={false}
              >
                {category.label}
                {category.hasChevron ? (
                  <AppImage alt="" className="ml-1 h-3 w-3" height={12} src={iconCategoryChevron} width={12} />
                ) : null}
              </SelectionChipLink>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function buildCategoryHref(label: string) {
  const homeHref = "/home";
  if (label === "전체") {
    return homeHref;
  } else {
    const nextParams = new URLSearchParams();
    nextParams.set("category", label);
    return `${homeHref}?${nextParams.toString()}`;
  }
}
