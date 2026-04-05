import { create } from 'zustand';

const STORAGE_KEY = 'fd_assets';

const defaultAssets = [
  { id: '1', label: 'Savings Account', amount: 150000 },
  { id: '2', label: 'Fixed Deposit', amount: 200000 },
  { id: '3', label: 'Mutual Funds', amount: 80000 },
];

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultAssets;
  } catch {
    return defaultAssets;
  }
};

const save = (assets) => localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));

export const useNetWorthStore = create((set) => ({
  assets: load(),

  addAsset: (label, amount) =>
    set((s) => {
      const updated = [...s.assets, { id: Math.random().toString(36).substring(2, 11), label, amount: Number(amount) }];
      save(updated);
      return { assets: updated };
    }),

  removeAsset: (id) =>
    set((s) => {
      const updated = s.assets.filter((a) => a.id !== id);
      save(updated);
      return { assets: updated };
    }),

  updateAsset: (id, label, amount) =>
    set((s) => {
      const updated = s.assets.map((a) => a.id === id ? { ...a, label, amount: Number(amount) } : a);
      save(updated);
      return { assets: updated };
    }),
}));
