import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInsights } from '../../hooks/useInsights';
import { format, subMonths } from 'date-fns';

export default function MonthlyComparison() {
  const { monthlyComparison } = useInsights();
  const now = new Date();

  const data = [
    { month: format(subMonths(now, 1), 'MMM'), income: monthlyComparison.lastMonthIncome, expenses: monthlyComparison.lastMonthExpenses },
    { month: format(now, 'MMM'), income: monthlyComparison.thisMonthIncome, expenses: monthlyComparison.thisMonthExpenses },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Comparison</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
