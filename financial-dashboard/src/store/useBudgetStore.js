import { create } from 'zustand';

const STORAGE_KEY = 'fd_budgets';

const defaultBudgets = {
  Food: 5000,
  Transport: 2000,
  Shopping: 3000,
  Entertainment: 1500,
  Health: 2000,
  Utilities: 3000,
};

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultBudgets;
  } catch {
    return defaultBudgets;
  }
};

export const useBudgetStore = create((set) => ({
  budgets: load(),

  setBudget: (category, amount) =>
    set((s) => {
      const updated = { ...s.budgets, [category]: Number(amount) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { budgets: updated };
    }),

  resetBudgets: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBudgets));
    set({ budgets: defaultBudgets });
  },
}));
