import { CATEGORIES } from '../data/mockData';

export const parseCSV = (text) => {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  const keys = lines[0].split(',').map((k) => k.trim().toLowerCase());
  const required = ['date', 'description', 'category', 'amount', 'type'];
  const missing = required.filter((k) => !keys.includes(k));
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`);

  const results = [];
  const errors = [];

  lines.slice(1).forEach((line, i) => {
    const values = line.split(',').map((v) => v.trim());
    const row = Object.fromEntries(keys.map((k, idx) => [k, values[idx] ?? '']));

    const amount = parseFloat(row.amount);
    if (!row.date || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      errors.push(`Row ${i + 2}: invalid date "${row.date}"`);
      return;
    }
    if (!row.description) { errors.push(`Row ${i + 2}: missing description`); return; }
    if (!CATEGORIES.includes(row.category)) { errors.push(`Row ${i + 2}: unknown category "${row.category}"`); return; }
    if (isNaN(amount) || amount <= 0) { errors.push(`Row ${i + 2}: invalid amount "${row.amount}"`); return; }
    if (!['income', 'expense'].includes(row.type)) { errors.push(`Row ${i + 2}: type must be income or expense`); return; }

    results.push({
      date: row.date,
      description: row.description,
      category: row.category,
      amount,
      type: row.type,
      notes: row.notes || '',
      recurring: row.recurring === 'true',
    });
  });

  return { results, errors };
};
