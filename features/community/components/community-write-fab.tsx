"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight, Coffee, Pencil, Plus, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/amplitude";
import { buildElementClickedEventProperties } from "@/lib/analytics/element-click";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";

const COMMUNITY_WRITE_ACTIONS = [
  {
    label: "이웃에게 투표받기",
    description: "이웃들의 의견이 궁금할 땐, 투표로 물어보세요",
    featureLabel: "커뮤니티 투표 글쓰기",
    icon: BadgeCheck,
    iconColor: "#00a05b",
    iconBg: "#e9f8f1",
    targetName: "community_write_poll_entry",
  },
  {
    label: "동네생활 글쓰기",
    featureLabel: "동네생활 글쓰기",
    icon: Pencil,
    iconColor: "#2f80ed",
    iconBg: "#eef6ff",
    targetName: "community_write_town_entry",
  },
  {
    label: "모임 만들기",
    description: "동네 이웃과 오프라인 모임을 시작해보세요",
    featureLabel: "모임 만들기",
    icon: UsersRound,
    iconColor: "#ff6f0f",
    iconBg: "#fff0e8",
    targetName: "community_write_meetup_entry",
    sectionLabel: "모임·카페",
  },
  {
    label: "온라인 카페 만들기",
    description: "관심사를 주제로 온라인에서 소통해요",
    featureLabel: "온라인 카페 만들기",
    icon: Coffee,
    iconColor: "#f2a600",
    iconBg: "#fff8df",
    targetName: "community_write_cafe_entry",
  },
] as const;

export function CommunityWriteFab() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentHref = useMemo(() => {
    const queryString = searchParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    const updateCompactState = () => {
      setIsCompact(window.scrollY > 72);
    };

    updateCompactState();
    const restorePositionTimer = window.setTimeout(updateCompactState, 150);
    window.addEventListener("scroll", updateCompactState, { passive: true });

    return () => {
      window.clearTimeout(restorePositionTimer);
      window.removeEventListener("scroll", updateCompactState);
    };
  }, []);

  useEffect(() => {
    if (!isSheetOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSheetOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSheetOpen]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[103px] z-20 px-4 sm:px-6">
        <div className="mobile-shell-wide flex justify-end">
          <button
            aria-expanded={isSheetOpen}
            aria-haspopup="dialog"
            aria-label="커뮤니티 글쓰기"
            className={`pointer-events-auto flex h-[60px] items-center justify-center rounded-full bg-[#ff6f0f] text-white shadow-[0_10px_24px_rgba(255,111,15,0.34)] transition-all duration-200 ${
              isCompact ? "w-[60px] px-0" : "w-[148px] gap-1.5 px-6"
            }`}
            onClick={() => {
              trackEvent(
                "element_clicked",
                buildElementClickedEventProperties({
                  screenName: "community",
                  targetType: "button",
                  targetName: "community_write_fab_open_sheet",
                  surface: "floating_action_button",
                  path: pathname,
                  queryString: searchParams.toString(),
                }),
              );
              setIsSheetOpen(true);
            }}
            type="button"
          >
            <Plus aria-hidden="true" className="h-7 w-7 shrink-0" strokeWidth={2.5} />
            <span
              className={`whitespace-nowrap text-[18px] font-bold leading-none tracking-[-0.02em] transition-all duration-150 ${
                isCompact ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
              }`}
            >
              글쓰기
            </span>
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isSheetOpen}
        className={`fixed inset-0 z-40 flex items-end justify-center bg-black/45 transition-opacity duration-200 ${
          isSheetOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSheetOpen(false)}
      >
        <section
          aria-label="커뮤니티 글쓰기"
          aria-modal="true"
          className={`w-full max-w-[var(--mobile-shell-wide)] rounded-t-[24px] bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-8 shadow-[0_-16px_40px_rgba(15,23,42,0.18)] transition-transform duration-200 ${
            isSheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
        >
          <div className="mb-8">
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#111827]">커뮤니티 글쓰기</h2>
            <p className="mt-4 text-[19px] font-medium leading-none tracking-[-0.02em] text-[#6b7280]">
              용현2동 근처 이웃들에게 보여져요.
            </p>
          </div>

          <div className="space-y-5">
            {COMMUNITY_WRITE_ACTIONS.map((action) => {
              const Icon = action.icon;
              const destinationPath = buildPendingFeatureHref(currentHref, action.featureLabel);

              return (
                <div key={action.label}>
                  {action.sectionLabel ? (
                    <div className="mb-5 flex items-center gap-3">
                      <span className="shrink-0 text-[15px] font-medium leading-none tracking-[-0.02em] text-[#868b94]">
                        {action.sectionLabel}
                      </span>
                      <span className="h-px flex-1 bg-[#eceef2]" />
                    </div>
                  ) : null}

                  <Link
                    className="flex min-h-[64px] items-center gap-4"
                    href={destinationPath}
                    onClick={() => {
                      trackEvent(
                        "element_clicked",
                        buildElementClickedEventProperties({
                          screenName: "community",
                          targetType: "button",
                          targetName: action.targetName,
                          surface: "write_bottom_sheet",
                          path: pathname,
                          queryString: searchParams.toString(),
                          destinationPath,
                        }),
                      );
                      setIsSheetOpen(false);
                    }}
                  >
                    <span
                      className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[14px]"
                      style={{ backgroundColor: action.iconBg }}
                    >
                      <Icon aria-hidden="true" className="h-8 w-8" color={action.iconColor} strokeWidth={2.4} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[19px] font-bold leading-[1.2] tracking-[-0.03em] text-[#111827]">
                        {action.label}
                      </span>
                      {action.description ? (
                        <span className="mt-1 block truncate text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-[#8b949e]">
                          {action.description}
                        </span>
                      ) : null}
                    </span>
                    <ChevronRight aria-hidden="true" className="h-7 w-7 shrink-0 text-[#aeb4bd]" strokeWidth={2.2} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
