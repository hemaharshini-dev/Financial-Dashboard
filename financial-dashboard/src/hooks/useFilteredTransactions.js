import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';

export const useFilteredTransactions = () => {
  const { transactions, filters } = useTransactionStore();
  const { search, type, categories, dateFrom, dateTo, sortBy, sortDir } = filters;

  return useMemo(() => {
    let list = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    if (type !== 'all') list = list.filter((t) => t.type === type);
    if (categories.length) list = list.filter((t) => categories.includes(t.category));
    if (dateFrom) list = list.filter((t) => t.date >= dateFrom);
    if (dateTo) list = list.filter((t) => t.date <= dateTo);

    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'amount') return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });

    return list;
  }, [transactions, search, type, categories, dateFrom, dateTo, sortBy, sortDir]);
};
