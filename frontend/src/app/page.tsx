import Price from "./components/price-component";
import Header from "./components/page-header";
import Trade from "./components/trade-component";
import DownloadTradesButton from "./components/download-trades-button";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8 mb-2">
      <Header></Header>

      <div className="w-full max-w-md space-y-4">
        <Price />
        <Trade />

        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Trade History</h2>
          <p className="text-gray-500 italic">No trades yet</p>
          <DownloadTradesButton />
        </div>
      </div>
    </main>
  );
}
