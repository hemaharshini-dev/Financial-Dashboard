import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInsightsContext } from '../../context/InsightsContext';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORY_COLORS } from '../../data/mockData';

export default function SpendingBreakdown({ setActivePage }) {
  const { allTimeCategoryTotals } = useInsightsContext();
  const { setFilters } = useTransactionStore();
  const { darkMode } = useAppStore();
  const tooltipBg = darkMode ? '#111827' : '#ffffff';
  const tooltipBorder = darkMode ? '#374151' : '#e5e7eb';

  const data = Object.entries(allTimeCategoryTotals)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const handleClick = (entry) => {
    if (!setActivePage) return;
    setFilters({ categories: [entry.name] });
    setActivePage('transactions');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Spending Breakdown</h2>
        {setActivePage && <span className="text-xs text-gray-400">Click a slice to filter</span>}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={85}
            paddingAngle={3} dataKey="value"
            cursor={setActivePage ? 'pointer' : 'default'}
            onClick={handleClick}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: '10px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
