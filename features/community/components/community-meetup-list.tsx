import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { ListEmptyState, ListSection } from "@/components/ui/list-section";
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
    <ListSection
      className="bg-white px-4 py-6"
      empty={
        meetups.length === 0 ? (
          <ListEmptyState bordered>
            <p className="text-sm text-[#64748b]">{emptyMessage}</p>
          </ListEmptyState>
        ) : undefined
      }
      itemsClassName="space-y-4"
      title={communityMeetupSection.title}
      titleMeta={communityMeetupSection.description}
      trailing={
        <PendingFeatureLink className="shrink-0 text-[14px] font-medium text-[#4a5565]" featureLabel="모임 전체 보기" returnTo="/community?tab=meetup">
          전체보기 ›
        </PendingFeatureLink>
      }
    >
      {meetups.map((meetup) => (
        <CommunityMeetupCard key={meetup.id} meetup={meetup} />
      ))}
    </ListSection>
  );
}
