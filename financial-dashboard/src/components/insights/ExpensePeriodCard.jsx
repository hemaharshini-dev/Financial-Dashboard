import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';
import { CalendarDays } from 'lucide-react';

const TABS = ['Daily', 'Weekly', 'Monthly'];

export default function ExpensePeriodCard() {
  const [active, setActive] = useState('Monthly');
  const { periodExpenses } = useInsightsContext();
  const { darkMode } = useAppStore();

  const data = active === 'Daily' ? periodExpenses.daily
    : active === 'Weekly' ? periodExpenses.weekly
    : periodExpenses.monthly;

  const total = data.reduce((s, d) => s + d.total, 0);
  const peak = data.reduce((a, b) => (b.total > a.total ? b : a), data[0] || {});

  const gridColor = darkMode ? '#1f2937' : '#f3f4f6';
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-violet-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Expenses by Period</h2>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                active === tab
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Total ({active})</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
        {peak?.label && peak.total > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Peak</p>
            <p className="text-xl font-bold text-violet-500">{peak.label}</p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="periodBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Expenses']}
            contentStyle={{ borderRadius: '12px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', padding: '10px 14px' }}
            labelStyle={{ color: darkMode ? '#f9fafb' : '#111827', fontWeight: 700, marginBottom: 4, fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="total" fill="url(#periodBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
