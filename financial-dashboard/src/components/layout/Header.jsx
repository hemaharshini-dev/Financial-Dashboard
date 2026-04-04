import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import RoleSwitcher from '../ui/RoleSwitcher';

const pageTitles = { dashboard: 'Dashboard', transactions: 'Transactions', insights: 'Insights' };

export default function Header({ activePage }) {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{pageTitles[activePage]}</h1>
      <div className="flex items-center gap-3">
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
