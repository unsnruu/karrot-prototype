import Image from "next/image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";
import { prototypeViewerUser } from "@/lib/prototype-user";

export function MyKarrotProfileCard({ profileAvatarSrc }: { profileAvatarSrc: string }) {
  return (
    <PendingFeatureLink
      className="block rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
      featureLabel="내 프로필 보기"
      returnTo="/my-karrot"
      tracking={{
        screenName: "my_karrot",
        targetType: "card",
        targetName: "my_karrot_profile_card",
        surface: "profile",
        path: "/my-karrot",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e5e7eb]">
            <Image alt="" height={28} src={profileAvatarSrc} width={28} />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold leading-[25.5px] tracking-[-0.03em] text-[#0a0a0a]">
              {prototypeViewerUser.name}
            </span>
            <span className="text-xs font-semibold leading-[18px] text-[#ff6900]">
              {prototypeViewerUser.mannerScore.toFixed(1)}°C
            </span>
          </div>
        </div>
        <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
          ›
        </span>
      </div>
    </PendingFeatureLink>
  );
}
