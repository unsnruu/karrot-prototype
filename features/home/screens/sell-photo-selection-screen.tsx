"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { useSellFlow } from "@/features/home/components/sell-flow-provider";
import { SELL_FLOW_MAX_PHOTOS, SELL_FLOW_SAMPLE_PHOTOS } from "@/lib/sell-flow";

export function SellPhotoSelectionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, hydrated, resetDraft, togglePhoto } = useSellFlow();
  const [aiBundleEnabled, setAiBundleEnabled] = useState(false);
  const [aiWritingEnabled, setAiWritingEnabled] = useState(true);
  const shouldReset = searchParams.get("reset") === "1";

  useEffect(() => {
    if (!hydrated || !shouldReset) {
      return;
    }

    resetDraft();
    router.replace("/home/sell");
  }, [hydrated, resetDraft, router, shouldReset]);

  const selectedCount = draft.photos.length;

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white pb-[168px]">
        <header className="flex h-14 items-center justify-between px-4">
          <Link aria-label="홈으로 돌아가기" className="flex h-10 w-10 items-center justify-center" href="/home">
            <CloseIcon />
          </Link>
          <button className="flex items-center gap-1 text-[15px] font-semibold text-[#111827]" type="button">
            최근 항목
            <ChevronDownIcon />
          </button>
          <div className="h-10 w-10" />
        </header>

        <section className="px-4 pb-2 pt-2">
          <p className="text-[15px] font-semibold leading-[1.45] text-[#2a2f36]">
            다양한 각도 및 브랜드, 모델명이 보이는 사진을 선택해주세요.
          </p>
          <p className="text-[15px] font-semibold leading-[1.45] text-[#2a2f36]">
            <span className="mr-1 text-[#ff6f0f]">✦</span>
            AI가 더 정확하고 자세한 글을 작성해요.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-px bg-[#f3f4f6]">
          <button
            className="flex aspect-square flex-col items-center justify-center gap-3 bg-white text-[#2d3138]"
            type="button"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-white">
              <CameraIcon />
            </div>
            <span className="text-[15px] font-medium">카메라</span>
          </button>

          {SELL_FLOW_SAMPLE_PHOTOS.map((photo, index) => {
            const selectedIndex = draft.photos.indexOf(photo);
            const isSelected = selectedIndex >= 0;

            return (
              <button
                className="relative aspect-square overflow-hidden bg-[#f5f5f5]"
                key={photo}
                onClick={() => togglePhoto(photo)}
                type="button"
              >
                <AppImage
                  alt={`선택 가능한 사진 ${index + 1}`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="33vw"
                  src={photo}
                />

                {isSelected ? (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#111827] shadow">
                    {selectedIndex + 1}
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 h-7 w-7 rounded-full border-2 border-white bg-black/10" />
                )}
              </button>
            );
          })}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]">
        <div className="mobile-shell">
          <ToggleRow
            description="AI가 사진을 분류하여 묶음별로 게시글을 작성해요"
            label="여러 물건 글쓰기"
            selectedCountLabel="사진 최대 30장"
            value={aiBundleEnabled}
            onChange={setAiBundleEnabled}
          />
          <ToggleRow
            className="mt-4"
            description={null}
            label="AI로 작성해요"
            value={aiWritingEnabled}
            onChange={setAiWritingEnabled}
          />

          <div className="mt-5 flex gap-3">
            <button
              className="flex h-[56px] w-[104px] items-center justify-center rounded-[16px] bg-[#f3f4f6] text-[18px] font-semibold text-[#111827]"
              type="button"
            >
              편집
            </button>
            <button
              className={`flex h-[56px] flex-1 items-center justify-center rounded-[16px] text-[20px] font-bold transition-colors ${
                selectedCount > 0 ? "bg-[#2b3138] text-white" : "bg-[#d1d5db] text-[#9ca3af]"
              }`}
              disabled={selectedCount === 0}
              onClick={() => router.push("/home/sell/write")}
              type="button"
            >
              {selectedCount > 0 ? `${selectedCount}장 올리기` : `0/${SELL_FLOW_MAX_PHOTOS}`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ToggleRow({
  label,
  description,
  selectedCountLabel,
  value,
  onChange,
  className = "",
}: {
  label: string;
  description: string | null;
  selectedCountLabel?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[18px] font-bold leading-none text-[#111827]">{label}</p>
            {selectedCountLabel ? (
              <span className="rounded-full bg-[#2563eb] px-2 py-1 text-[12px] font-semibold leading-none text-white">
                {selectedCountLabel}
              </span>
            ) : null}
          </div>
          {description ? <p className="mt-2 text-[14px] leading-[1.5] text-[#6b7280]">{description}</p> : null}
        </div>

        <button
          aria-pressed={value}
          className={`relative mt-1 h-[34px] w-[58px] rounded-full transition-colors ${
            value ? "bg-[#111827]" : "bg-[#d1d5db]"
          }`}
          onClick={() => onChange(!value)}
          type="button"
        >
          <span
            className={`absolute top-1 h-[26px] w-[26px] rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-[28px]" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-[#111827]" fill="none" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 8.5h3.2l1.3-2h7l1.3 2H20a1.5 1.5 0 0 1 1.5 1.5V17A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17v-7A1.5 1.5 0 0 1 4 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
