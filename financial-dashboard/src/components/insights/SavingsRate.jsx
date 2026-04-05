import { PiggyBank } from 'lucide-react';
import { useInsightsContext } from '../../context/InsightsContext';

export default function SavingsRate() {
  const { savingsRate } = useInsightsContext();
  const clamped = Math.max(0, Math.min(100, savingsRate));
  const color = clamped >= 20 ? '#10b981' : clamped >= 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank size={16} className="text-purple-500" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Savings Rate (This Month)</span>
      </div>
      <p className="text-3xl font-bold mb-4" style={{ color }}>{clamped}%</p>
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${clamped}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {clamped >= 20 ? '🎉 Great savings!' : clamped >= 10 ? '👍 On track' : '⚠️ Consider reducing expenses'}
      </p>
    </div>
  );
}
