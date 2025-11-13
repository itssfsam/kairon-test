export interface ITradeBlockProps {
  apiUrl?: string;
}

export interface ITrade {
  id: string;
  side: "BUY" | "SELL";
  amount: number;
  timestamp: string;
}