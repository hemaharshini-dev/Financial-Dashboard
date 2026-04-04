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

export const useAppStore = create((set) => ({
  role: getInitial('fd_role', 'viewer'),
  darkMode: getInitialDarkMode(),

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
}));
