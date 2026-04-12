import { AppImage } from "@/components/ui/app-image";
import { type TownMapQuickAction } from "@/lib/town-map";

export function TownMapQuickActionCard({ action }: { action: TownMapQuickAction }) {
  return (
    <button className="flex flex-col items-center gap-2 text-center" type="button">
      <div className="relative h-[58px] w-[68px] overflow-hidden rounded-[19px] border border-black/10 bg-white">
        <AppImage alt={action.label} className="object-cover" fill sizes="68px" src={action.image} />
      </div>
      <span className="text-[13px] font-semibold leading-[1.25] text-black">{action.label}</span>
    </button>
  );
}
