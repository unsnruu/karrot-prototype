import Link from "next/link";
import { cn } from "@/lib/utils";

export function IconButton({
  ariaLabel,
  children,
  href,
  onClick,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className = "flex h-8 w-8 items-center justify-center";

  if (href) {
    return (
      <Link aria-label={ariaLabel} className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button aria-label={ariaLabel} className={className} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
      <path d="M20 8L12 16L20 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
      <path
        d="M7.5 14.4L16 8L24.5 14.4V24H18.5V18H13.5V24H7.5V14.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
      <path
        d="M16 20V9M16 9L11.5 13.5M16 9L20.5 13.5M10 19.5V22.5C10 23.6 10.9 24.5 12 24.5H20C21.1 24.5 22 23.6 22 22.5V19.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function MoreVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-6 w-6", className)} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="5" fill="currentColor" r="1.8" />
      <circle cx="12" cy="12" fill="currentColor" r="1.8" />
      <circle cx="12" cy="19" fill="currentColor" r="1.8" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" viewBox="0 0 16 16">
      <path d="M6 3L10.5 8L6 13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

export function MapExpandIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M5 2.75H2.75V5M11 2.75H13.25V5M5 13.25H2.75V11M11 13.25H13.25V11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5 text-[#8b8c91]", className)} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10V16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="7" fill="currentColor" r="1" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M8 2.5C6.1 2.5 4.5 4.1 4.5 6V8.1C4.5 8.6 4.34 9.08 4.03 9.47L3.1 10.65C2.69 11.17 3.06 12 3.72 12H12.28C12.94 12 13.31 11.17 12.9 10.65L11.97 9.47C11.66 9.08 11.5 8.6 11.5 8.1V6C11.5 4.1 9.9 2.5 8 2.5Z"
        fill="currentColor"
      />
      <path d="M6.5 13C6.72 13.62 7.31 14 8 14C8.69 14 9.28 13.62 9.5 13" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M12 20.2L10.55 18.88C5.4 14.21 2 11.13 2 7.35C2 4.27 4.42 2 7.5 2C9.24 2 10.91 2.81 12 4.09C13.09 2.81 14.76 2 16.5 2C19.58 2 22 4.27 22 7.35C22 11.13 18.6 14.21 13.45 18.89L12 20.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
