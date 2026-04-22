import {
  ArrowLeft,
  Bell,
  ChevronRight,
  EllipsisVertical,
  Heart,
  House,
  Info,
  Share,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ArrowLeftIcon() {
  return <ArrowLeft absoluteStrokeWidth height={32} strokeWidth={2.2} width={32} />;
}

export function HomeIcon() {
  return <House absoluteStrokeWidth height={32} strokeWidth={2} width={32} />;
}

export function ShareIcon() {
  return <Share absoluteStrokeWidth height={32} strokeWidth={2} width={32} />;
}

export function MoreVerticalIcon({ className }: { className?: string }) {
  return <EllipsisVertical absoluteStrokeWidth className={cn("h-6 w-6", className)} strokeWidth={2} />;
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return <ChevronRight absoluteStrokeWidth className={cn("h-4 w-4", className)} strokeWidth={1.6} />;
}

export function InfoIcon({ className }: { className?: string }) {
  return <Info absoluteStrokeWidth className={cn("h-5 w-5 text-[#8b8c91]", className)} strokeWidth={1.8} />;
}

export function BellIcon() {
  return <Bell absoluteStrokeWidth height={16} strokeWidth={1.8} width={16} />;
}

export function HeartIcon() {
  return <Heart absoluteStrokeWidth height={24} strokeWidth={1.8} width={24} />;
}
