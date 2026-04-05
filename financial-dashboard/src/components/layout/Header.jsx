import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Settings, LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import RoleSwitcher from '../ui/RoleSwitcher';
import AlertsPanel from './AlertsPanel';
import { AnimatePresence, motion } from 'framer-motion';

const pageConfig = {
  dashboard:    { title: 'Dashboard',    Icon: LayoutDashboard },
  transactions: { title: 'Transactions', Icon: ArrowLeftRight },
  insights:     { title: 'Insights',     Icon: Lightbulb },
};

const widgetLabels = {
  summaryCards: 'Summary Cards',
  balanceTrend: 'Balance Trend',
  spendingBreakdown: 'Spending Breakdown',
  quickStats: 'Quick Stats',
  recurring: 'Recurring Transactions',
  netWorth: 'Net Worth',
};

export default function Header({ activePage }) {
  const { darkMode, toggleDarkMode, widgets, toggleWidget } = useAppStore();
  const [showCustomize, setShowCustomize] = useState(false);
  const customizeRef = useRef(null);
  const { title, Icon: PageIcon } = pageConfig[activePage] || pageConfig.dashboard;

  useEffect(() => {
    const handler = (e) => { if (customizeRef.current && !customizeRef.current.contains(e.target)) setShowCustomize(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <PageIcon size={16} className="text-blue-500 dark:text-blue-400" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <AlertsPanel />
        {activePage === 'dashboard' && (
          <div className="relative" ref={customizeRef}>
            <button
              onClick={() => setShowCustomize((o) => !o)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Customize dashboard"
            >
              <Settings size={18} />
            </button>
            <AnimatePresence>
              {showCustomize && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 p-3"
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">Show / Hide Widgets</p>
                  {Object.entries(widgetLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!widgets[key]}
                        onChange={() => toggleWidget(key)}
                        className="accent-blue-600 w-3.5 h-3.5"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <RoleSwitcher />
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
