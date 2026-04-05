import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useInsightsContext } from '../../context/InsightsContext';
import { useAppStore } from '../../store/useAppStore';
import { TrendingUp } from 'lucide-react';

export default function BalanceTrendChart() {
  const { balanceTrend } = useInsightsContext();
  const { darkMode } = useAppStore();

  const gridColor = darkMode ? '#1f2937' : '#f3f4f6';
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  const totalIncome = balanceTrend.reduce((s, d) => s + d.income, 0);
  const totalExpenses = balanceTrend.reduce((s, d) => s + d.expenses, 0);
  const net = totalIncome - totalExpenses;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp size={16} className="text-emerald-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Income vs Expenses</h2>
          </div>
          <p className="text-xs text-gray-400 ml-6">6-month overview</p>
        </div>
        <div className={`text-right`}>
          <p className="text-xs text-gray-400 mb-0.5">6-month net</p>
          <p className={`text-sm font-bold ${net >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {net >= 0 ? '+' : ''}₹{Math.abs(net).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={balanceTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
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
          <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
          <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
