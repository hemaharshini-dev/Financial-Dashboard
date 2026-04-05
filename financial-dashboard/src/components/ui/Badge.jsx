import { CATEGORY_COLORS } from '../../data/mockData';

const typeStyles = {
  income: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  expense: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function Badge({ label, variant = 'category' }) {
  if (variant === 'type') {
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${typeStyles[label] || ''}`}>
        {label}
      </span>
    );
  }
  const color = CATEGORY_COLORS[label] || '#6b7280';
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: color + '22', color }}>
      {label}
    </span>
  );
}
