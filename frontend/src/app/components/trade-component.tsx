"use client";
import React from "react";
import { useState } from "react";

interface TradeBlockProps {
  apiUrl?: string;
}

export default function TradeBlock({ apiUrl = "http://localhost:8000/trade" }: TradeBlockProps) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState({ usdc: 10000, eth: 0 });

  const handleTrade = async (side: "BUY" | "SELL") => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid ETH amount");
      return;
    }

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, amount: num }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Trade failed");
      } else {
        setBalance(data.balance);
        setAmount("");
        setError(null);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <React.Fragment>
      <div className="p-4 bg-white shadow rounded w-full max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Trade</h2>

        {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

        <div className="flex rounded overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="ETH amount"
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => handleTrade("BUY")}
            className="bg-purple-500 text-white px-4 py-2 text-sm hover:bg-purple-600 transition-colors transition-all duration-500
          hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
          hover:bg-white/20 hover:backdrop-blur-lg hover:shadow-lg hover:text-center"
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade("SELL")}
            className="bg-pink-500 text-white px-4 py-2 text-sm hover:bg-pink-600 transition-colors transition-all duration-500
          hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
          hover:bg-white/20 hover:backdrop-blur-lg hover:shadow-lg hover:text-center"
          >
            Sell
          </button>
        </div>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold mb-2">Balances</h2>
        <p>USDC: ${balance.usdc.toFixed(2)}</p>
        <p>ETH: {balance.eth.toFixed(4)}</p>
      </div>
    </React.Fragment>
  );
}
