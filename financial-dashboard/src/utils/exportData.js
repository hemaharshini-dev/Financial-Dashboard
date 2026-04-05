export const exportCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Notes', 'Recurring'];
  const rows = transactions.map((t) => [
    `"${t.date}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.amount,
    `"${t.type}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    `"${t.recurring ? 'true' : 'false'}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  download(csv, 'transactions.csv', 'text/csv;charset=utf-8;');
};

export const exportJSON = (transactions) => {
  download(JSON.stringify(transactions, null, 2), 'transactions.json', 'application/json');
};

const download = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};
