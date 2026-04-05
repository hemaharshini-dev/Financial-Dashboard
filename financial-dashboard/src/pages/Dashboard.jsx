import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import RecurringList from '../components/dashboard/RecurringList';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import { InsightsProvider, useInsightsContext } from '../context/InsightsContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

function QuickStatCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{title}</p>
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
          <QuickStatCard title="Largest Expense This Month">
            {largest ? (
              <>
                <p className="text-xl font-bold text-red-500">{formatCurrency(largest.amount)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{largest.description}</p>
              </>
            ) : <p className="text-sm text-gray-400 mt-1">No expenses this month</p>}
          </QuickStatCard>
          <QuickStatCard title="Most Active Category">
            {topCategory ? (
              <>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{topCategory.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total: {formatCurrency(topCategory.amount)}</p>
              </>
            ) : <p className="text-sm text-gray-400 mt-1">No data</p>}
          </QuickStatCard>
          <QuickStatCard title="Projected Month-End Spend">
            <p className={`text-xl font-bold ${spendingForecast > monthlyComparison.lastMonthExpenses ? 'text-red-500' : 'text-emerald-500'}`}>
              {formatCurrency(spendingForecast)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on current pace</p>
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
