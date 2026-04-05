import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Eye } from 'lucide-react';
import { useToast } from './Toast';
import { motion } from 'framer-motion';

export default function RoleSwitcher() {
  const { role, setRole } = useAppStore();
  const toast = useToast();

  const handleSwitch = (r) => {
    if (r === role) return;
    setRole(r);
    toast(`Switched to ${r.charAt(0).toUpperCase() + r.slice(1)} mode`, r === 'admin' ? 'success' : 'info');
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {[
        { id: 'viewer', Icon: Eye, label: 'Viewer' },
        { id: 'admin',  Icon: ShieldCheck, label: 'Admin' },
      ].map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => handleSwitch(id)}
          className={`relative flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            role === id
              ? id === 'admin'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/50'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
