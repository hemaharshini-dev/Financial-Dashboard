import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { useAppStore } from '../../store/useAppStore';
import TransactionRow from './TransactionRow';
import EmptyState from '../ui/EmptyState';

export default function TransactionTable({ onEdit }) {
  const transactions = useFilteredTransactions();
  const { role } = useAppStore();

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
            {transactions.map((t) => (
              <TransactionRow key={t.id} transaction={t} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <EmptyState />}
      </div>
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
