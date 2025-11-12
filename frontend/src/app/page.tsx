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
      </div>
    </main>
  );
}
