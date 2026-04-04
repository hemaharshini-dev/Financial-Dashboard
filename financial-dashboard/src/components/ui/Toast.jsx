import { useState, useCallback, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="pointer-events-auto flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg min-w-64"
            >
              {type === 'success'
                ? <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                : <Info size={16} className="text-blue-500 shrink-0" />}
              <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{message}</span>
              <button onClick={() => remove(id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
