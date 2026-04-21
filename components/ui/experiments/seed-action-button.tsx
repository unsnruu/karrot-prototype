import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import { ActionButton as SeedActionButton } from "@seed-design/react";
import Link from "next/link";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { cn } from "@/lib/utils";

type SeedActionButtonVariant =
  | "brandSolid"
  | "neutralSolid"
  | "neutralWeak"
  | "criticalSolid"
  | "brandOutline"
  | "neutralOutline"
  | "ghost";

type SeedActionButtonSize = "small" | "medium" | "large";

type SharedStyleProps = {
  className?: string;
  fullWidth?: boolean;
  size?: SeedActionButtonSize;
  variant?: SeedActionButtonVariant;
};

type SharedProps = SharedStyleProps & {
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
};

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> & {
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

type SeedActionButtonExperimentProps = ButtonProps | LinkButtonProps | PendingButtonProps;

function seedActionButtonExperimentClassName({ className, fullWidth = false }: SharedStyleProps) {
  return cn(fullWidth && "w-full", className);
}

export function SeedActionButtonExperiment(props: SeedActionButtonExperimentProps) {
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

  const nextClassName = seedActionButtonExperimentClassName({
    className,
    fullWidth,
  });

  if ("pendingFeatureLabel" in props && props.pendingFeatureLabel) {
    return (
      <SeedActionButton
        asChild
        className={nextClassName}
        flexGrow={fullWidth ? 1 : undefined}
        size={size}
        variant={variant}
      >
        <PendingFeatureLink featureLabel={props.pendingFeatureLabel} returnTo={props.returnTo}>
          {content}
        </PendingFeatureLink>
      </SeedActionButton>
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
      <SeedActionButton
        asChild
        className={nextClassName}
        flexGrow={fullWidth ? 1 : undefined}
        size={size}
        variant={variant}
      >
        <Link href={href} {...linkProps}>
          {content}
        </Link>
      </SeedActionButton>
    );
  }

  const buttonProps = props as ButtonProps;
  const {
    className: _className,
    children: _children,
    fullWidth: _fullWidth,
    leading: _leading,
    size: _size,
    trailing: _trailing,
    variant: _variant,
    ...seedButtonProps
  } = buttonProps;

  return (
    <SeedActionButton
      className={nextClassName}
      flexGrow={fullWidth ? 1 : undefined}
      size={size}
      type={seedButtonProps.type ?? "button"}
      variant={variant}
      {...seedButtonProps}
    >
      {content}
    </SeedActionButton>
  );
}
