import { SellFlowProvider } from "@/features/home/components/sell-flow-provider";

export default function HomeSellLayout({ children }: { children: React.ReactNode }) {
  return <SellFlowProvider>{children}</SellFlowProvider>;
}
