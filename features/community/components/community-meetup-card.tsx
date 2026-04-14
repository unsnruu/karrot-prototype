import { AppImage } from "@/components/ui/app-image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { type CommunityMeetup } from "@/lib/community";

export function CommunityMeetupCard({ meetup }: { meetup: CommunityMeetup }) {
  return (
    <PendingFeatureLink className="flex items-start gap-3" featureLabel="모임 상세 보기" returnTo="/community?tab=meetup">
      <AppImage
        alt={meetup.title}
        className="h-20 w-20 shrink-0 rounded-[10px] object-cover"
        height={80}
        src={meetup.image}
        width={80}
      />

      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="truncate text-[18px] font-semibold leading-[1.5] tracking-[-0.03em] text-[#0a0a0a]">
          {meetup.title}
        </h2>
        <p className="mt-1 line-clamp-1 text-[14px] leading-5 tracking-[-0.015em] text-[#4a5565]">{meetup.excerpt}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[12px] leading-4 text-[#6a7282]">
          <span>{meetup.location}</span>
          <span>•</span>
          <span>{meetup.members}명</span>
          {meetup.status ? (
            <>
              <span>•</span>
              <span>{meetup.status}</span>
            </>
          ) : null}
        </div>
      </div>
    </PendingFeatureLink>
  );
}
