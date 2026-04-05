import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUp, ArrowDown } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useInsightsContext } from '../../context/InsightsContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, subMonths } from 'date-fns';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function TrendBadge({ current, previous, inverse = false }) {
  if (!previous) return null;
  const diff = current - previous;
  const pct = Math.round(Math.abs(diff / previous) * 100);
  if (pct === 0) return null;
  const isUp = diff > 0;
  const isGood = inverse ? !isUp : isUp;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
      isGood ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
    }`}>
      {isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{pct}%
    </span>
  );
}

function SummaryCard({ title, value, icon: Icon, color, isCurrency = true, suffix = '', subLabel, trend }) {
  const animated = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</span>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {isCurrency ? formatCurrency(animated) : `${animated.toLocaleString('en-IN')}${suffix}`}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}
        {trend && <TrendBadge {...trend} />}
      </div>
    </motion.div>
  );
}

export default function SummaryCards() {
  const { transactions } = useTransactionStore();
  const { savingsRate, latestMonth, latestDate } = useInsightsContext();
  const thisMonth = latestMonth || format(new Date(), 'yyyy-MM');
  const lastMonth = latestDate ? format(subMonths(latestDate, 1), 'yyyy-MM') : null;

  const totalBalance = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
  const monthlyIncome = transactions.filter((t) => t.type === 'income' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = transactions.filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
  const lastMonthIncome = lastMonth ? transactions.filter((t) => t.type === 'income' && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0) : 0;
  const lastMonthExpenses = lastMonth ? transactions.filter((t) => t.type === 'expense' && t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0) : 0;
  const lastMonthSavings = lastMonthIncome > 0 ? Math.round(((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Balance" value={Math.abs(totalBalance)} icon={Wallet}
        color="from-blue-500 to-blue-600" subLabel="All time"
      />
      <SummaryCard
        title="Monthly Income" value={monthlyIncome} icon={TrendingUp}
        color="from-emerald-500 to-emerald-600" subLabel="vs last month"
        trend={{ current: monthlyIncome, previous: lastMonthIncome }}
      />
      <SummaryCard
        title="Monthly Expenses" value={monthlyExpenses} icon={TrendingDown}
        color="from-red-500 to-red-600" subLabel="vs last month"
        trend={{ current: monthlyExpenses, previous: lastMonthExpenses, inverse: true }}
      />
      <SummaryCard
        title="Savings Rate" value={savingsRate} icon={PiggyBank}
        color="from-purple-500 to-purple-600" isCurrency={false} suffix="%" subLabel="this month"
        trend={{ current: savingsRate, previous: lastMonthSavings }}
      />
    </div>
  );
}
