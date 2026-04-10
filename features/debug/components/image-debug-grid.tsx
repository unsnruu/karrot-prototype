"use client";

import { useState } from "react";
import { AppImage } from "@/components/ui/app-image";

type LoadState = "idle" | "loaded" | "error";

type ImageCandidate = {
  label: string;
  src: string;
};

export function ImageDebugGrid({ images }: { images: ImageCandidate[] }) {
  return (
    <div className="space-y-8">
      {images.map((image) => (
        <section className="space-y-3" key={image.src}>
          <div>
            <h2 className="text-lg font-semibold text-black">{image.label}</h2>
            <p className="mt-1 break-all text-xs text-[#667085]">{image.src}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <PlainImgCard src={image.src} />
            <NextImageCard src={image.src} title="next/image" />
            <NextImageCard src={image.src} title="next/image (unoptimized)" unoptimized />
          </div>
        </section>
      ))}
    </div>
  );
}

function PlainImgCard({ src }: { src: string }) {
  const [status, setStatus] = useState<LoadState>("idle");

  return (
    <DebugCard
      description="브라우저 기본 img 태그입니다."
      status={status}
      title="plain img"
    >
      <img
        alt=""
        className="h-full w-full object-cover"
        onError={() => setStatus("error")}
        onLoad={() => setStatus("loaded")}
        src={src}
      />
    </DebugCard>
  );
}

function NextImageCard({
  src,
  title,
  unoptimized = false,
}: {
  src: string;
  title: string;
  unoptimized?: boolean;
}) {
  const [status, setStatus] = useState<LoadState>("idle");

  return (
    <DebugCard
      description={unoptimized ? "Next 최적화를 우회합니다." : "Next 이미지 최적화를 사용합니다."}
      status={status}
      title={title}
    >
      <AppImage
        alt=""
        className="h-full w-full object-cover"
        fill
        onError={() => setStatus("error")}
        onLoad={() => setStatus("loaded")}
        sizes="220px"
        src={src}
        unoptimized={unoptimized}
      />
    </DebugCard>
  );
}

function DebugCard({
  title,
  description,
  status,
  children,
}: {
  title: string;
  description: string;
  status: LoadState;
  children: React.ReactNode;
}) {
  const statusLabel =
    status === "loaded" ? "loaded" : status === "error" ? "error" : "loading";

  const statusClassName =
    status === "loaded"
      ? "bg-[#ecfdf3] text-[#027a48]"
      : status === "error"
        ? "bg-[#fef3f2] text-[#b42318]"
        : "bg-[#f2f4f7] text-[#475467]";

  return (
    <article className="rounded-2xl border border-[#eaecf0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-black">{title}</h3>
          <p className="mt-1 text-xs text-[#667085]">{description}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName}`}>{statusLabel}</span>
      </div>

      <div className="relative mt-4 aspect-square overflow-hidden rounded-xl bg-[#f2f4f7]">
        {children}
      </div>
    </article>
  );
}
