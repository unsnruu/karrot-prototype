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
    <section className="mt-6">
      <div className="mb-5">
        <h2 className="text-[22px] font-bold tracking-[-0.03em] text-black">{communityMeetupSection.title}</h2>
        <p className="mt-2 text-sm text-[#556070]">{communityMeetupSection.description}</p>
      </div>

      {meetups.length === 0 ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-[#dbe1ea] px-4 py-12 text-center">
          <p className="text-sm text-[#64748b]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {meetups.map((meetup) => (
            <CommunityMeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </div>
      )}
    </section>
  );
}
