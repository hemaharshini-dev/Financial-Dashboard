import { create } from 'zustand';

const getInitial = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

// Detect system preference if no saved preference exists
const getInitialDarkMode = () => {
  try {
    const saved = localStorage.getItem('fd_dark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch { return false; }
};

const defaultWidgets = { summaryCards: true, balanceTrend: true, spendingBreakdown: true, quickStats: true, recurring: true, netWorth: true };

export const useAppStore = create((set) => ({
  role: getInitial('fd_role', 'viewer'),
  darkMode: getInitialDarkMode(),
  widgets: getInitial('fd_widgets', defaultWidgets),

  setRole: (role) => {
    localStorage.setItem('fd_role', JSON.stringify(role));
    set({ role });
  },

  toggleDarkMode: () =>
    set((s) => {
      const next = !s.darkMode;
      localStorage.setItem('fd_dark', JSON.stringify(next));
      return { darkMode: next };
    }),

  toggleWidget: (key) =>
    set((s) => {
      const next = { ...s.widgets, [key]: !s.widgets[key] };
      localStorage.setItem('fd_widgets', JSON.stringify(next));
      return { widgets: next };
    }),
}));
