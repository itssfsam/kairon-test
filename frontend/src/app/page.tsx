import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-50 text-gray-900 flex flex-col items-center p-8 mb-2">
      <header className="w-full max-w-4xl mx-auto p-8 mb-8 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg text-center text-white
                     bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <h1 className="text-4xl font-bold">ETH Paper Trader (Kaitest)</h1>
      </header>

      <div className="w-full max-w-md space-y-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">ETH/USD</h2>
          <p className="text-2xl font-mono">$—</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Trade</h2>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 text-white py-2 rounded transition-all duration-500 text-white
        hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
        hover:bg-white/20 hover:backdrop-blur-lg
        hover:shadow-lg hover:text-center">
              Buy
            </button>
            <button className="flex-1 bg-red-500 text-white py-2 transition-all duration-500 text-white
        hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
        hover:bg-white/20 hover:backdrop-blur-lg
        hover:shadow-lg hover:text-center">
              Sell
            </button>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Balances</h2>
          <p>USDC: 10,000</p>
          <p>ETH: 0</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Trade History</h2>
          <p className="text-gray-500 italic">No trades yet</p>
        </div>
      </div>
    </main>
  );
}
