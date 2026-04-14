"use client";

import { useRouter } from "next/navigation";

export function DevelopmentPendingScreen({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  };

  return (
    <main className="flex min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell-wide flex min-h-screen flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm rounded-[28px] border border-[#eef2f6] bg-[#f8fafc] px-6 py-10 text-center shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          <p className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#111827]">
            아직 이 기능을 개발되지 않았어요
          </p>
          <button
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[14px] bg-[#ff6f0f] px-5 text-[16px] font-semibold text-white"
            onClick={handleBack}
            type="button"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </main>
  );
}
