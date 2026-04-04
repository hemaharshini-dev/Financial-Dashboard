import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  try { return format(parseISO(dateStr), 'MMM dd, yyyy'); } catch { return dateStr; }
};
