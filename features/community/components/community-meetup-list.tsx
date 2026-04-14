import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { CommunityMeetupCard } from "@/features/community/components/community-meetup-card";
import { communityMeetupSection, type CommunityMeetup } from "@/lib/community";

type CommunityMeetupListProps = {
  meetups: CommunityMeetup[];
  emptyMessage?: string;
};

export function CommunityMeetupList({
  meetups,
  emptyMessage = "모임 글이 아직 없어요.",
}: CommunityMeetupListProps) {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold leading-7 tracking-[-0.03em] text-[#0a0a0a]">
            {communityMeetupSection.title}
          </h2>
          <p className="mt-1 text-[13px] leading-5 tracking-[-0.015em] text-[#6a7282]">
            {communityMeetupSection.description}
          </p>
        </div>
        <PendingFeatureLink className="shrink-0 text-[14px] font-medium text-[#4a5565]" featureLabel="모임 전체 보기" returnTo="/community?tab=meetup">
          전체보기 ›
        </PendingFeatureLink>
      </div>

      {meetups.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-[#dbe1ea] px-4 py-12 text-center">
          <p className="text-sm text-[#64748b]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetups.map((meetup) => (
            <CommunityMeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </div>
      )}
    </section>
  );
}
