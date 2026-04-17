import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SelectionChipStyleProps = {
  active?: boolean;
  className?: string;
  size?: "sm" | "md";
};

export function selectionChipClassName({
  active = false,
  className,
  size = "md",
}: SelectionChipStyleProps) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full font-medium leading-none transition-colors",
    size === "sm" ? "h-[37px] px-4 text-[14px]" : "h-10 px-4 text-sm",
    active ? "bg-[#2a3038] text-white" : "bg-[#f3f4f5] text-[#1a1c20]",
    className,
  );
}

type SelectionChipButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> &
  SelectionChipStyleProps & {
    children: ReactNode;
  };

export function SelectionChipButton({
  active = false,
  children,
  className,
  size = "md",
  type = "button",
  ...props
}: SelectionChipButtonProps) {
  return (
    <button
      {...props}
      className={selectionChipClassName({ active, className, size })}
      type={type}
    >
      {children}
    </button>
  );
}

type SelectionChipLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "children"> &
  SelectionChipStyleProps & {
    children: ReactNode;
  };

export function SelectionChipLink({
  active = false,
  children,
  className,
  size = "md",
  ...props
}: SelectionChipLinkProps) {
  return (
    <Link
      {...props}
      className={selectionChipClassName({ active, className, size })}
    >
      {children}
    </Link>
  );
}
