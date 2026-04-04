import { motion } from 'framer-motion';
import TopSpendingCard from './TopSpendingCard';
import MonthlyComparison from './MonthlyComparison';
import SavingsRate from './SavingsRate';
import { useInsights } from '../../hooks/useInsights';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../data/mockData';
import { Flame } from 'lucide-react';

const fadeUp = (i) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.08 } });

export default function InsightsPanel() {
  const { top3Categories, spendingStreak } = useInsights();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div {...fadeUp(0)}><TopSpendingCard /></motion.div>
        <motion.div {...fadeUp(1)}><SavingsRate /></motion.div>
        <motion.div {...fadeUp(2)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={16} className="text-orange-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Days Since Large Expense</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {spendingStreak !== null ? spendingStreak : '—'}
            </p>
            <p className="text-xs text-gray-400">days since last expense over ₹2,000</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(3)}><MonthlyComparison /></motion.div>
        <motion.div {...fadeUp(4)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Top 3 Expense Categories</h2>
            <div className="space-y-4">
              {top3Categories.map(({ category, amount }, i) => {
                const color = CATEGORY_COLORS[category] || '#6b7280';
                return (
                  <div key={category} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-5">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{category}</span>
                        <span className="font-semibold" style={{ color }}>{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(amount / top3Categories[0].amount) * 100}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
