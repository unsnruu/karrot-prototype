import Image from "next/image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";

export type MyKarrotMenuItem = {
  label: string;
  iconSrc: string;
};

export function MyKarrotMenuGroup({
  title,
  items,
}: {
  title: string;
  items: MyKarrotMenuItem[];
}) {
  return (
    <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <h2 className="mb-2 text-[15px] font-bold leading-[22.5px] text-[#0a0a0a]">{title}</h2>
      <div>
        {items.map((item) => (
          <PendingFeatureLink
            className="flex w-full items-center justify-between py-3 text-left"
            featureLabel={item.label}
            key={item.label}
            returnTo="/my-karrot"
          >
            <span className="flex items-center gap-3">
              <Image alt="" height={22} src={item.iconSrc} width={22} />
              <span className="text-[15px] font-medium leading-[22.5px] text-[#1e2939]">{item.label}</span>
            </span>
            <span aria-hidden="true" className="text-[20px] text-[#c9ced6]">
              ›
            </span>
          </PendingFeatureLink>
        ))}
      </div>
    </section>
  );
}
