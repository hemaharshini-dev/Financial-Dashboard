import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from './store/useAppStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import TourTooltip from './components/ui/TourTooltip';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

const VALID_PAGES = ['dashboard', 'transactions', 'insights'];

function useHashPage() {
  const getPage = () => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PAGES.includes(hash) ? hash : 'dashboard';
  };
  const [activePage, setActivePage] = useState(getPage);

  useEffect(() => {
    const handler = () => setActivePage(getPage());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((page) => {
    window.location.hash = page;
    setActivePage(page);
  }, []);

  return [activePage, navigate];
}

const pages = { dashboard: Dashboard, transactions: Transactions, insights: Insights };

export default function App() {
  const [activePage, setActivePage] = useHashPage();
  const { darkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const Page = pages[activePage];

  return (
    <ToastProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        <ErrorBoundary>
          <Page setActivePage={setActivePage} />
        </ErrorBoundary>
      </Layout>
      <TourTooltip />
    </ToastProvider>
  );
}
