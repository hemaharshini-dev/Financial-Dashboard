import { Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAppStore } from '../../store/useAppStore';
import { useTransactionStore } from '../../store/useTransactionStore';

export default function TransactionRow({ transaction, onEdit }) {
  const { role } = useAppStore();
  const { deleteTransaction } = useTransactionStore();
  const isExpense = transaction.type === 'expense';

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(transaction.date)}</td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-900 dark:text-white font-medium">{transaction.description}</p>
        {transaction.notes && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{transaction.notes}</p>}
      </td>
      <td className="py-3 px-4"><Badge label={transaction.category} /></td>
      <td className="py-3 px-4"><Badge label={transaction.type} variant="type" /></td>
      <td className={`py-3 px-4 text-sm font-semibold text-right whitespace-nowrap ${isExpense ? 'text-red-500' : 'text-emerald-500'}`}>
        {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
      </td>
      {role === 'admin' && (
        <td className="py-3 px-4">
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => onEdit(transaction)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => deleteTransaction(transaction.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
