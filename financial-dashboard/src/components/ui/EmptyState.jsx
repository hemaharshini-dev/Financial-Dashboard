import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No transactions found', message = 'Try adjusting your filters or add a new transaction.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <SearchX size={28} className="text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-base font-semibold text-gray-600 dark:text-gray-300">{title}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{message}</p>
    </div>
  );
}
