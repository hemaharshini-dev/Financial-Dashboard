import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const TOUR_KEY = 'fd_tour_done';

export const TOUR_STEPS = [
  {
    target: '[data-tour="sidebar-dashboard"]',
    title: 'Dashboard',
    desc: 'Your financial overview — summary cards, charts, recurring transactions, and net worth all in one place.',
    position: 'right',
  },
  {
    target: '[data-tour="sidebar-transactions"]',
    title: 'Transactions',
    desc: 'View, search, filter, and sort all your transactions. Admins can add, edit, delete, import, and export.',
    position: 'right',
  },
  {
    target: '[data-tour="sidebar-insights"]',
    title: 'Insights',
    desc: 'Computed spending insights, savings rate, monthly comparison, and per-category budget goals.',
    position: 'right',
  },
  {
    target: '[data-tour="role-switcher"]',
    title: 'Role Switcher',
    desc: 'Toggle between Viewer and Admin. Admin unlocks adding, editing, deleting transactions and editing budgets.',
    position: 'bottom',
  },
  {
    target: '[data-tour="alerts-bell"]',
    title: 'Smart Alerts',
    desc: 'Auto-detected alerts for budget overruns, high spending months, and low savings rate. No setup needed.',
    position: 'bottom',
  },
  {
    target: '[data-tour="dark-mode"]',
    title: 'Dark Mode',
    desc: 'Toggle between light and dark theme. Your preference is saved across sessions.',
    position: 'bottom',
  },
  {
    target: '[data-tour="customize-widgets"]',
    title: 'Customise Widgets',
    desc: 'Show or hide any dashboard section using the gear icon. Your layout is saved automatically.',
    position: 'bottom',
  },
];

function getRect(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

const PAD = 10;

function calcTooltipPos(rect, position) {
  if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  const TW = 280;
  const TH = 140;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;

  if (position === 'right') {
    top = rect.top + rect.height / 2 - TH / 2;
    left = rect.right + PAD;
    if (left + TW > vw) left = rect.left - TW - PAD;
  } else {
    top = rect.bottom + PAD;
    left = rect.left + rect.width / 2 - TW / 2;
    if (top + TH > vh) top = rect.top - TH - PAD;
  }

  top = Math.max(8, Math.min(top, vh - TH - 8));
  left = Math.max(8, Math.min(left, vw - TW - 8));

  return { top, left };
}

export default function TourTooltip() {
  const { tourActive, tourStep, setTourStep, endTour, startTour } = useAppStore();
  const [rect, setRect] = useState(null);

  const step = TOUR_STEPS[tourStep];

  const updateRect = useCallback(() => {
    if (!step) return;
    const r = getRect(step.target);
    setRect(r);
  }, [step]);

  useEffect(() => {
    if (!tourActive) return;
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [tourActive, tourStep, updateRect]);

  // Auto-start on first visit
  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      startTour();
    }
  }, [startTour]);

  const finish = () => {
    localStorage.setItem(TOUR_KEY, '1');
    endTour();
  };

  const next = () => {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(tourStep + 1);
    else finish();
  };

  const prev = () => {
    if (tourStep > 0) setTourStep(tourStep - 1);
  };

  const tooltipPos = calcTooltipPos(rect, step?.position);

  return createPortal(
    <AnimatePresence>
      {tourActive && step && (
        <>
          {/* Dark overlay with spotlight cutout */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
            style={{
              background: rect
                ? `radial-gradient(ellipse ${rect.width + 32}px ${rect.height + 32}px at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent 0%, rgba(0,0,0,0.55) 100%)`
                : 'rgba(0,0,0,0.55)',
            }}
          />

          {/* Highlight ring around target */}
          {rect && (
            <motion.div
              key={`ring-${tourStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9999] rounded-xl pointer-events-none"
              style={{
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                boxShadow: '0 0 0 3px #3b82f6, 0 0 0 6px rgba(59,130,246,0.25)',
              }}
            />
          )}

          {/* Tooltip card */}
          <motion.div
            key={`tooltip-${tourStep}`}
            initial={{ opacity: 0, scale: 0.93, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.18 }}
            className="fixed z-[10000] w-[280px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
            style={{ top: tooltipPos.top, left: tooltipPos.left, ...( tooltipPos.transform ? { transform: tooltipPos.transform } : {}) }}
          >
            {/* Step indicator + close */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide">
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </span>
              <button onClick={finish} aria-label="Close tour" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={14} />
              </button>
            </div>

            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{step.desc}</p>

            {/* Progress dots */}
            <div className="flex items-center gap-1 mb-3">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${i === tourStep ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {tourStep > 0 && (
                <button
                  onClick={prev}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft size={13} /> Back
                </button>
              )}
              <button
                onClick={next}
                className="ml-auto flex items-center gap-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                {tourStep === TOUR_STEPS.length - 1 ? 'Done' : 'Next'} {tourStep < TOUR_STEPS.length - 1 && <ChevronRight size={13} />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
