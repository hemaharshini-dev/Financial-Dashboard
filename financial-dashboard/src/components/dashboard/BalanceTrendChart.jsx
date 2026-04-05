import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';

export default function BalanceTrendChart() {
  const { balanceTrend } = useInsightsContext();
  const { darkMode } = useAppStore();

  const gridColor = darkMode ? '#374151' : '#e5e7eb';
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses (6 Months)</h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={balanceTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(v, name) => [`₹${v.toLocaleString('en-IN')}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            contentStyle={{ borderRadius: '10px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: darkMode ? '#f9fafb' : '#111827', fontWeight: 600, marginBottom: 4 }}
          />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#9ca3af' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
          <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" dot={{ fill: '#ef4444', r: 3 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
