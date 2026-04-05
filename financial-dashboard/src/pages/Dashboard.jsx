import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import RecurringList from '../components/dashboard/RecurringList';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import WelcomeBanner from '../components/ui/WelcomeBanner';
import { InsightsProvider, useInsightsContext } from '../context/InsightsContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { AlertCircle, Tag, TrendingDown } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/mockData';

function QuickStatCard({ icon: Icon, iconColor, iconBg, title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      </div>
      {children}
    </div>
  );
}

function DashboardContent({ setActivePage }) {
  const { transactions } = useTransactionStore();
  const { widgets } = useAppStore();
  const { topCategory, latestMonth, spendingForecast, monthlyComparison } = useInsightsContext();
  const thisMonth = latestMonth || format(new Date(), 'yyyy-MM');
  const thisMonthTxs = transactions.filter((t) => t.type === 'expense' && t.date.startsWith(thisMonth));
  const largest = [...thisMonthTxs].sort((a, b) => b.amount - a.amount)[0];
  const categoryColor = topCategory ? (CATEGORY_COLORS[topCategory.category] || '#6b7280') : '#6b7280';
  const forecastUp = spendingForecast > monthlyComparison.lastMonthExpenses;

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      {widgets.summaryCards && <SummaryCards />}
      {(widgets.balanceTrend || widgets.spendingBreakdown) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {widgets.balanceTrend && <div className="lg:col-span-2"><BalanceTrendChart /></div>}
          {widgets.spendingBreakdown && <SpendingBreakdown setActivePage={setActivePage} />}
        </div>
      )}
      {widgets.quickStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickStatCard
            icon={AlertCircle} iconColor="text-red-500" iconBg="bg-red-50 dark:bg-red-900/20"
            title="Largest Expense This Month"
          >
            {largest ? (
              <>
                <p className="text-xl font-bold text-red-500">{formatCurrency(largest.amount)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{largest.description}</p>
              </>
            ) : <p className="text-sm text-gray-400">No expenses this month</p>}
          </QuickStatCard>

          <QuickStatCard
            icon={Tag} iconColor="text-purple-500" iconBg="bg-purple-50 dark:bg-purple-900/20"
            title="Most Active Category"
          >
            {topCategory ? (
              <>
                <p className="text-xl font-bold" style={{ color: categoryColor }}>{topCategory.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formatCurrency(topCategory.amount)} total</p>
              </>
            ) : <p className="text-sm text-gray-400">No data</p>}
          </QuickStatCard>

          <QuickStatCard
            icon={TrendingDown}
            iconColor={forecastUp ? 'text-red-500' : 'text-emerald-500'}
            iconBg={forecastUp ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}
            title="Projected Month-End Spend"
          >
            <p className={`text-xl font-bold ${forecastUp ? 'text-red-500' : 'text-emerald-500'}`}>
              {formatCurrency(spendingForecast)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {forecastUp ? '↑ Higher' : '↓ Lower'} than last month
            </p>
          </QuickStatCard>
        </div>
      )}
      {widgets.recurring && <RecurringList />}
      {widgets.netWorth && <NetWorthCard />}
    </div>
  );
}

export default function Dashboard({ setActivePage }) {
  return (
    <InsightsProvider>
      <DashboardContent setActivePage={setActivePage} />
    </InsightsProvider>
  );
}
