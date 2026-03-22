import { create } from 'zustand';
import { Asset, Liability } from '@/types';

interface PortfolioState {
  assets: Asset[];
  liabilities: Liability[];
  selectedCurrency: string;

  // Derived selectors
  totalAssets: () => number;
  totalLiabilities: () => number;
  netWorth: () => number;

  // Actions
  setAssets: (assets: Asset[]) => void;
  setLiabilities: (liabilities: Liability[]) => void;
  setCurrency: (currency: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, updates: Partial<Liability>) => void;
  removeLiability: (id: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  assets: [],
  liabilities: [],
  selectedCurrency: 'VND',

  totalAssets: () =>
    get().assets.reduce((sum, a) => sum + a.value, 0),

  totalLiabilities: () =>
    get().liabilities.reduce((sum, l) => sum + l.balance, 0),

  netWorth: () =>
    get().totalAssets() - get().totalLiabilities(),

  setAssets: (assets) => set({ assets }),

  setLiabilities: (liabilities) => set({ liabilities }),

  setCurrency: (currency) => set({ selectedCurrency: currency }),

  addAsset: (asset) =>
    set((state) => ({ assets: [...state.assets, asset] })),

  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
    })),

  addLiability: (liability) =>
    set((state) => ({ liabilities: [...state.liabilities, liability] })),

  updateLiability: (id, updates) =>
    set((state) => ({
      liabilities: state.liabilities.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  removeLiability: (id) =>
    set((state) => ({
      liabilities: state.liabilities.filter((l) => l.id !== id),
    })),
}));
