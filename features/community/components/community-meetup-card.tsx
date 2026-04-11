import { AppImage } from "@/components/ui/app-image";
import { type CommunityMeetup } from "@/lib/community";

export function CommunityMeetupCard({ meetup }: { meetup: CommunityMeetup }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#eceef2] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <AppImage
        alt={meetup.title}
        className="h-48 w-full object-cover"
        height={192}
        src={meetup.image}
        width={320}
      />

      <div className="p-5">
        {meetup.status ? (
          <span className="inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-xs font-semibold text-[#ff6f0f]">
            {meetup.status}
          </span>
        ) : null}

        <h2 className="mt-3 text-[18px] font-semibold leading-[1.35] tracking-[-0.03em] text-black">
          {meetup.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.5] text-[#556070]">{meetup.excerpt}</p>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#868b94]">
          <span>{meetup.location}</span>
          <span>{meetup.members}명</span>
        </div>
      </div>
    </article>
  );
}
