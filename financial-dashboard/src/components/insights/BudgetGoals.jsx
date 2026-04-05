import { useState } from 'react';
import { Target, Pencil, Check, RotateCcw } from 'lucide-react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

export default function BudgetGoals() {
  const { budgets, setBudget, resetBudgets } = useBudgetStore();
  const { categoryTotals, latestDate } = useInsightsContext();
  const { role } = useAppStore();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const monthLabel = latestDate ? format(latestDate, 'MMMM yyyy') : format(new Date(), 'MMMM yyyy');

  const startEdit = (cat, current) => {
    setEditing(cat);
    setDraft(String(current));
  };

  const commitEdit = (cat) => {
    const val = parseFloat(draft);
    if (!isNaN(val) && val > 0) setBudget(cat, val);
    setEditing(null);
  };

  const categories = Object.keys(budgets);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-blue-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Budget Goals</h2>
          <span className="text-xs text-gray-400 font-normal">— {monthLabel}</span>
        </div>
        {role === 'admin' && (
          <button
            onClick={resetBudgets}
            aria-label="Reset all budgets to default"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>
      <div className="space-y-4">
        {categories.map((cat) => {
          const limit = budgets[cat];
          const spent = categoryTotals[cat] || 0;
          const rawPct = Math.round((spent / limit) * 100);
          const pct = Math.min(100, rawPct);
          const statusColor = rawPct >= 100 ? '#ef4444' : rawPct >= 80 ? '#f59e0b' : '#10b981';
          const statusLabel = rawPct >= 100 ? 'Over budget' : rawPct >= 80 ? 'Approaching limit' : 'On track';
          const statusBg = rawPct >= 100
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            : rawPct >= 80
            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';

          return (
            <div key={cat}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusBg}`}>{statusLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatCurrency(spent)} / {formatCurrency(limit)}
                  </span>
                  {editing === cat && role === 'admin' ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-xs">₹</span>
                      <input
                        type="number"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && commitEdit(cat)}
                        className="w-20 px-1.5 py-0.5 text-xs rounded border border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => commitEdit(cat)} className="text-emerald-500 hover:text-emerald-600">
                        <Check size={13} />
                      </button>
                    </div>
                  ) : (
                    role === 'admin' && (
                      <button onClick={() => startEdit(cat, limit)} aria-label={`Edit ${cat} budget`} className="text-gray-300 hover:text-blue-500 transition-colors">
                        <Pencil size={11} />
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: statusColor }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{rawPct}% used</span>
                {rawPct >= 100 && (
                  <span className="text-xs text-red-500 font-medium">+{formatCurrency(spent - limit)} over</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
