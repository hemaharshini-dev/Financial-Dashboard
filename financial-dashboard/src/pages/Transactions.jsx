import { useState, useRef, useEffect } from 'react';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import AddEditModal from '../components/transactions/AddEditModal';
import { useAppStore } from '../store/useAppStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { exportCSV, exportJSON } from '../utils/exportData';
import { parseCSV } from '../utils/importData';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useToast } from '../components/ui/Toast';
import { Plus, Download, Upload } from 'lucide-react';

export default function Transactions() {
  const { role } = useAppStore();
  const { addTransaction } = useTransactionStore();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const filtered = useFilteredTransactions();
  const fileInputRef = useRef(null);

  const openAdd = () => { setEditTx(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditTx(tx); setModalOpen(true); };

  // Keyboard shortcut: N to open Add Transaction (admin only)
  useEffect(() => {
    if (role !== 'admin') return;
    const handler = (e) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        openAdd();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [role]);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const { results, errors } = parseCSV(ev.target.result);
        results.forEach((tx) => addTransaction(tx));
        if (errors.length) {
          toast(`Imported ${results.length} rows. ${errors.length} skipped.`, 'info');
        } else {
          toast(`${results.length} transaction${results.length !== 1 ? 's' : ''} imported successfully`);
        }
      } catch (err) {
        toast(err.message, 'info');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</h2>
        <div className="flex items-center gap-2">
          {role === 'admin' ? (
            <>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload size={14} /> Import CSV
              </button>
              <button onClick={() => exportCSV(filtered)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download size={14} /> Export CSV ({filtered.length})
              </button>
              <button onClick={() => exportJSON(filtered)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download size={14} /> JSON
              </button>
              <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                <Plus size={14} /> Add Transaction
                <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 rounded border border-blue-400 leading-none">N</kbd>
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">Switch to Admin to add or edit transactions</span>
          )}
        </div>
      </div>
      <TransactionFilters />
      <TransactionTable onEdit={openEdit} />
      <AddEditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} transaction={editTx} />
    </div>
  );
}
