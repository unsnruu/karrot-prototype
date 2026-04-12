import { AppImage } from "@/components/ui/app-image";
import { type TownMapPost } from "@/lib/town-map";

export function TownMapPostCard({ post }: { post: TownMapPost }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="relative mt-0.5 h-5 w-5 shrink-0 overflow-hidden rounded-full">
          <AppImage alt="" className="object-cover" fill sizes="20px" src={post.avatar} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className="text-[14px] font-semibold leading-[1.5] text-black">{post.businessName}</span>
            <span className="text-[13px] text-[#b0b3ba]">{post.category}</span>
            <span className="text-[13px] text-[#b0b3ba]">·</span>
            <span className="text-[13px] text-[#b0b3ba]">{post.postedAt}</span>
            <span className="text-[13px] text-[#b0b3ba]">·</span>
            <span className="text-[13px] text-[#b0b3ba]">{post.distance}</span>
          </div>
          <h2 className="mt-2 text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-black">{post.title}</h2>
          <p className="mt-0.5 whitespace-pre-line text-[16px] leading-[1.5] text-black">{post.excerpt}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[2px] overflow-hidden rounded-[20px]">
        {post.images.map((image, index) => (
          <div className="relative h-40" key={`${post.id}-${index}`}>
            <AppImage
              alt={`${post.businessName} 이미지 ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 50vw, 280px"
              src={image}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
