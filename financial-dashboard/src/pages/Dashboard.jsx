import { useState, useEffect } from 'react';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import RecurringList from '../components/dashboard/RecurringList';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import { useInsights } from '../hooks/useInsights';
import { formatCurrency } from '../utils/formatCurrency';
import { TrendingDown } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

export default function Dashboard({ setActivePage }) {
  const [loading, setLoading] = useState(true);
  const { transactions } = useTransactionStore();
  const { widgets } = useAppStore();
  const { topCategory, latestMonth, spendingForecast, monthlyComparison } = useInsights();
  const thisMonth = latestMonth || format(new Date(), 'yyyy-MM');
  const thisMonthTxs = transactions.filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth));
  const largest = [...thisMonthTxs].sort((a, b) => b.amount - a.amount)[0];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><SkeletonChart /></div>
        <SkeletonChart />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {widgets.summaryCards && <SummaryCards />}
      {(widgets.balanceTrend || widgets.spendingBreakdown) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {widgets.balanceTrend && <div className="lg:col-span-2"><BalanceTrendChart /></div>}
          {widgets.spendingBreakdown && <SpendingBreakdown setActivePage={setActivePage} />}
        </div>
      )}
      {widgets.quickStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Largest Expense This Month</p>
            {largest ? (
              <>
                <p className="text-xl font-bold text-red-500">{formatCurrency(largest.amount)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{largest.description}</p>
              </>
            ) : <p className="text-sm text-gray-400">No expenses this month</p>}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Most Active Category</p>
            {topCategory ? (
              <>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{topCategory.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total: {formatCurrency(topCategory.amount)}</p>
              </>
            ) : <p className="text-sm text-gray-400">No data</p>}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-orange-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Projected Month-End Spend</p>
            </div>
            <p className={`text-xl font-bold ${spendingForecast > monthlyComparison.lastMonthExpenses ? 'text-red-500' : 'text-emerald-500'}`}>
              {formatCurrency(spendingForecast)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on current pace</p>
          </div>
        </div>
      )}
      {widgets.recurring && <RecurringList />}
      {widgets.netWorth && <NetWorthCard />}
    </div>
  );
}
