import Image from "next/image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";

export type MyKarrotServiceItem = {
  label: string;
  iconSrc: string;
  bubble: string;
};

export function MyKarrotServiceSection({
  title,
  items,
}: {
  title: string;
  items: MyKarrotServiceItem[];
}) {
  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold leading-[22.5px] tracking-[-0.03em] text-[#0a0a0a]">{title}</h2>
        <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
          ›
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(152px,1fr))] gap-x-4 gap-y-5">
        {items.map((item) => (
          <PendingFeatureLink className="flex min-h-9 items-center gap-3" featureLabel={item.label} key={item.label} returnTo="/my-karrot">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: item.bubble }}
            >
              <Image alt="" height={20} src={item.iconSrc} width={20} />
            </span>
            <span className="text-[14px] font-medium leading-[21px] tracking-[-0.02em] text-[#1e2939]">
              {item.label}
            </span>
          </PendingFeatureLink>
        ))}
      </div>
    </section>
  );
}
