"use client";

import { useEffect, useState } from "react";
import { usePriceStore } from "../store/use-price-store";
import PriceChart from "./price-chart";

export default function Price() {
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const recordPrice = usePriceStore((state) => state.recordPrice);
    const price = usePriceStore((state) => state.prices.at(-1) ?? 0);
    const pricesDebug = usePriceStore((state) => state.prices);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_K_API_URL}/price`);
                const data = await res.json();
                if (data.price) {
                    setLastUpdated(new Date());
                    setError(null);
                    recordPrice(data.price);
                } else {
                    recordPrice(0);
                    setError("Failed to get price");
                }
            } catch (err) {
                setError("Failed to fetch price");
            }
        };

        fetchPrice();
        // Encountered rate limit error on 5000
        // Also increased to 10000 for the sake of sparkline calculation
        const interval = setInterval(fetchPrice, 10000);
        return () => clearInterval(interval);
    }, []);

    return (

        <div className="p-4 bg-white/30 shadow rounded flex flex-col min-h-[20rem] backdrop-blur-md border border-white/20">
            <div className="flex justify-between items-center m-4">
                <h2 className="text-lg font-semibold">ETH/USD</h2>
                {lastUpdated && (
                    <span className="text-xs text-white">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {price ? (
                <p className="text-2xl font-mono m-4">${price.toFixed(2)}</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p>Loading...</p>
            )}
            <PriceChart />
        </div>
    );
}
