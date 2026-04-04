import { useState } from 'react';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import AddEditModal from '../components/transactions/AddEditModal';
import { useAppStore } from '../store/useAppStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { exportCSV, exportJSON } from '../utils/exportData';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { Plus, Download } from 'lucide-react';

export default function Transactions() {
  const { role } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const filtered = useFilteredTransactions();

  const openAdd = () => { setEditTx(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditTx(tx); setModalOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} transactions</h2>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <button onClick={() => exportCSV(filtered)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download size={14} /> CSV
              </button>
              <button onClick={() => exportJSON(filtered)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download size={14} /> JSON
              </button>
              <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                <Plus size={14} /> Add Transaction
              </button>
            </>
          )}
        </div>
      </div>
      <TransactionFilters />
      <TransactionTable onEdit={openEdit} />
      <AddEditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} transaction={editTx} />
    </div>
  );
}
