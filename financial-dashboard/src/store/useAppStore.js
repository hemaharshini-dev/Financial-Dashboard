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
  // ── Persisted state (localStorage) ──────────────────────────────────────
  role: getInitial('fd_role', 'viewer'),
  darkMode: getInitialDarkMode(),
  widgets: getInitial('fd_widgets', defaultWidgets),
  sidebarCollapsed: getInitial('fd_sidebar', false),

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

  toggleSidebar: () =>
    set((s) => {
      const next = !s.sidebarCollapsed;
      localStorage.setItem('fd_sidebar', JSON.stringify(next));
      return { sidebarCollapsed: next };
    }),

  // ── Session state (not persisted, resets on refresh) ────────────────────
  showGuide: false,
  openGuide: () => set({ showGuide: true }),
  closeGuide: () => set({ showGuide: false }),

  tourActive: false,
  tourStep: 0,
  startTour: () => set({ tourActive: true, tourStep: 0 }),
  endTour: () => set({ tourActive: false, tourStep: 0 }),
  setTourStep: (step) => set({ tourStep: step }),
}));
