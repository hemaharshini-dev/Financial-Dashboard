import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message = 'Try adjusting your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
      <SearchX size={48} className="mb-4 opacity-50" />
      <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
