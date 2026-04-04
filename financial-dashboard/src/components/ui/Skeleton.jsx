export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
      {[140, 200, 100, 80, 90].map((w, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}
