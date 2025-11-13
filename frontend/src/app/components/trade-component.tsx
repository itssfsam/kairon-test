"use client";
import React, { useEffect, useState } from "react";
import DownloadTradesButton from "./download-trades-button";
import { Theme, useTheme } from "./theme-provider";
import { toast } from "react-toastify";
import { usePriceStore } from "../store/use-price-store";
import { ITrade, ITradeBlockProps } from "./trade-component.interface";

export default function TradeBlock({ apiUrl = `${process.env.NEXT_PUBLIC_K_API_URL}/trade` }: ITradeBlockProps) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(() => {
    try {
      return localStorage.getItem("error") || null;
    } catch {
      return null;
    }
  });
  const [calculated, setCalculated] = useState<string>("0");
  const [balance, setBalance] = useState<{ usdc: number; eth: number }>(() => {
    try {
      const saved = localStorage.getItem("balance");
      return saved ? JSON.parse(saved) : { usdc: 10000, eth: 0 };
    } catch {
      return { usdc: 10000, eth: 0 };
    }
  });
  const [trades, setTrades] = useState<ITrade[]>(() => {
    try {
      const saved = localStorage.getItem("trades");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (error === null) localStorage.removeItem("error");
    else localStorage.setItem("error", error);
  }, [error]);
  useEffect(() => localStorage.setItem("balance", JSON.stringify(balance)), [balance]);
  useEffect(() => localStorage.setItem("trades", JSON.stringify(trades)), [trades]);

  const price = usePriceStore((state) => state.prices.at(-1) ?? 0);

  const handleTrade = async (side: "BUY" | "SELL") => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid ETH amount");
      toast.error("Enter a valid ETH amount", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
        toast.error(data.detail || "Trade failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setBalance(data.balance);
        setAmount("");
        setError(null);

        toast.success(`Successful ${side} operation: ${num}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        const newTrade: ITrade = {
          id: Date.now().toString(),
          side,
          amount: num,
          timestamp: new Date().toISOString(),
        };
        setTrades([newTrade, ...trades]);
      }
    } catch (err) {
      setError("Network error");
      toast.error('Network error', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const cardClasses =
    `p-4 rounded flex flex-col shadow backdrop-blur-md transition-colors duration-300
     ${theme === Theme.DARK
      ? "bg-gray-800/30 border border-gray-700/20 text-gray-100"
      : "bg-white/50 border border-gray-100/10 text-gray-800"
    }`;

  const sharedButtonStyle = `w-1.5/10 bg-gradient-to-r px-4 py-2 text-sm text-white font-bold duration-300 transition-all`

  const buyButtonStyle = theme === Theme.DARK ? `from-green-300 via-blue-500 to-purple-600 bg-[length:200%_100%] bg-left hover:bg-[position:-200%_0%] hover:bg-purple-700` : `from-purple-400 via-pink-500 to-red-500 bg-[length:200%_100%] bg-left hover:bg-[position:-200%_0%] hover:bg-purple-700`;

  const sellButtonStyle = theme === Theme.DARK ? `from-green-300 via-blue-500 to-purple-600 bg-[length:200%_100%] bg-right  hover:bg-[position:-100%_100%] hover:bg-purple-700` : `from-purple-400 via-pink-500 to-red-500 bg-[length:200%_100%] bg-right hover:bg-[position:-100%_100%] hover:bg-purple-700`;

  return (
    <React.Fragment>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className={`${cardClasses} w-full`}>
          <h2 className="text-lg font-semibold mb-2">Trade</h2>
          <div className="flex rounded overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="number"
              step="0.0001"
              min="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                const c = parseFloat(e.target.value) * price;
                setCalculated(isNaN(c) ? 0 + "" : c + "")
              }}
              placeholder="ETH amount"
              className="w-3/10 flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <div className={`w-3/10 px-3 py-2 text-sm ${parseFloat(calculated) < 2000 ? "text-gray-600" : "text-red-600"}`}>
              ≈ ${parseFloat(calculated).toFixed(2)}
            </div>
            <button
              onClick={() => handleTrade("BUY")}
              className={`${sharedButtonStyle} ${buyButtonStyle}`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade("SELL")}
              className={`${sharedButtonStyle} ${sellButtonStyle}`}
            >
              Sell
            </button>

          </div>
        </div>

        <div className={`${cardClasses} w-full`}>
          <h2 className="text-lg font-semibold mb-2">Balances</h2>
          <p>USDC: ${balance.usdc.toFixed(2)}</p>
          <p>ETH: {balance.eth.toFixed(4)}</p>
        </div>
      </div>

      <div className={`${cardClasses} w-full mt-4`}>
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
                <tr key={trade.id} className={idx % 2 === 0 ? "bg-gray-100/30" : ""}>
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
