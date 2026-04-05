import { create } from 'zustand';

const STORAGE_KEY = 'fd_assets';
const LIABILITIES_KEY = 'fd_liabilities';

const defaultAssets = [
  { id: '1', label: 'Savings Account', amount: 150000 },
  { id: '2', label: 'Fixed Deposit', amount: 200000 },
  { id: '3', label: 'Mutual Funds', amount: 80000 },
];

const defaultLiabilities = [
  { id: 'l1', label: 'Home Loan EMI (outstanding)', amount: 850000 },
  { id: 'l2', label: 'Credit Card Due', amount: 12500 },
  { id: 'l3', label: 'Personal Loan', amount: 50000 },
];

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const useNetWorthStore = create((set) => ({
  assets: load(STORAGE_KEY, defaultAssets),
  liabilities: load(LIABILITIES_KEY, defaultLiabilities),

  addAsset: (label, amount) =>
    set((s) => {
      const updated = [...s.assets, { id: Math.random().toString(36).substring(2, 11), label, amount: Number(amount) }];
      save(STORAGE_KEY, updated);
      return { assets: updated };
    }),

  removeAsset: (id) =>
    set((s) => {
      const updated = s.assets.filter((a) => a.id !== id);
      save(STORAGE_KEY, updated);
      return { assets: updated };
    }),

  updateAsset: (id, label, amount) =>
    set((s) => {
      const updated = s.assets.map((a) => a.id === id ? { ...a, label, amount: Number(amount) } : a);
      save(STORAGE_KEY, updated);
      return { assets: updated };
    }),

  addLiability: (label, amount) =>
    set((s) => {
      const updated = [...s.liabilities, { id: Math.random().toString(36).substring(2, 11), label, amount: Number(amount) }];
      save(LIABILITIES_KEY, updated);
      return { liabilities: updated };
    }),

  removeLiability: (id) =>
    set((s) => {
      const updated = s.liabilities.filter((l) => l.id !== id);
      save(LIABILITIES_KEY, updated);
      return { liabilities: updated };
    }),
}));
