"use client";

import { useEffect, useState } from "react";

export default function Price() {
    const [ethPrice, setEthPrice] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch("http://localhost:8000/price");
                const data = await res.json();
                if (data.price) {
                    setEthPrice(data.price);
                    setLastUpdated(new Date());
                    setError(null);
                } else {
                    setError("Failed to get price");
                }
            } catch (err) {
                setError("Failed to fetch price");
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">ETH/USD</h2>
                {lastUpdated && (
                    <span className="text-xs text-gray-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {ethPrice ? (
                <p className="text-2xl font-mono">${ethPrice.toFixed(2)}</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
