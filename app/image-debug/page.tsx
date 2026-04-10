import Link from "next/link";
import { ImageDebugGrid } from "@/features/debug/components/image-debug-grid";
import { getHomeFeedPage } from "@/lib/server-data";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export default async function ImageDebugPage() {
  const { items } = await getHomeFeedPage();
  const sampleImages = items.slice(0, 3).map((item, index) => ({
    label: `${index + 1}. ${item.title}`,
    src: item.image,
  }));
  const usesSupabaseEnv = hasSupabaseEnv();
  const imageKinds = sampleImages.map((image) => ({
    src: image.src,
    kind: classifyImageSrc(image.src),
  }));

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 text-[#101828]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#667085]">Image Debug</p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-black">이미지 로딩 테스트 페이지</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#475467]">
              같은 이미지를 세 방식으로 비교합니다. `plain img`만 보이고 `next/image`가 안 보이면 Next 이미지 최적화 경로 문제일 가능성이 높습니다.
            </p>
          </div>
          <Link className="rounded-full border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-semibold text-black" href="/home">
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-[#eaecf0] bg-white p-5">
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <StatusRow
              label="Supabase env"
              value={usesSupabaseEnv ? "configured" : "missing"}
            />
            <StatusRow
              label="current image source"
              value={imageKinds.map((item) => item.kind).join(", ")}
            />
          </div>
          <ul className="space-y-2 text-sm leading-6 text-[#475467]">
            <li>`current image source`가 `local-static`이면 프로젝트 내부 정적 이미지를 쓰고 있는 상태입니다.</li>
            <li>`api-route`면 `/api/item-images/...` 경로로 이미지를 받고 있는 상태입니다.</li>
            <li>`plain img`와 `next/image (unoptimized)`가 보이는데 `next/image`만 안 보이면 최적화 fetch 이슈일 가능성이 큽니다.</li>
            <li>셋 다 안 보이면 원본 이미지 URL 자체가 브라우저에서 접근 불가한 상태일 수 있습니다.</li>
            <li>셋 다 보이면 홈 화면에서의 문제는 레이아웃이나 스타일 쪽일 가능성이 더 큽니다.</li>
          </ul>
        </div>

        <div className="mt-8">
          <ImageDebugGrid images={sampleImages} />
        </div>
      </div>
    </main>
  );
}

function classifyImageSrc(src: string) {
  if (src.startsWith("/api/item-images/")) {
    return "api-route";
  }

  if (src.startsWith("/")) {
    return "local-static";
  }

  if (src.startsWith("http")) {
    return "remote-url";
  }

  return "unknown";
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f8fafc] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#667085]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-black">{value}</p>
    </div>
  );
}
