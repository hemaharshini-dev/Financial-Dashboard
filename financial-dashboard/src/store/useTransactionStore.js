import { create } from 'zustand';
import { mockTransactions } from '../data/mockData';

const STORAGE_KEY = 'fd_transactions';

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockTransactions;
  } catch {
    return mockTransactions;
  }
};

const save = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const useTransactionStore = create((set) => ({
  transactions: load(),
  filters: { search: '', type: 'all', categories: [], dateFrom: '', dateTo: '', sortBy: 'date', sortDir: 'desc' },

  addTransaction: (tx) =>
    set((s) => {
      const updated = [{ ...tx, id: Math.random().toString(36).substr(2, 9) }, ...s.transactions];
      save(updated);
      return { transactions: updated };
    }),

  editTransaction: (id, data) =>
    set((s) => {
      const updated = s.transactions.map((t) => (t.id === id ? { ...t, ...data } : t));
      save(updated);
      return { transactions: updated };
    }),

  deleteTransaction: (id) =>
    set((s) => {
      const updated = s.transactions.filter((t) => t.id !== id);
      save(updated);
      return { transactions: updated };
    }),

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: { search: '', type: 'all', categories: [], dateFrom: '', dateTo: '', sortBy: 'date', sortDir: 'desc' } }),
}));
