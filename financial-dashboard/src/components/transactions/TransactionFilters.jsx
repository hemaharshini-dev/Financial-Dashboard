import { Search, X } from 'lucide-react';
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ dateTo: e.target.value })}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <button onClick={resetFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
          <X size={14} /> Reset
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
    </div>
  );
}
