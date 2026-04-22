import { Plus } from "lucide-react";
import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { communityCategories } from "@/lib/community";

export function CommunityCategoryRail({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
      {communityCategories.map((category) => (
        <PendingFeatureLink
          className="w-20 shrink-0"
          featureLabel={category.label}
          key={category.id}
          returnTo="/community"
          tracking={{
            screenName: "community",
            targetType: "category",
            targetName: "community_category_rail_item",
            surface: "category_rail",
            path: "/community",
            targetId: category.id,
          }}
        >
          <div className="mx-auto relative h-16 w-16">
            <AppImage
              alt={category.label}
              className="h-16 w-16 rounded-full object-cover"
              height={64}
              src={category.image}
              width={64}
            />
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>
          <span className="mt-2 block text-center text-[12px] leading-4 tracking-[-0.02em] text-[#0a0a0a]">
            {category.label}
          </span>
        </PendingFeatureLink>
      ))}
    </div>
  );
}
