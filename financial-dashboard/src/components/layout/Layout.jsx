import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ activePage, setActivePage, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={activePage} />
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
