"use client";

import { AppImage } from "@/components/ui/app-image";
import { IconButton } from "@/components/ui/icon-button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  HomeIcon,
  MoreVerticalIcon,
  ShareIcon,
} from "@/features/home/components/item-detail-icons";

export function ItemDetailHero({ image, title }: { image: string; title: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    const from = searchParams.get("from");

    if (from) {
      router.push(from);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/home");
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
          <IconButton ariaLabel="홈으로" href="/home">
            <HomeIcon />
          </IconButton>
        </div>
        <div className="flex items-center gap-[7px]">
          <IconButton ariaLabel="공유하기">
            <ShareIcon />
          </IconButton>
          <IconButton ariaLabel="더보기">
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
