import { useState } from 'react';
import { Landmark, Plus, Trash2 } from 'lucide-react';
import { useNetWorthStore } from '../../store/useNetWorthStore';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatCurrency';

function InlineAddRow({ placeholder, onAdd, onCancel }) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!label.trim() || isNaN(amt) || amt <= 0) return;
    onAdd(label.trim(), amt);
  };
  return (
    <div className="flex gap-2 mt-2">
      <input placeholder={placeholder} value={label} onChange={(e) => setLabel(e.target.value)}
        className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="w-24 px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button onClick={handleAdd} className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Add</button>
      <button onClick={onCancel} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
    </div>
  );
}

export default function NetWorthCard() {
  const { assets, liabilities, addAsset, removeAsset, addLiability, removeLiability } = useNetWorthStore();
  const { role } = useAppStore();
  const [addingAsset, setAddingAsset] = useState(false);
  const [addingLiability, setAddingLiability] = useState(false);

  const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const rowClass = 'flex items-center justify-between text-sm py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Landmark size={16} className="text-emerald-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Net Worth</h2>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Assets</p>
          <p className="text-lg font-bold text-emerald-500">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="text-center border-x border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Liabilities</p>
          <p className="text-lg font-bold text-red-500">{formatCurrency(totalLiabilities)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Net Worth</p>
          <p className={`text-lg font-bold ${netWorth >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            {netWorth < 0 ? '-' : ''}{formatCurrency(Math.abs(netWorth))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Assets */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Assets</p>
          <div className="space-y-0">
            {assets.map((a) => (
              <div key={a.id} className={rowClass}>
                <span className="text-gray-700 dark:text-gray-300">{a.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(a.amount)}</span>
                  {role === 'admin' && (
                    <button onClick={() => removeAsset(a.id)} aria-label={`Remove ${a.label}`} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {role === 'admin' && (
            addingAsset
              ? <InlineAddRow placeholder="Asset name" onAdd={(l, a) => { addAsset(l, a); setAddingAsset(false); }} onCancel={() => setAddingAsset(false)} />
              : <button onClick={() => setAddingAsset(true)} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors mt-2">
                  <Plus size={13} /> Add asset
                </button>
          )}
        </div>

        {/* Liabilities */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Liabilities</p>
          <div className="space-y-0">
            {liabilities.map((l) => (
              <div key={l.id} className={rowClass}>
                <span className="text-gray-700 dark:text-gray-300">{l.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-500">{formatCurrency(l.amount)}</span>
                  {role === 'admin' && (
                    <button onClick={() => removeLiability(l.id)} aria-label={`Remove ${l.label}`} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {role === 'admin' && (
            addingLiability
              ? <InlineAddRow placeholder="Liability name" onAdd={(l, a) => { addLiability(l, a); setAddingLiability(false); }} onCancel={() => setAddingLiability(false)} />
              : <button onClick={() => setAddingLiability(true)} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors mt-2">
                  <Plus size={13} /> Add liability
                </button>
          )}
        </div>
      </div>
    </div>
  );
}
