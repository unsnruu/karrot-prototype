"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildExperimentHref, readHomeExperimentVariantFromPathname } from "@/lib/home-experiment";
import { bottomTabs } from "@/lib/marketplace";

export function BottomNav() {
  const pathname = usePathname();
  const experimentVariant = readHomeExperimentVariantFromPathname(pathname);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <ul className="mobile-shell grid grid-cols-5 px-2 sm:px-4">
        {bottomTabs.map((tab) => {
          const tabHref = buildExperimentHref(tab.href, experimentVariant);
          const active = isActiveTab(pathname, tab.href);

          return (
            <li className="flex" key={tab.label}>
              <Link
                className="flex flex-1 flex-col items-center gap-0.5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-1"
                href={tabHref}
                onClick={() =>
                  trackEvent("bottom_nav_clicked", {
                    current_path: pathname,
                    destination_path: tabHref,
                    tab_label: tab.label,
                  })
                }
              >
                <span
                  aria-hidden="true"
                  className={`h-8 w-8 ${active ? "bg-[#1a1c20]" : "bg-[#aeb3bb]"}`}
                  style={{
                    WebkitMaskImage: `url(${tab.icon})`,
                    maskImage: `url(${tab.icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
                <span className={`text-[11px] font-medium ${active ? "text-[#1a1c20]" : "text-[#aeb3bb]"}`}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function isActiveTab(pathname: string, href: string) {
  const normalizedPathname = pathname.replace(/^\/exp\/(a|b|c)/, "");

  if (href === "/home") {
    return normalizedPathname === "/" || normalizedPathname === "/home" || normalizedPathname.startsWith("/home/");
  }

  return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
}
