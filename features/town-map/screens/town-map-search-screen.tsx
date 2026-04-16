"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildSearchEventProperties } from "@/lib/analytics/search";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";
import {
  townMapKeyboardRows,
  townMapKeyboardSuggestions,
  townMapRecentSearches,
  type TownMapKeyboardKey,
} from "@/lib/town-map";

type TownMapSearchScreenProps = {
  returnHref: string;
};

export function TownMapSearchScreen({ returnHref }: TownMapSearchScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(townMapRecentSearches);

  const hasRecentSearches = recentSearches.length > 0;
  const suggestedTerms = useMemo(() => {
    const filtered = townMapKeyboardSuggestions.filter((item) => item.startsWith(query) || query.length === 0);
    return filtered.length > 0 ? filtered : townMapKeyboardSuggestions;
  }, [query]);

  const removeRecentSearch = (term: string) => {
    setRecentSearches((current) => current.filter((item) => item !== term));
  };

  const addRecentSearch = (term: string) => {
    const value = term.trim();
    if (!value) {
      return;
    }

    setRecentSearches((current) => [value, ...current.filter((item) => item !== value)].slice(0, townMapRecentSearches.length));
  };

  const handleSearchSubmit = (term: string) => {
    const value = term.trim();
    const destinationPath = buildPendingFeatureHref(returnHref, "동네지도에서 업체 찾기");

    trackEvent(
      "search_submitted",
      buildSearchEventProperties({
        screenName: "town_map_search",
        path: pathname,
        searchName: "town_map_search_input",
        surface: "search_screen",
        destinationPath,
        query: value || undefined,
        hasQuery: Boolean(value),
      }),
    );

    if (!value) {
      return;
    }

    addRecentSearch(value);
    router.push(destinationPath);
  };

  const handleKeyboardPress = (key: TownMapKeyboardKey) => {
    switch (key.action) {
      case "delete":
        setQuery((current) => current.slice(0, -1));
        return;
      case "space":
        setQuery((current) => `${current} `);
        return;
      case "search":
        handleSearchSubmit(query);
        return;
      case "shift":
      case "numbers":
      case "emoji":
      case "globe":
      case "mic":
        return;
      default:
        setQuery((current) => `${current}${key.label}`);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell flex min-h-screen flex-col overflow-hidden bg-white">
        <header className="border-b border-[#f3f4f6] px-4 pb-[9px] pt-8">
          <div className="flex items-center gap-1">
            <Link
              aria-label="뒤로 가기"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-black"
              href={returnHref}
            >
              <ArrowLeftIcon />
            </Link>

            <div className="min-w-0 flex-1 pl-1">
              <div className="flex h-10 items-center rounded-[12px] bg-[#f2f2f7] px-3">
                <span className={`text-[16px] ${query ? "text-[#111827]" : "text-[#9ca3af]"}`}>
                  {query || "여기서 업체검색"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-5 pb-[370px] pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] leading-7 text-[#111827]">최근 검색</h1>
            <button
              className="text-[14px] leading-5 text-[#9ca3af] disabled:opacity-40"
              disabled={!hasRecentSearches}
              onClick={() => {
                trackEvent(
                  "search_history_cleared",
                  buildSearchEventProperties({
                    screenName: "town_map_search",
                    path: pathname,
                    searchName: "town_map_search_input",
                    surface: "recent_searches",
                  }),
                );
                setRecentSearches([]);
              }}
              type="button"
            >
              전체 삭제
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {hasRecentSearches ? (
              recentSearches.map((term) => (
                <div className="flex items-center justify-between" key={term}>
                  <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => handleSearchSubmit(term)} type="button">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6]">
                      <RecentClockIcon />
                    </span>
                    <span className="text-[17px] leading-[26px] text-[#1f2937]">{term}</span>
                  </button>
                  <button
                    aria-label={`${term} 삭제`}
                    className="flex h-6 w-6 items-center justify-center"
                    onClick={() => removeRecentSearch(term)}
                    type="button"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-[15px] text-[#9ca3af]">최근 검색어가 없어요.</div>
            )}
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#d1d5db] bg-[#d1d3d9]">
          <div className="mobile-shell">
            <div className="border-b border-[#d1d5db] bg-[rgba(255,255,255,0.9)] px-4 py-[10px] backdrop-blur-[10px]">
              <div className="flex items-center justify-end">
                <PendingFeatureLink className="text-[16px] font-medium leading-6 text-[#007aff]" featureLabel="동네지도 검색 완료" returnTo={returnHref}>
                  완료
                </PendingFeatureLink>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-[#d1d5db] bg-[#d1d3d9] text-center text-[14px] leading-5 text-[#111827]">
              {suggestedTerms.map((item) => (
                <button className="h-11 border-r border-[#d1d5db] last:border-r-0" key={item} onClick={() => handleSearchSubmit(item)} type="button">
                  {item}
                </button>
              ))}
            </div>

            <div className="bg-[#d1d3d9] px-1 pb-1 pt-2">
              <div className="flex flex-col gap-3">
                {townMapKeyboardRows.slice(0, 3).map((row) => (
                  <div className="flex gap-1" key={row.map((key) => key.id).join("-")}>
                    {row.map((key) => (
                      <button
                        className={keyboardKeyClassName(key)}
                        key={key.id}
                        onClick={() => handleKeyboardPress(key)}
                        type="button"
                      >
                        {key.action === "shift" ? <ShiftIcon /> : key.action === "delete" ? <DeleteIcon /> : key.label}
                      </button>
                    ))}
                  </div>
                ))}

                <div className="flex items-center gap-1">
                  {townMapKeyboardRows[3].map((key) => (
                    <button
                      className={keyboardKeyClassName(key)}
                      key={key.id}
                      onClick={() => handleKeyboardPress(key)}
                      type="button"
                    >
                      {key.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between px-8 pb-3 pt-1 text-[#111827]">
                  <PendingFeatureLink className="flex h-6 w-6 items-center justify-center" featureLabel="키보드 언어 변경" returnTo={returnHref}>
                    <GlobeIcon />
                  </PendingFeatureLink>
                  <PendingFeatureLink className="flex h-6 w-6 items-center justify-center" featureLabel="음성으로 검색" returnTo={returnHref}>
                    <MicIcon />
                  </PendingFeatureLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function keyboardKeyClassName(key: TownMapKeyboardKey) {
  const widthClassName =
    key.width === "search"
      ? "flex-[1.28]"
      : key.width === "wide"
        ? "flex-[0.7]"
        : key.action === "space"
          ? "flex-[2]"
          : "flex-1";

  const toneClassName =
    key.tone === "primary"
      ? "bg-[#007aff] text-white"
      : key.tone === "muted"
        ? "bg-[rgba(209,211,217,0.6)] text-[#111827]"
        : "bg-[#fcfcfe] text-[#111827]";

  return `${widthClassName} flex h-11 items-center justify-center rounded-[10px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.3)] ${toneClassName} text-[18px]`;
}

function RecentClockIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="5.5" stroke="#111827" strokeWidth="1.2" />
      <path d="M8 4.8V8L10.2 9.4" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M6 6L18 18" stroke="#111827" strokeLinecap="round" strokeWidth="2.1" />
      <path d="M18 6L6 18" stroke="#111827" strokeLinecap="round" strokeWidth="2.1" />
    </svg>
  );
}

function ShiftIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M12 5L6 12H10V18H14V12H18L12 5Z" stroke="#111827" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M10 7H18C19.1 7 20 7.9 20 9V15C20 16.1 19.1 17 18 17H10L4 12L10 7Z" stroke="#111827" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M12 10L16 14" stroke="#111827" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M16 10L12 14" stroke="#111827" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="1.8" />
      <path d="M3.5 12H20.5" stroke="#111827" strokeWidth="1.6" />
      <path d="M12 3C14.3 5.3 15.6 8.4 15.6 12C15.6 15.6 14.3 18.7 12 21" stroke="#111827" strokeWidth="1.6" />
      <path d="M12 3C9.7 5.3 8.4 8.4 8.4 12C8.4 15.6 9.7 18.7 12 21" stroke="#111827" strokeWidth="1.6" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <rect height="10" rx="4" stroke="#111827" strokeWidth="1.8" width="8" x="8" y="3" />
      <path d="M6.5 11.5C6.5 14.54 8.96 17 12 17C15.04 17 17.5 14.54 17.5 11.5" stroke="#111827" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 17V21" stroke="#111827" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
