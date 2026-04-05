import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { useTransactionStore } from '../../store/useTransactionStore';

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ activePage, setActivePage }) {
  const filtered = useFilteredTransactions();
  const { filters } = useTransactionStore();
  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.categories.length || filters.dateFrom || filters.dateTo;
  const txCount = hasActiveFilters ? filtered.length : null;
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 gap-1">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">Spendlytic</span>
        </div>
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activePage === id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon size={18} />
            {label}
            {id === 'transactions' && txCount !== null && (
              <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 rounded-full">
                {txCount}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${
              activePage === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
