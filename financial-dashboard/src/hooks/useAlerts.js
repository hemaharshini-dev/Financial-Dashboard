import { useMemo } from 'react';
import { useInsights } from './useInsights';
import { useBudgetStore } from '../store/useBudgetStore';

export const useAlerts = () => {
  const { savingsRate, monthlyComparison, categoryTotals } = useInsights();
  const { budgets } = useBudgetStore();

  return useMemo(() => {
    const alerts = [];

    if (savingsRate < 10) {
      alerts.push({ type: 'warning', message: `Savings rate is only ${savingsRate}% — consider reducing expenses` });
    }

    if (monthlyComparison.thisMonthExpenses > monthlyComparison.lastMonthExpenses) {
      const diff = monthlyComparison.thisMonthExpenses - monthlyComparison.lastMonthExpenses;
      alerts.push({ type: 'info', message: `Spending is ₹${diff.toLocaleString('en-IN')} higher than last month` });
    }

    Object.entries(budgets).forEach(([cat, limit]) => {
      const spent = categoryTotals[cat] || 0;
      if (spent > limit) {
        alerts.push({
          type: 'danger',
          message: `${cat} budget exceeded — ₹${spent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')}`,
        });
      } else if (spent / limit >= 0.8) {
        alerts.push({
          type: 'warning',
          message: `${cat} is at ${Math.round((spent / limit) * 100)}% of budget`,
        });
      }
    });

    return alerts;
  }, [savingsRate, monthlyComparison, categoryTotals, budgets]);
};
