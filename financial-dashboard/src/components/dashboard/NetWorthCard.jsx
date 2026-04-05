import { useState } from 'react';
import { Landmark, Plus, Trash2 } from 'lucide-react';
import { useNetWorthStore } from '../../store/useNetWorthStore';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function NetWorthCard() {
  const { assets, addAsset, removeAsset } = useNetWorthStore();
  const { transactions } = useTransactionStore();
  const { role } = useAppStore();
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [adding, setAdding] = useState(false);

  const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
  const totalBalance = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
  const liabilities = totalBalance < 0 ? Math.abs(totalBalance) : 0;
  const netWorth = totalAssets - liabilities;

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!label.trim() || isNaN(amt) || amt <= 0) return;
    addAsset(label.trim(), amt);
    setLabel('');
    setAmount('');
    setAdding(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Landmark size={16} className="text-emerald-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Net Worth</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Assets</p>
          <p className="text-lg font-bold text-emerald-500">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="text-center border-x border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Liabilities</p>
          <p className="text-lg font-bold text-red-500">{formatCurrency(liabilities)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Net Worth</p>
          <p className={`text-lg font-bold ${netWorth >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{formatCurrency(Math.abs(netWorth))}</p>
        </div>
      </div>

      <div className="space-y-2">
        {assets.map((a) => (
          <div key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <span className="text-gray-700 dark:text-gray-300">{a.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(a.amount)}</span>
              {role === 'admin' && (
                <button onClick={() => removeAsset(a.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {role === 'admin' && (
        <div className="mt-3">
          {adding ? (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="Asset name"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-24 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleAdd} className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Add</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors mt-1">
              <Plus size={13} /> Add asset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
