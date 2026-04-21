import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type TownMapBusinessNewsPost } from "@/lib/town-map-business-news";

export function TownMapBusinessNewsList({
  backHref,
  businessName,
  newsPosts,
}: {
  backHref: string;
  businessName: string;
  newsPosts: TownMapBusinessNewsPost[];
}) {
  if (!newsPosts.length) {
    return <p className="py-6 text-[14px] leading-5 text-[#9ca3af]">아직 등록된 소식이 없어요.</p>;
  }

  return newsPosts.map((post) => (
    <article className="border-b border-[#edeef0] py-4 first:pt-3 last:border-b-0" key={post.id}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffefe4] text-[11px] font-bold text-[#ff7a00]">
            소식
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-4 text-[#111827]">{businessName}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#9ca3af]">{post.postedAtLabel}</p>
          </div>
        </div>
        <PendingFeatureLink aria-label="소식 더보기" className="px-1 text-[#9ca3af]" featureLabel="소식 메뉴" returnTo={backHref}>
          <KebabIcon />
        </PendingFeatureLink>
      </div>

      <div className="mt-3">
        <p className="whitespace-pre-line text-[15px] leading-6 text-[#111827]">
          <span className="font-bold">{post.title}</span>
          {"\n"}
          {post.body}
        </p>
      </div>

      {post.imageSrc ? (
        <div className="mt-3 overflow-hidden rounded-[4px]">
          <div className="relative aspect-[320/170]">
            <AppImage alt={`${businessName} 소식 이미지`} className="object-cover" fill sizes="(max-width: 640px) 100vw, 360px" src={post.imageSrc} />
          </div>
        </div>
      ) : null}
    </article>
  ));
}

function KebabIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}
