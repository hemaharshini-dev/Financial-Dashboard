import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { CATEGORIES } from '../../data/mockData';

const empty = () => ({ date: new Date().toISOString().split('T')[0], description: '', category: 'Food', amount: '', type: 'expense', recurring: false, notes: '' });

export default function AddEditModal({ isOpen, onClose, transaction }) {
  const { addTransaction, editTransaction } = useTransactionStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  useEffect(() => {
    setForm(transaction ? { ...transaction, amount: String(transaction.amount) } : empty());
    setErrors({});
  }, [transaction, isOpen]);

  // Focus first field when modal opens
  useEffect(() => {
    if (isOpen) setTimeout(() => firstFieldRef.current?.focus(), 50);
  }, [isOpen]);

  // Focus trap — also handles Escape; no separate document listener needed
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const focusable = e.currentTarget.querySelectorAll(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const data = { ...form, amount: parseFloat(form.amount) };
    transaction ? editTransaction(transaction.id, data) : addTransaction(data);
    onClose();
  };

  const field = (label, key, type = 'text', ref = null) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        ref={ref}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value.replace(/^-/, '') }))}
        className={`w-full px-3 py-2 text-sm rounded-lg border ${errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col z-10"
            role="dialog" aria-modal="true" aria-labelledby="modal-title"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center justify-between p-6 pb-5 shrink-0">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {transaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={onClose} aria-label="Close modal" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6 space-y-4">
              {field('Date', 'date', 'date', firstFieldRef)}
              {field('Description', 'description')}
              {field('Amount (₹)', 'amount', 'number')}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Type</label>
                <div className="flex gap-3">
                  {['income', 'expense'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value={t} checked={form.type === t} onChange={() => setForm((f) => ({ ...f, type: t }))} className="accent-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes || ''}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.recurring}
                  onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.checked }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Recurring monthly</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                  {transaction ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
