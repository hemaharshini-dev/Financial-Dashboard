import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { format, parseISO, subMonths, differenceInDays, startOfMonth } from 'date-fns';

export const useInsights = () => {
  const { transactions } = useTransactionStore();

  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');

    // Derive the latest month present in data (not today) so charts always show real data
    const allDates = transactions.map((t) => t.date).sort();
    const latestDate = allDates.length ? new Date(allDates[allDates.length - 1]) : new Date();
    const thisMonth = format(latestDate, 'yyyy-MM');
    const lastMonth = format(subMonths(latestDate, 1), 'yyyy-MM');

    // Category totals — current month only (used for budget goals)
    const categoryTotals = expenses
      .filter((t) => t.date.startsWith(thisMonth))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // All-time category totals (used for pie chart + top 3)
    const allTimeCategoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const top3Categories = Object.entries(allTimeCategoryTotals)
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

    // Savings rate (latest month in data)
    const savingsRate = thisMonthIncome > 0 ? Math.round(((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100) : 0;

    // Spending streak: days since last expense > ₹2000
    const now = new Date();
    const largeExpenses = expenses.filter((t) => t.amount > 2000).sort((a, b) => b.date.localeCompare(a.date));
    const spendingStreak = largeExpenses.length
      ? differenceInDays(now, parseISO(largeExpenses[0].date))
      : null;

    // Balance trend — last 6 months anchored to latest transaction date
    const balanceTrend = Array.from({ length: 6 }, (_, i) => {
      const month = format(subMonths(latestDate, 5 - i), 'yyyy-MM');
      const label = format(subMonths(latestDate, 5 - i), 'MMM yyyy');
      const inc = income.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      const exp = expenses.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      return { month: label, balance: inc - exp, income: inc, expenses: exp };
    });

    // Spending forecast based on current month pace
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const spendingForecast = dayOfMonth > 0
      ? Math.round((thisMonthExpenses / dayOfMonth) * daysInMonth)
      : 0;

    return {
      topCategory,
      top3Categories,
      totalExpenses,
      savingsRate,
      spendingStreak,
      balanceTrend,
      spendingForecast,
      latestMonth: thisMonth,
      prevMonth: lastMonth,
      latestDate,
      monthlyComparison: { thisMonthIncome, thisMonthExpenses, lastMonthIncome, lastMonthExpenses },
      categoryTotals,
      allTimeCategoryTotals,
    };
  }, [transactions]);
};
