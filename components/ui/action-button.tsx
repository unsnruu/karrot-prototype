import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { cn } from "@/lib/utils";

type ActionButtonVariant =
  | "brandSolid"
  | "neutralSolid"
  | "neutralWeak"
  | "criticalSolid"
  | "brandOutline"
  | "neutralOutline"
  | "ghost";

type ActionButtonSize = "small" | "medium" | "large";

type SharedProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  leading?: ReactNode;
  size?: ActionButtonSize;
  trailing?: ReactNode;
  variant?: ActionButtonVariant;
};

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
    pendingFeatureLabel?: never;
    returnTo?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "href"> & {
    href: string;
    pendingFeatureLabel?: never;
    returnTo?: never;
  };

type PendingButtonProps = SharedProps & {
  href?: never;
  pendingFeatureLabel: string;
  returnTo?: string;
};

type ActionButtonProps = ButtonProps | LinkButtonProps | PendingButtonProps;

export function actionButtonClassName({
  className,
  fullWidth = false,
  size = "medium",
  variant = "brandSolid",
}: SharedProps) {
  return cn(
    "inline-flex items-center justify-center gap-1 rounded-[8px] font-bold transition-colors",
    fullWidth && "w-full",
    size === "small" && "h-9 px-3 text-[13px]",
    size === "medium" && "h-[52px] px-4 text-[15px]",
    size === "large" && "h-[58px] px-4 text-[18px]",
    variant === "brandSolid" && "bg-[#ff6f0f] text-white",
    variant === "neutralSolid" && "bg-[#2a3038] text-white",
    variant === "neutralWeak" && "bg-[#e5e7eb] text-[#111111]",
    variant === "criticalSolid" && "bg-[#dc2626] text-white",
    variant === "brandOutline" && "border border-[#ff6f0f] bg-white text-[#ff6f0f]",
    variant === "neutralOutline" && "border border-black/10 bg-white text-black",
    variant === "ghost" && "bg-transparent text-[#111827]",
    className,
  );
}

export function ActionButton(props: ActionButtonProps) {
  const {
    children,
    className,
    fullWidth = false,
    leading,
    size = "medium",
    trailing,
    variant = "brandSolid",
  } = props;

  const content = (
    <>
      {leading ? <span className="flex shrink-0 items-center justify-center">{leading}</span> : null}
      <span>{children}</span>
      {trailing ? <span className="flex shrink-0 items-center justify-center">{trailing}</span> : null}
    </>
  );

  const nextClassName = actionButtonClassName({
    className,
    fullWidth,
    size,
    variant,
  });

  if ("pendingFeatureLabel" in props && props.pendingFeatureLabel) {
    return (
      <PendingFeatureLink
        className={nextClassName}
        featureLabel={props.pendingFeatureLabel}
        returnTo={props.returnTo}
      >
        {content}
      </PendingFeatureLink>
    );
  }

  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      className: _className,
      children: _children,
      fullWidth: _fullWidth,
      leading: _leading,
      size: _size,
      trailing: _trailing,
      variant: _variant,
      ...linkProps
    } = props;
    return (
      <Link
        className={nextClassName}
        href={href}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={nextClassName}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type ?? "button"}
    >
      {content}
    </button>
  );
}
