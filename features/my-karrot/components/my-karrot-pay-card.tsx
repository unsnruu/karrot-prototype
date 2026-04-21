import Image from "next/image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";

export function MyKarrotPayCard({ payCardIconSrc }: { payCardIconSrc: string }) {
  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8a3d] text-[10px] font-bold text-white">
            P
          </span>
          <span className="text-sm font-bold leading-[21px] text-[#ff8a3d]">pay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base font-bold leading-6 text-[#0a0a0a]">8,700원</span>
          <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
            ›
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm font-medium leading-[21px] text-[#364153]">
          <PendingFeatureLink featureLabel="당근페이 충전" returnTo="/my-karrot">충전</PendingFeatureLink>
          <PendingFeatureLink featureLabel="당근페이 송금" returnTo="/my-karrot">송금</PendingFeatureLink>
        </div>
        <PendingFeatureLink
          className="inline-flex h-[35px] items-center gap-2 rounded-full bg-[#101828] px-4 text-[13px] font-semibold leading-[19.5px] text-white"
          featureLabel="당근페이 결제"
          returnTo="/my-karrot"
        >
          <Image alt="" height={16} src={payCardIconSrc} width={16} />
          결제
        </PendingFeatureLink>
      </div>
    </section>
  );
}
