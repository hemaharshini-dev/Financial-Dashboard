import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInsights } from '../../hooks/useInsights';
import { useAppStore } from '../../store/useAppStore';
import { format, subMonths } from 'date-fns';

export default function MonthlyComparison() {
  const { monthlyComparison, latestDate } = useInsights();
  const { darkMode } = useAppStore();
  const anchor = latestDate || new Date();
  const gridColor = darkMode ? '#374151' : '#e5e7eb';
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  const data = [
    { month: format(subMonths(anchor, 1), 'MMM yyyy'), income: monthlyComparison.lastMonthIncome, expenses: monthlyComparison.lastMonthExpenses },
    { month: format(anchor, 'MMM yyyy'), income: monthlyComparison.thisMonthIncome, expenses: monthlyComparison.thisMonthExpenses },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Comparison</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: '10px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelStyle={{ color: darkMode ? '#f9fafb' : '#111827', fontWeight: 600 }} />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
