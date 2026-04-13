"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomTabs } from "@/lib/marketplace";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
      <ul className="mobile-shell grid grid-cols-5 px-2 sm:px-4">
        {bottomTabs.map((tab) => {
          const active = isActiveTab(pathname, tab.href);

          return (
            <li className="flex" key={tab.label}>
              <Link
                className="flex flex-1 flex-col items-center gap-0.5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-1"
                href={tab.href}
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
  if (href === "/home") {
    return pathname === "/" || pathname === "/home" || pathname.startsWith("/home/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
