import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useInsights } from '../../hooks/useInsights';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

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

function SummaryCard({ title, value, icon: Icon, color, isCurrency = true, suffix = '' }) {
  const animated = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
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
    </motion.div>
  );
}

export default function SummaryCards() {
  const { transactions } = useTransactionStore();
  const { savingsRate, latestMonth } = useInsights();
  const thisMonth = latestMonth || format(new Date(), 'yyyy-MM');

  const totalBalance = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
  const monthlyIncome = transactions.filter((t) => t.type === 'income' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = transactions.filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard title="Total Balance" value={Math.abs(totalBalance)} icon={Wallet} color="from-blue-500 to-blue-600" />
      <SummaryCard title="Monthly Income" value={monthlyIncome} icon={TrendingUp} color="from-emerald-500 to-emerald-600" />
      <SummaryCard title="Monthly Expenses" value={monthlyExpenses} icon={TrendingDown} color="from-red-500 to-red-600" />
      <SummaryCard title="Savings Rate" value={savingsRate} icon={PiggyBank} color="from-purple-500 to-purple-600" isCurrency={false} suffix="%" />
    </div>
  );
}
