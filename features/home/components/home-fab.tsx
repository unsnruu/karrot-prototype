"use client";

import { useEffect, useState } from "react";
import { AppImage } from "@/components/ui/app-image";
import { homeFabActionGroups, type HomeFabAction } from "@/lib/marketplace";

const iconPlus = "/icons/plus.svg";

export function HomeFab() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[103px] z-20 px-4 sm:px-6">
        <div className="mobile-shell-wide flex justify-end">
          <button
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={isOpen ? "작성 메뉴 닫기" : "새 글 작성"}
            className={`pointer-events-auto flex h-[60px] w-[60px] items-center justify-center rounded-full transition-all duration-200 ${
              isOpen
                ? "scale-95 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                : "bg-[#ff6f0f] shadow-[0_10px_24px_rgba(255,111,15,0.34)]"
            }`}
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            {isOpen ? (
              <CloseIcon />
            ) : (
              <AppImage alt="" className="h-8 w-8" height={32} src={iconPlus} width={32} />
            )}
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-30 bg-[rgba(0,0,0,0.36)] transition-all duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-x-0 bottom-[96px] px-4 sm:px-6">
          <div className="mobile-shell-wide flex justify-end">
            <div
              className={`flex flex-col items-end gap-2.5 transition-all duration-200 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              {homeFabActionGroups.map((group, index) => (
                <div
                  className="w-[220px] rounded-[16px] bg-white px-5 py-4 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]"
                  key={`fab-group-${index}`}
                  role="menu"
                >
                  <div className="flex flex-col gap-4">
                    {group.map((action) => (
                      <button
                        className="flex w-full items-center gap-3 text-left"
                        key={action.label}
                        role="menuitem"
                        type="button"
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: action.color }}
                        >
                          <FabActionIcon action={action} />
                        </span>
                        <span className="text-[15px] font-medium leading-[1.5] tracking-[-0.02em] text-[#101828]">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                aria-label="작성 메뉴 닫기"
                className="mt-1 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FabActionIcon({ action }: { action: HomeFabAction }) {
  const commonProps = {
    className: "h-[18px] w-[18px] text-white",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
    viewBox: "0 0 24 24",
  };

  switch (action.icon) {
    case "lesson":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3.3" />
          <path d="M5.5 18.5c1.6-3 4.1-4.5 6.5-4.5s4.9 1.5 6.5 4.5" />
        </svg>
      );
    case "home":
      return (
        <svg {...commonProps}>
          <path d="M4.8 11.2L12 5.8l7.2 5.4" />
          <path d="M7.5 10.6v7h9v-7" />
        </svg>
      );
    case "car":
      return (
        <svg {...commonProps}>
          <path d="M6.5 15.8h11l-1-4.6a1.8 1.8 0 0 0-1.8-1.4H9.3a1.8 1.8 0 0 0-1.8 1.4l-1 4.6Z" />
          <circle cx="8.5" cy="16.9" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="16.9" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "community":
      return (
        <svg {...commonProps}>
          <path d="M7.5 6.8h9a2 2 0 0 1 2 2v5.8a2 2 0 0 1-2 2h-5.2l-3.8 2v-2H7.5a2 2 0 0 1-2-2V8.8a2 2 0 0 1 2-2Z" />
          <path d="M9.2 10.3h5.6" />
          <path d="M9.2 13h4.3" />
        </svg>
      );
    case "story":
      return (
        <svg {...commonProps}>
          <path d="M8.8 7.2v9.6l8-4.8-8-4.8Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "bundle":
      return (
        <svg {...commonProps}>
          <rect x="5.8" y="5.8" width="5.1" height="5.1" rx="1" />
          <rect x="13.1" y="5.8" width="5.1" height="5.1" rx="1" />
          <rect x="5.8" y="13.1" width="5.1" height="5.1" rx="1" />
          <rect x="13.1" y="13.1" width="5.1" height="5.1" rx="1" />
        </svg>
      );
    case "sell":
      return (
        <svg {...commonProps}>
          <path d="M7.2 9h9.6l-.8 8.2H8L7.2 9Z" />
          <path d="M9.5 9V8a2.5 2.5 0 0 1 5 0v1" />
        </svg>
      );
    default:
      return null;
  }
}

function CloseIcon() {
  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-[#111827]" />
      <span className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-[#111827]" />
    </span>
  );
}
