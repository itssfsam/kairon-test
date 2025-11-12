import PriceChart from "./price-chart";

export default function Header() {
    return (<header className="w-full max-w-4xl mx-auto p-8 mb-8 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg text-center text-white
                       bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <h1 className="text-4xl font-bold">ETH Paper Trader (Kaitest)</h1><PriceChart />
    </header>)
}