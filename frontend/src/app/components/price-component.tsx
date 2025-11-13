"use client";

import { useEffect, useState } from "react";
import { usePriceStore } from "../store/use-price-store";
import PriceChart from "./price-chart";
import { Theme, useTheme } from "./theme-provider";

export default function Price() {
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const recordPrice = usePriceStore((state) => state.recordPrice);
    const price = usePriceStore((state) => state.prices.at(-1) ?? 0);
    const previousPrice = usePriceStore((state) => state.prices.at(-2) ?? 0);
    const { theme } = useTheme();

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
            <div className="flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${theme === Theme.DARK ? "text-gray-100" : "text-gray-800"}`}>ETH/USD</h2>
                {lastUpdated && (
                    <span className="text-xs font-semibold text-white">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {price ? (
                <p className={`text-2xl font-mono mt-2 ${price >= previousPrice ? "text-green-500" : "text-red-500"}`}>${price.toFixed(2)}</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p>Loading...</p>
            )}
            <PriceChart />
        </div>
    );
}
