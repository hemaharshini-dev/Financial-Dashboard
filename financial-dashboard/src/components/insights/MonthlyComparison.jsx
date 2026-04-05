import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';
import { format, subMonths } from 'date-fns';
import { BarChart2 } from 'lucide-react';

export default function MonthlyComparison() {
  const { monthlyComparison, latestDate } = useInsightsContext();
  const { darkMode } = useAppStore();
  const anchor = latestDate || new Date();
  const gridColor = darkMode ? '#1f2937' : '#f3f4f6';
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  const data = [
    { month: format(subMonths(anchor, 1), 'MMM yyyy'), income: monthlyComparison.lastMonthIncome, expenses: monthlyComparison.lastMonthExpenses },
    { month: format(anchor, 'MMM yyyy'), income: monthlyComparison.thisMonthIncome, expenses: monthlyComparison.thisMonthExpenses },
  ];

  const expenseDiff = monthlyComparison.thisMonthExpenses - monthlyComparison.lastMonthExpenses;
  const expenseDiffPct = monthlyComparison.lastMonthExpenses > 0
    ? Math.round(Math.abs(expenseDiff / monthlyComparison.lastMonthExpenses) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart2 size={16} className="text-blue-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Comparison</h2>
          </div>
          <p className="text-xs text-gray-400 ml-6">{format(subMonths(anchor, 1), 'MMM')} vs {format(anchor, 'MMM yyyy')}</p>
        </div>
        {expenseDiffPct > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Expenses</p>
            <p className={`text-sm font-bold ${expenseDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {expenseDiff > 0 ? '↑' : '↓'} {expenseDiffPct}% vs last month
            </p>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={4}>
          <defs>
            <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} width={45} />
          <Tooltip
            formatter={(v, name) => [`₹${v.toLocaleString('en-IN')}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            contentStyle={{ borderRadius: '12px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', padding: '10px 14px' }}
            labelStyle={{ color: darkMode ? '#f9fafb' : '#111827', fontWeight: 700, marginBottom: 6, fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ paddingTop: 12 }} formatter={(v) => <span style={{ fontSize: 12, color: '#9ca3af' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
          <Bar dataKey="income" fill="url(#incomeBarGrad)" radius={[6, 6, 0, 0]} name="Income" maxBarSize={48} />
          <Bar dataKey="expenses" fill="url(#expenseBarGrad)" radius={[6, 6, 0, 0]} name="Expenses" maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
