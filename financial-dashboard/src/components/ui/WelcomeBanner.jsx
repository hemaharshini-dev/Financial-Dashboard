import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointerClick, Bell, Target, PieChart, RefreshCw, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const STORAGE_KEY = 'fd_welcome_dismissed';

const features = [
  {
    icon: PieChart,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    title: 'Click any chart slice',
    desc: 'Tap a spending category in the donut chart to instantly filter transactions by that category.',
  },
  {
    icon: Bell,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    title: 'Smart alerts',
    desc: 'The bell icon auto-detects budget overruns, high spending months, and low savings rate.',
  },
  {
    icon: Target,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    title: 'Budget Goals',
    desc: 'Set monthly limits per category in Insights. Switch to Admin to edit them inline.',
  },
  {
    icon: RefreshCw,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    title: 'Recurring tracker',
    desc: 'Mark transactions as recurring to track monthly commitments and see Done / Pending status.',
  },
  {
    icon: MousePointerClick,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    title: 'Keyboard shortcut',
    desc: 'Press N anywhere on the Transactions page (Admin mode) to instantly open the Add Transaction form.',
  },
  {
    icon: LayoutDashboard,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    title: 'Customise your dashboard',
    desc: 'Use the ⚙ gear icon in the header to show or hide any dashboard widget. Preference is saved.',
  },
];

export default function WelcomeBanner() {
  const { showGuide, closeGuide } = useAppStore();
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem(STORAGE_KEY));

  const visible = !dismissed || showGuide;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
    closeGuide();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5 overflow-hidden relative"
        >
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-200/30 dark:bg-blue-700/10 pointer-events-none" />
          <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-indigo-200/30 dark:bg-indigo-700/10 pointer-events-none" />

          <div className="relative">
            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Welcome to Spendlytic!</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Here are a few things you can do that aren't immediately obvious.
                </p>
              </div>
              <button
                onClick={dismiss}
                aria-label="Close guide"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors shrink-0 ml-4"
              >
                <X size={16} />
              </button>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {features.map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3 bg-white/60 dark:bg-gray-900/40 rounded-xl p-3 backdrop-blur-sm">
                  <div className={`p-1.5 rounded-lg shrink-0 ${bg}`}>
                    <Icon size={14} className={color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40">
              <p className="text-xs text-gray-400">
                Switch to <span className="font-semibold text-blue-600 dark:text-blue-400">Admin</span> mode in the header to unlock add, edit, delete, and import.
              </p>
              <button
                onClick={dismiss}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap ml-4"
              >
                Got it →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
