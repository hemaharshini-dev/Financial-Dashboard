import { LayoutDashboard, ArrowLeftRight, Lightbulb, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useAppStore } from '../../store/useAppStore';

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ activePage, setActivePage }) {
  const filtered = useFilteredTransactions();
  const { filters } = useTransactionStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.categories.length || filters.dateFrom || filters.dateTo;
  const txCount = hasActiveFilters ? filtered.length : null;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 py-6 gap-1 overflow-visible shrink-0 relative"
      >
        {/* Edge toggle button — always in the same spot on the right border */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition-all hover:scale-110"
        >
          {sidebarCollapsed
            ? <PanelLeftOpen size={14} />
            : <PanelLeftClose size={14} />
          }
        </button>

        {/* Logo row */}
        <div className={`flex items-center mb-8 px-4 ${sidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap overflow-hidden"
              >
                Spendlytic
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col gap-1 px-2">
          {links.map(({ id, label, icon: Icon }) => {
            const isActive = activePage === id;
            return (
              <div key={id} className="relative group">
                <button
                  onClick={() => setActivePage(id)}
                  aria-label={label}
                  data-tour={`sidebar-${id}`}
                  className={`w-full flex items-center py-2.5 rounded-lg text-sm font-medium transition-all ${
                    sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                  } ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-[3px] border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-[3px] border-transparent'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden flex-1 text-left"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!sidebarCollapsed && id === 'transactions' && txCount !== null && (
                    <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 rounded-full">
                      {txCount}
                    </span>
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {label}
                    {id === 'transactions' && txCount !== null && (
                      <span className="ml-1.5 bg-blue-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">{txCount}</span>
                    )}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.aside>

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
