import { create } from "zustand";

interface PriceState {
  prices: number[];
  lastUpdated: Date | null;
  recordPrice: (price: number) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  prices: [],
  lastUpdated: null,
  recordPrice: (price: number) =>
    set((state) => ({
      prices: [...state.prices, price].slice(-6), // keep last 6
      lastUpdated: new Date(),
    })),
}));
