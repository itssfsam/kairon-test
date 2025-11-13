"use client";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { usePriceStore } from "../store/use-price-store";

export default function PriceChart() {
  const prices = usePriceStore((state) => state.prices);

  if (prices.length === 0) return <div>No data yet</div>;
  
  return (
    <div className="w-full h-full p-5">
      <Sparklines data={prices} limit={6} width={100} height={30} min={Math.min(...prices) * 0.999} max={Math.max(...prices) * 1.0001}>
        <SparklinesLine color="blue" />
      </Sparklines>
    </div>
  );
}
