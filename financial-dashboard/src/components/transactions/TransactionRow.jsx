import { memo, useState } from 'react';
import { Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAppStore } from '../../store/useAppStore';
import { useTransactionStore } from '../../store/useTransactionStore';

function ConfirmDialog({ description, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 z-10"
        role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 id="confirm-title" className="text-base font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Are you sure you want to delete <span className="font-medium text-gray-700 dark:text-gray-300">"{description}"</span>? This cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} aria-label="Cancel" className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const TransactionRow = memo(function TransactionRow({ transaction, onEdit }) {
  const { role } = useAppStore();
  const { deleteTransaction } = useTransactionStore();
  const [confirming, setConfirming] = useState(false);
  const isExpense = transaction.type === 'expense';

  return (
    <>
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
              <button
                onClick={() => onEdit(transaction)}
                aria-label={`Edit ${transaction.description}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setConfirming(true)}
                aria-label={`Delete ${transaction.description}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </td>
        )}
      </tr>
      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            description={transaction.description}
            onConfirm={() => { deleteTransaction(transaction.id); setConfirming(false); }}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

export default TransactionRow;
