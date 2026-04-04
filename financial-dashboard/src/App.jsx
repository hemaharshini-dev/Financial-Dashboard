import { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import { ToastProvider } from './components/ui/Toast';

const pages = { dashboard: Dashboard, transactions: Transactions, insights: Insights };

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { darkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const Page = pages[activePage];

  return (
    <ToastProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        <Page />
      </Layout>
    </ToastProvider>
  );
}
