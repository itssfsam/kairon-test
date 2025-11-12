"use client";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { usePriceStore } from "../store/use-price-store";

export default function PriceChart() {
  const prices = usePriceStore((state) => state.prices);

  if (prices.length === 0) return <div>No data yet</div>;

  return (
    <div className="w-full h-full p-5">
      <Sparklines data={prices} limit={6} width={100} height={30}>
        <SparklinesLine color="blue" />
      </Sparklines>
    </div>
  );
}
