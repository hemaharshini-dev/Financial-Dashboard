import { PiggyBank } from 'lucide-react';
import { useInsightsContext } from '../../context/InsightsContext';
import { formatCurrency } from '../../utils/formatCurrency';

const TARGET_PCT = 20;

export default function SavingsRate() {
  const { savingsRate, monthlyComparison } = useInsightsContext();
  const hasIncome = monthlyComparison.thisMonthIncome > 0;
  const clamped = Math.max(0, Math.min(100, savingsRate));
  const savedAmount = monthlyComparison.thisMonthIncome - monthlyComparison.thisMonthExpenses;

  const color = clamped >= TARGET_PCT ? '#10b981' : clamped >= 10 ? '#f59e0b' : '#ef4444';
  const gradientFrom = clamped >= TARGET_PCT ? '#34d399' : clamped >= 10 ? '#fbbf24' : '#f87171';
  const gradientTo = clamped >= TARGET_PCT ? '#059669' : clamped >= 10 ? '#d97706' : '#dc2626';

  const statusText = clamped >= TARGET_PCT
    ? '🎉 Great savings!'
    : clamped >= 10
    ? '👍 On track'
    : '⚠️ Consider reducing expenses';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank size={16} className="text-purple-500" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Savings Rate</span>
        <span className="text-xs text-gray-400 ml-auto">This month</span>
      </div>

      {!hasIncome ? (
        <>
          <p className="text-3xl font-bold mb-2 text-gray-300 dark:text-gray-600">—</p>
          <p className="text-xs text-gray-400">No income recorded this month</p>
        </>
      ) : (
        <>
          {/* Big number + saved amount */}
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold leading-none" style={{ color }}>{clamped}%</p>
            <p className={`text-sm font-medium mb-0.5 ${savedAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {savedAmount >= 0 ? '+' : ''}{formatCurrency(savedAmount)} saved
            </p>
          </div>

          {/* Progress bar with gradient + target marker */}
          <div className="relative mb-3">
            {/* Track */}
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-visible relative">
              {/* Gradient fill */}
              <div
                className="h-full rounded-full transition-all duration-700 relative"
                style={{
                  width: `${clamped}%`,
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                  boxShadow: `0 0 8px ${color}55`,
                }}
              />
            </div>

            {/* Target marker at 20% */}
            <div
              className="absolute top-0 h-3 flex flex-col items-center"
              style={{ left: `${TARGET_PCT}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-0.5 h-3 bg-gray-400 dark:bg-gray-500 rounded-full" />
            </div>

            {/* Target label */}
            <div
              className="absolute -bottom-5 text-[10px] text-gray-400 whitespace-nowrap"
              style={{ left: `${TARGET_PCT}%`, transform: 'translateX(-50%)' }}
            >
              Target 20%
            </div>
          </div>

          {/* Status text */}
          <p className="text-xs text-gray-400 mt-7">{statusText}</p>

          {/* Income / Expense breakdown */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Income</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(monthlyComparison.thisMonthIncome)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Expenses</p>
              <p className="text-xs font-semibold text-red-500">
                {formatCurrency(monthlyComparison.thisMonthExpenses)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Saved</p>
              <p className={`text-xs font-semibold ${savedAmount >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {savedAmount >= 0 ? '+' : ''}{formatCurrency(savedAmount)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
