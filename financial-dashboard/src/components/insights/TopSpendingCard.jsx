import { TrendingDown } from 'lucide-react';
import { useInsights } from '../../hooks/useInsights';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function TopSpendingCard() {
  const { topCategory, totalExpenses } = useInsights();
  if (!topCategory) return null;

  const pct = totalExpenses > 0 ? Math.round((topCategory.amount / totalExpenses) * 100) : 0;
  const color = CATEGORY_COLORS[topCategory.category] || '#6b7280';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={16} className="text-red-500" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Spending Category</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ color }}>{topCategory.category}</p>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(topCategory.amount)}</p>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>% of total expenses</span><span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}
