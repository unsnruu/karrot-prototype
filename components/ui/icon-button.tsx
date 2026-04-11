import Link from "next/link";

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
