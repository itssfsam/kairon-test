"use client";
import { useState } from "react";

export default function DownloadTradesButton() {
  const [hover, setHover] = useState(false);

  const handleDownload = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_K_API_URL}/trades/export-csv`);
      if (!res.ok) throw new Error("Failed to download CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trades.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading CSV");
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleDownload}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="text-2xl p-2 rounded transition"
        aria-label="Download Trades CSV"
      >
        💾
      </button>
      {hover && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap shadow-lg">
          Download Trades CSV
        </div>
      )}
    </div>
  );
}
