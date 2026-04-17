import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TabsListProps = {
  children: ReactNode;
  className?: string;
};

export function TabsList({ children, className }: TabsListProps) {
  return <div className={className}>{children}</div>;
}

type TextTabLinkProps = {
  active?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
};

export function TextTabLink({
  active = false,
  children,
  className,
  href,
  onClick,
}: TextTabLinkProps) {
  return (
    <Link
      className={cn(active ? "text-black" : "text-[#858b95]", className)}
      href={href}
      onClick={onClick}
      scroll={false}
    >
      {children}
    </Link>
  );
}

type UnderlineTabLinkProps = {
  active?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
};

export function UnderlineTabLink({
  active = false,
  children,
  className,
  href,
  onClick,
}: UnderlineTabLinkProps) {
  return (
    <Link
      className={cn(
        "flex-1 border-b-2 pb-[14px] pt-3 text-center text-[14px] font-bold leading-5",
        active ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6b7280]",
        className,
      )}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
