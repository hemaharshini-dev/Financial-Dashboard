import { RefreshCw } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../data/mockData';
import { format } from 'date-fns';

export default function RecurringList() {
  const { transactions } = useTransactionStore();
  const thisMonth = format(new Date(), 'yyyy-MM');

  // Deduplicate by description, keep latest occurrence
  const seen = new Set();
  const recurring = transactions
    .filter((t) => t.recurring)
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((t) => {
      if (seen.has(t.description)) return false;
      seen.add(t.description);
      return true;
    });

  const monthlyExpenses = recurring.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthlyIncome = recurring.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  if (recurring.length === 0) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw size={16} className="text-blue-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recurring Transactions</h2>
      </div>
      <p className="text-sm text-gray-400">No recurring transactions found. Mark a transaction as recurring to see it here.</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-blue-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recurring Transactions</h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {monthlyIncome > 0 && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{formatCurrency(monthlyIncome)}/mo</span>}
          {monthlyExpenses > 0 && <span className="text-red-500 font-semibold">-{formatCurrency(monthlyExpenses)}/mo</span>}
        </div>
      </div>
      <ul className="space-y-2">
        {recurring.map((t) => {
          const color = CATEGORY_COLORS[t.category] || '#6b7280';
          const isExpense = t.type === 'expense';
          const paidThisMonth = transactions.some(
            (tx) => tx.description === t.description && tx.date.startsWith(thisMonth)
          );
          return (
            <li key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  paidThisMonth
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                  {paidThisMonth ? '✓ Done' : 'Pending'}
                </span>
                <span className={`text-sm font-semibold ${isExpense ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
