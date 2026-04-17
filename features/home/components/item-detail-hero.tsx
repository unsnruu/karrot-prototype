"use client";

import { AppImage } from "@/components/ui/app-image";
import { IconButton } from "@/components/ui/icon-button";
import { buildPendingFeatureHref } from "@/lib/tab-navigation";
import { useRouter } from "next/navigation";
import { useHomeNavigationHistory } from "@/features/home/components/home-navigation-history-provider";
import { usePathname } from "next/navigation";
import { resolveHomeHrefFromPathname } from "@/lib/home-experiment";
import {
  ArrowLeftIcon,
  HomeIcon,
  MoreVerticalIcon,
  ShareIcon,
} from "@/features/home/components/item-detail-icons";

export function ItemDetailHero({
  image,
  title,
  returnTo,
}: {
  image: string;
  title: string;
  returnTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { getPreviousPath } = useHomeNavigationHistory();
  const homeHref = returnTo ?? resolveHomeHrefFromPathname(pathname);

  const handleBack = () => {
    if (returnTo) {
      router.replace(returnTo);
      return;
    }

    const previousPath = getPreviousPath();

    if (previousPath) {
      router.push(previousPath);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(resolveHomeHrefFromPathname(pathname));
  };

  return (
    <section className="relative">
      <AppImage
        alt={title}
        className="h-[clamp(320px,100vw,430px)] w-full object-cover"
        height={430}
        priority
        src={image}
        width={430}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pb-2 pt-7 text-white sm:px-6">
        <div className="flex items-center gap-[15px]">
          <IconButton ariaLabel="뒤로가기" onClick={handleBack}>
            <ArrowLeftIcon />
          </IconButton>
          <IconButton ariaLabel="홈으로" href={homeHref}>
            <HomeIcon />
          </IconButton>
        </div>
        <div className="flex items-center gap-[7px]">
          <IconButton ariaLabel="공유하기" href={buildPendingFeatureHref(homeHref, "상품 공유하기")}>
            <ShareIcon />
          </IconButton>
          <IconButton ariaLabel="더보기" href={buildPendingFeatureHref(homeHref, "상품 상세 메뉴")}>
            <MoreVerticalIcon />
          </IconButton>
        </div>
      </header>

      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
        1 / 1
      </div>
    </section>
  );
}
