import Image from "next/image";
import { PendingFeatureLink } from "@/components/ui/pending-feature-link";

export type MyKarrotShortcutItem = {
  label: string;
  iconSrc: string;
  hasDot?: boolean;
};

export function MyKarrotShortcutGrid({ shortcuts }: { shortcuts: MyKarrotShortcutItem[] }) {
  return (
    <section className="rounded-2xl bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="grid grid-cols-3 gap-4">
        {shortcuts.map((item) => (
          <PendingFeatureLink
            className="flex flex-col items-center gap-2"
            featureLabel={item.label}
            key={item.label}
            returnTo="/my-karrot"
            tracking={{
              screenName: "my_karrot",
              targetType: "shortcut",
              targetName: "my_karrot_shortcut_item",
              surface: "shortcut_grid",
              path: "/my-karrot",
              targetId: item.label,
            }}
          >
            <span className="relative flex h-[26px] w-[26px] items-center justify-center">
              <Image alt="" height={26} src={item.iconSrc} width={26} />
              {item.hasDot ? (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff6900]" />
              ) : null}
            </span>
            <span className="text-xs font-medium leading-[18px] text-[#4a5565]">{item.label}</span>
          </PendingFeatureLink>
        ))}
      </div>
    </section>
  );
}
