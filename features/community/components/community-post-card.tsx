import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppImage } from "@/components/ui/app-image";
import { trackElementClicked } from "@/lib/analytics/element-click";
import { type CommunityPost } from "@/lib/community";

const iconChat = "/icons/chat.svg";

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  const pathname = usePathname();

  return (
    <article className="border-b border-[#eceef2] py-4">
      <Link
        className="block"
        href={`/community/${post.id}`}
        onClick={() => {
          trackElementClicked({
            screenName: "community",
            targetType: "card",
            targetName: "community_post_card",
            surface: "post_list",
            path: pathname,
            targetId: post.id,
            destinationPath: `/community/${post.id}`,
          });
        }}
      >
      <div className="mb-3 inline-flex rounded-[4px] bg-[#f3f4f5] px-[6px] py-1 text-[11px] font-medium leading-none text-[#555d6d]">
        {post.topic}
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-medium leading-[1.35] text-black">{post.title}</h2>
          <p className="mt-1 line-clamp-2 text-[14px] leading-[1.4] text-[#555d6d]">{post.excerpt}</p>
        </div>

        {post.image ? (
          <AppImage
            alt=""
            className="h-[100px] w-[100px] shrink-0 rounded-[8px] object-cover"
            height={100}
            src={post.image}
            width={100}
          />
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-[13px] leading-none">
        <p className="min-w-0 text-[#868b94]">
          {post.town} · {post.postedAt} · 조회 {post.views}
        </p>
        <div className="flex shrink-0 items-center gap-3 text-[#b0b3ba]">
          {typeof post.likes === "number" ? (
            <span className="flex items-center gap-1">
              <ThumbUpIcon />
              {post.likes}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <AppImage alt="" className="h-4 w-4" height={16} src={iconChat} width={16} />
            {post.comments}
          </span>
        </div>
      </div>
      </Link>
    </article>
  );
}

function ThumbUpIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 16 16">
      <path d="M6.73 1.16a.75.75 0 0 1 .9.94l-.62 2.41h5.02c.95 0 1.55 1.01 1.1 1.84l-2.52 4.63a1.75 1.75 0 0 1-1.54.91H4.5a1.5 1.5 0 0 1-1.5-1.5V7.4c0-.29.08-.58.24-.83L5.9 2.13a1.75 1.75 0 0 1 .83-.73ZM2 7h-.25A.75.75 0 0 0 1 7.75v3.5c0 .41.34.75.75.75H2V7Z" />
    </svg>
  );
}
