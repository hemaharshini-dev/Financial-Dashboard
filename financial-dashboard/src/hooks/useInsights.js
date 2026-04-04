import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { format, parseISO, subMonths, differenceInDays } from 'date-fns';

export const useInsights = () => {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    const now = new Date();
    const thisMonth = format(now, 'yyyy-MM');
    const lastMonth = format(subMonths(now, 1), 'yyyy-MM');

    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');

    // Category totals
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const top3Categories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    const topCategory = top3Categories[0] || null;
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

    // Monthly comparison
    const thisMonthIncome = income.filter((t) => t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
    const thisMonthExpenses = expenses.filter((t) => t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = income.filter((t) => t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);
    const lastMonthExpenses = expenses.filter((t) => t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);

    // Savings rate (this month)
    const savingsRate = thisMonthIncome > 0 ? Math.round(((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100) : 0;

    // Spending streak: days since last expense > $100
    const largeExpenses = expenses.filter((t) => t.amount > 100).sort((a, b) => b.date.localeCompare(a.date));
    const spendingStreak = largeExpenses.length
      ? differenceInDays(now, parseISO(largeExpenses[0].date))
      : null;

    // Balance trend (last 6 months)
    const balanceTrend = Array.from({ length: 6 }, (_, i) => {
      const month = format(subMonths(now, 5 - i), 'yyyy-MM');
      const label = format(subMonths(now, 5 - i), 'MMM');
      const inc = income.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      const exp = expenses.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      return { month: label, balance: inc - exp, income: inc, expenses: exp };
    });

    return {
      topCategory,
      top3Categories,
      totalExpenses,
      savingsRate,
      spendingStreak,
      balanceTrend,
      monthlyComparison: { thisMonthIncome, thisMonthExpenses, lastMonthIncome, lastMonthExpenses },
      categoryTotals,
    };
  }, [transactions]);
};
