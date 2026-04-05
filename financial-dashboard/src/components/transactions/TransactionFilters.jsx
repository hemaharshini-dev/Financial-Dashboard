import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { CATEGORIES } from '../../data/mockData';

export default function TransactionFilters() {
  const { filters, setFilters, resetFilters } = useTransactionStore();

  const toggleCategory = (cat) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    setFilters({ categories: cats });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.categories.length || filters.dateFrom || filters.dateTo;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border transition-colors space-y-3 ${
      hasActiveFilters
        ? 'border-blue-200 dark:border-blue-800/60'
        : 'border-gray-100 dark:border-gray-800'
    }`}>
      <div className="flex flex-wrap gap-3">
        {/* Search with clear button */}
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split('-');
            setFilters({ sortBy, sortDir });
          }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High)</option>
          <option value="amount-asc">Amount (Low)</option>
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">From</span>
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ dateFrom: e.target.value })}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="text-xs text-gray-400 whitespace-nowrap">To</span>
          <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ dateTo: e.target.value })}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Reset — highlighted when filters are active */}
        <button
          onClick={resetFilters}
          className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-all ${
            hasActiveFilters
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
          }`}
        >
          <X size={14} /> {hasActiveFilters ? `Clear filters` : 'Reset'}
        </button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategory(cat); } }}
            aria-pressed={filters.categories.includes(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              filters.categories.includes(cat)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 pt-1">
          <SlidersHorizontal size={11} className="text-blue-500" />
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Filters active</span>
          {filters.search && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">Search: "{filters.search}"</span>}
          {filters.type !== 'all' && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full capitalize">{filters.type}</span>}
          {filters.categories.map((c) => <span key={c} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">{c}</span>)}
          {filters.dateFrom && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">From {filters.dateFrom}</span>}
          {filters.dateTo && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">To {filters.dateTo}</span>}
        </div>
      )}
    </div>
  );
}
