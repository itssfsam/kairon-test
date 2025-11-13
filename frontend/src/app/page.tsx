import Price from "./components/price-component";
import Header from "./components/page-header";
import Trade from "./components/trade-component";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8 mb-2">
      <Header></Header>
      <div className="w-full max-w-7xl flex flex-col sm:flex-row gap-4 mt-4">
        <div className="w-1/3">
          <Price />
        </div>
        <div className="w-2/3">
          <Trade />
        </div>
      </div>
    </main>
  );
}
