import { useInsightsContext } from '../../context/InsightsContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function TopSpendingCard() {
  const { topCategory, totalExpenses } = useInsightsContext();
  if (!topCategory) return null;

  const pct = totalExpenses > 0 ? Math.round((topCategory.amount / totalExpenses) * 100) : 0;
  const color = CATEGORY_COLORS[topCategory.category] || '#6b7280';

  return (
    <div className="rounded-2xl p-5 shadow-sm border overflow-hidden relative"
      style={{
        backgroundColor: color + '12',
        borderColor: color + '30',
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: color }} />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Spending</span>
        </div>
        <p className="text-2xl font-bold mb-0.5" style={{ color }}>{topCategory.category}</p>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(topCategory.amount)}</p>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>Share of total expenses</span>
            <span className="font-semibold" style={{ color }}>{pct}%</span>
          </div>
          <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
