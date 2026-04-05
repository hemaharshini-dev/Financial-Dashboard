import { useState, useEffect } from 'react';
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { useAppStore } from '../../store/useAppStore';
import TransactionRow from './TransactionRow';
import EmptyState from '../ui/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const PAGE_SIZE = 15;

export default function TransactionTable({ onEdit }) {
  const transactions = useFilteredTransactions();
  const { role } = useAppStore();
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [transactions.length]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const showTotals = transactions.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              {['Date', 'Description', 'Category', 'Type', 'Amount'].map((h) => (
                <th key={h} className={`py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === 'Amount' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
              {role === 'admin' && <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => <TransactionRow key={t.id} transaction={t} onEdit={onEdit} />)}
          </tbody>
        </table>
        {transactions.length === 0 && <EmptyState />}
      </div>

      {/* Totals summary bar */}
      {showTotals && (
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4">
          <span className="text-xs text-gray-400 font-medium">Totals for {transactions.length} shown:</span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(totalIncome)} income</span>
          <span className="text-xs font-semibold text-red-500">-{formatCurrency(totalExpenses)} expenses</span>
          <span className={`text-xs font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            Net: {totalIncome - totalExpenses >= 0 ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}
          </span>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
