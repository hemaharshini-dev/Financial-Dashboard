import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Eye } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole } = useAppStore();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {['viewer', 'admin'].map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            role === r
              ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {r === 'admin' ? <ShieldCheck size={14} /> : <Eye size={14} />}
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}
