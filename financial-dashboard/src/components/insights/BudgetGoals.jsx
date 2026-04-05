import { useState } from 'react';
import { Target, Pencil, Check, RotateCcw } from 'lucide-react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../data/mockData';
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
          const pct = Math.min(100, Math.round((spent / limit) * 100));
          const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#10b981';
          const barColor = CATEGORY_COLORS[cat] || color;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(spent)} /&nbsp;
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
                    <div className="flex items-center gap-1">
                      <span style={{ color }} className="font-semibold">{formatCurrency(limit)}</span>
                      {role === 'admin' && (
                        <button onClick={() => startEdit(cat, limit)} aria-label={`Edit ${cat} budget`} className="text-gray-300 hover:text-blue-500 transition-colors">
                          <Pencil size={11} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : barColor }}
                />
              </div>
              {pct >= 100 && (
                <p className="text-xs text-red-500 mt-0.5">⚠ Over budget by {formatCurrency(spent - limit)}</p>
              )}
              {pct >= 80 && pct < 100 && (
                <p className="text-xs text-amber-500 mt-0.5">{pct}% used — approaching limit</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
