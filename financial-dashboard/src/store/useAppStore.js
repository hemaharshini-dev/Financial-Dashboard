import { create } from 'zustand';

const getInitial = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export const useAppStore = create((set) => ({
  role: getInitial('fd_role', 'viewer'),
  darkMode: getInitial('fd_dark', false),

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
