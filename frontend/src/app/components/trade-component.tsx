"use client";
import React, { useEffect, useState } from "react";
import DownloadTradesButton from "./download-trades-button";

interface TradeBlockProps {
  apiUrl?: string;
}

interface Trade {
  id: string;
  side: "BUY" | "SELL";
  amount: number;
  timestamp: string;
}

export default function TradeBlock({ apiUrl = `${process.env.NEXT_PUBLIC_K_API_URL}/trade` }: TradeBlockProps) {
  const [amount, setAmount] = useState<string>(() => {
    try {
      return localStorage.getItem("amount") || "";
    } catch {
      return "";
    }
  });

  const [error, setError] = useState<string | null>(() => {
    try {
      return localStorage.getItem("error") || null;
    } catch {
      return null;
    }
  });

  const [balance, setBalance] = useState<{ usdc: number; eth: number }>(() => {
    try {
      const saved = localStorage.getItem("balance");
      return saved ? JSON.parse(saved) : { usdc: 10000, eth: 0 };
    } catch {
      return { usdc: 10000, eth: 0 };
    }
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      const saved = localStorage.getItem("trades");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist states to localStorage
  useEffect(() => localStorage.setItem("amount", amount), [amount]);
  useEffect(() => {
    if (error === null) localStorage.removeItem("error");
    else localStorage.setItem("error", error);
  }, [error]);
  useEffect(() => localStorage.setItem("balance", JSON.stringify(balance)), [balance]);
  useEffect(() => localStorage.setItem("trades", JSON.stringify(trades)), [trades]);

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

        // Add new trade at the top
        const newTrade: Trade = {
          id: Date.now().toString(),
          side,
          amount: num,
          timestamp: new Date().toISOString(),
        };
        setTrades([newTrade, ...trades]);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <React.Fragment>
      {/* Trade Form */}
      <div className="flex gap-4">
      <div className="p-4 bg-white shadow rounded w-full mx-auto mb-4">
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
            className="w-3/10 flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => handleTrade("BUY")}
            className="w-3/10 bg-purple-500 text-white px-4 py-2 text-sm hover:bg-purple-600 transition-all duration-300"
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade("SELL")}
            className="w-3/10 bg-pink-500 text-white px-4 py-2 text-sm hover:bg-pink-600 transition-all duration-300"
          >
            Sell
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="p-4 bg-white shadow rounded w-full mx-auto mb-4">
        <h2 className="text-lg font-semibold mb-2">Balances</h2>
        <p>USDC: ${balance.usdc.toFixed(2)}</p>
        <p>ETH: {balance.eth.toFixed(4)}</p>
      </div>
</div>
      {/* Trade History */}
      <div className="p-4 bg-white shadow rounded w-full mx-auto">
        <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-2">Trade History</h2>
          <DownloadTradesButton />
        </div>
        {trades.length === 0 ? (
          <p className="text-gray-500 italic">No trades yet</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">Side</th>
                <th className="border-b py-2">Amount</th>
                <th className="border-b py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, idx) => (
                <tr key={trade.id} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="py-1 px-2">{trade.side}</td>
                  <td className="py-1 px-2">{trade.amount.toFixed(4)}</td>
                  <td className="py-1 px-2">{new Date(trade.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </React.Fragment>
  );
}
