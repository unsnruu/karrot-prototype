import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { cn } from "@/lib/utils";

type FieldButtonTone = "framed" | "line";

type SharedProps = {
  className?: string;
  description?: ReactNode;
  label: ReactNode;
  placeholder?: ReactNode;
  tone?: FieldButtonTone;
  value?: ReactNode;
};

type LinkProps = SharedProps & {
  href: string;
  onClick?: ComponentPropsWithoutRef<typeof Link>["onClick"];
  pendingFeatureLabel?: never;
  returnTo?: never;
};

type PendingLinkProps = SharedProps & {
  href?: never;
  onClick?: ComponentPropsWithoutRef<typeof PendingFeatureLink>["onClick"];
  pendingFeatureLabel: string;
  returnTo?: string;
  tracking?: ComponentPropsWithoutRef<typeof PendingFeatureLink>["tracking"];
};

type ButtonProps = SharedProps & {
  href?: never;
  onClick?: () => void;
  pendingFeatureLabel?: never;
  returnTo?: never;
};

type FieldButtonProps = LinkProps | PendingLinkProps | ButtonProps;

export function FieldButton({
  className,
  description,
  label,
  placeholder,
  tone = "framed",
  value,
  ...props
}: FieldButtonProps) {
  const isEmpty = value == null || value === "";
  const content = (
    <div className="flex w-full items-center justify-between gap-3 text-left">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-[#374151]">{label}</p>
        {description ? <p className="mt-1 text-[13px] leading-[1.5] text-[#99a1af]">{description}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1 text-[14px] font-medium">
        <span className={isEmpty ? "text-[#99a1af]" : "text-[#374151]"}>
          {isEmpty ? placeholder : value}
        </span>
        <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#9ca3af]" strokeWidth={1.5} />
      </div>
    </div>
  );

  const nextClassName = cn(
    tone === "framed" && "flex min-h-[52px] items-center rounded-[14px] border border-[#e5e7eb] px-4 py-3",
    tone === "line" && "flex h-[54px] items-center border-b border-black/5",
    className,
  );

  if ("pendingFeatureLabel" in props && props.pendingFeatureLabel) {
    return (
      <PendingFeatureLink
        className={nextClassName}
        featureLabel={props.pendingFeatureLabel}
        onClick={props.onClick}
        returnTo={props.returnTo}
        tracking={props.tracking}
      >
        {content}
      </PendingFeatureLink>
    );
  }

  if ("href" in props && props.href) {
    return (
      <Link className={nextClassName} href={props.href} onClick={props.onClick}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button className={cn(nextClassName, "w-full")} onClick={buttonProps.onClick} type="button">
      {content}
    </button>
  );
}
