import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';
import { AnimatePresence, motion } from 'framer-motion';

const icons = {
  warning: <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />,
  info: <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />,
  danger: <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />,
};

export default function AlertsPanel() {
  const alerts = useAlerts();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Alerts"
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {alerts.length > 9 ? '9+' : alerts.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Alerts</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={14} />
              </button>
            </div>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">All clear — no alerts</p>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {alerts.map((alert, i) => (
                  <li key={i} className="flex items-start gap-2.5 px-4 py-3">
                    {icons[alert.type]}
                    <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{alert.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
