import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { format, parseISO, subMonths, subWeeks, startOfWeek, differenceInDays } from 'date-fns';

// ─── derived primitives ────────────────────────────────────────────────────

function useDateAnchors(transactions) {
  return useMemo(() => {
    const allDates = transactions.map((t) => t.date).sort();
    const latestDate = allDates.length ? new Date(allDates[allDates.length - 1]) : new Date();
    const thisMonth = format(latestDate, 'yyyy-MM');
    const lastMonth = format(subMonths(latestDate, 1), 'yyyy-MM');
    return { latestDate, thisMonth, lastMonth };
  }, [transactions]);
}

function useMonthlyTotals(transactions, thisMonth, lastMonth) {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');
    const thisMonthIncome = income.filter((t) => t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
    const thisMonthExpenses = expenses.filter((t) => t.date.startsWith(thisMonth)).reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = income.filter((t) => t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);
    const lastMonthExpenses = expenses.filter((t) => t.date.startsWith(lastMonth)).reduce((s, t) => s + t.amount, 0);
    return { thisMonthIncome, thisMonthExpenses, lastMonthIncome, lastMonthExpenses };
  }, [transactions, thisMonth, lastMonth]);
}

function useCategoryTotals(transactions, thisMonth) {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const categoryTotals = expenses
      .filter((t) => t.date.startsWith(thisMonth))
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const allTimeCategoryTotals = expenses
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    return { categoryTotals, allTimeCategoryTotals };
  }, [transactions, thisMonth]);
}

function useBalanceTrend(transactions, latestDate) {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');
    return Array.from({ length: 6 }, (_, i) => {
      const month = format(subMonths(latestDate, 5 - i), 'yyyy-MM');
      const label = format(subMonths(latestDate, 5 - i), 'MMM yyyy');
      const inc = income.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      const exp = expenses.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      return { month: label, balance: inc - exp, income: inc, expenses: exp };
    });
  }, [transactions, latestDate]);
}

function usePeriodExpenses(transactions, latestDate) {
  return useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');

    // Daily — last 7 days
    const daily = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(latestDate);
      d.setDate(d.getDate() - (6 - i));
      const key = format(d, 'yyyy-MM-dd');
      const label = format(d, 'EEE dd');
      const total = expenses.filter((t) => t.date === key).reduce((s, t) => s + t.amount, 0);
      return { label, total };
    });

    // Weekly — last 6 weeks
    const weekly = Array.from({ length: 6 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(latestDate, 5 - i), { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const label = format(weekStart, 'dd MMM');
      const total = expenses
        .filter((t) => { const d = parseISO(t.date); return d >= weekStart && d <= weekEnd; })
        .reduce((s, t) => s + t.amount, 0);
      return { label, total };
    });

    // Monthly — last 6 months
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const month = format(subMonths(latestDate, 5 - i), 'yyyy-MM');
      const label = format(subMonths(latestDate, 5 - i), 'MMM yy');
      const total = expenses.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      return { label, total };
    });

    return { daily, weekly, monthly };
  }, [transactions, latestDate]);
}

function useSpendingStreak(transactions) {
  return useMemo(() => {
    const largeExpenses = transactions
      .filter((t) => t.type === 'expense' && t.amount > 2000)
      .sort((a, b) => b.date.localeCompare(a.date));
    return largeExpenses.length ? differenceInDays(new Date(), parseISO(largeExpenses[0].date)) : null;
  }, [transactions]);
}

// ─── main composed hook ────────────────────────────────────────────────────

export const useInsights = () => {
  const { transactions } = useTransactionStore();

  const { latestDate, thisMonth, lastMonth } = useDateAnchors(transactions);
  const { thisMonthIncome, thisMonthExpenses, lastMonthIncome, lastMonthExpenses } = useMonthlyTotals(transactions, thisMonth, lastMonth);
  const { categoryTotals, allTimeCategoryTotals } = useCategoryTotals(transactions, thisMonth);
  const balanceTrend = useBalanceTrend(transactions, latestDate);
  const spendingStreak = useSpendingStreak(transactions);
  const periodExpenses = usePeriodExpenses(transactions, latestDate);

  const { top3Categories, topCategory, totalExpenses, savingsRate, spendingForecast } = useMemo(() => {
    const top3 = Object.entries(allTimeCategoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    const totalExp = Object.values(allTimeCategoryTotals).reduce((s, v) => s + v, 0);
    const rate = thisMonthIncome > 0
      ? Math.round(((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100)
      : 0;

    const dayOfMonth = latestDate.getDate();
    const daysInMonth = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0).getDate();
    const forecast = dayOfMonth > 0 ? Math.round((thisMonthExpenses / dayOfMonth) * daysInMonth) : 0;

    return {
      top3Categories: top3,
      topCategory: top3[0] || null,
      totalExpenses: totalExp,
      savingsRate: rate,
      spendingForecast: forecast,
    };
  }, [allTimeCategoryTotals, thisMonthIncome, thisMonthExpenses, latestDate]);

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
    periodExpenses,
  };
};
