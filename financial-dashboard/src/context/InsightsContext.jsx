import { createContext, useContext } from 'react';
import { useInsights } from '../hooks/useInsights';

const InsightsContext = createContext(null);

export function InsightsProvider({ children }) {
  const insights = useInsights();
  return <InsightsContext.Provider value={insights}>{children}</InsightsContext.Provider>;
}

export const useInsightsContext = () => {
  const ctx = useContext(InsightsContext);
  if (!ctx) throw new Error('useInsightsContext must be used inside InsightsProvider');
  return ctx;
};
