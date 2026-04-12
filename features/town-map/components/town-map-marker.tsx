import { AppImage } from "@/components/ui/app-image";
import { type TownMapPin } from "@/lib/town-map";

export function TownMapMarker({ pin }: { pin: TownMapPin }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pin.left, top: pin.top }}>
      <div className="flex flex-col items-center gap-1">
        <div className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.16)]">
          <AppImage alt="" className="object-contain" fill sizes="38px" src={pin.icon} />
        </div>
        <div className="rounded-[10px] bg-white/92 px-2 py-1 text-center text-[11px] font-semibold leading-[1.25] text-[#36393f] shadow-[0px_2px_8px_rgba(0,0,0,0.12)] whitespace-pre">
          {pin.label}
        </div>
      </div>
    </div>
  );
}
