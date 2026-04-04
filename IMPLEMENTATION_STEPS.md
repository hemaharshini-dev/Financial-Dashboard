# Financial Dashboard — Implementation Steps

## Step 1: Project Setup
```bash
npm create vite@latest financial-dashboard -- --template react
cd financial-dashboard
npm install tailwindcss @tailwindcss/vite recharts zustand framer-motion lucide-react date-fns
```

Configure `vite.config.js`:
```js
import tailwindcss from '@tailwindcss/vite'
export default { plugins: [react(), tailwindcss()] }
```

Add to `src/index.css`:
```css
@import "tailwindcss";
```

Enable dark mode in `tailwind.config.js`:
```js
export default { darkMode: 'class', content: ['./src/**/*.{js,jsx}'] }
```

---

## Step 2: Mock Data
**File:** `src/data/mockData.js`
- Create 50 transactions over last 6 months
- Fields: `id`, `date`, `description`, `category`, `amount`, `type` (`income` | `expense`)
- Categories: Food, Transport, Shopping, Entertainment, Health, Utilities, Salary, Freelance

---

## Step 3: Zustand Stores
**File:** `src/store/useTransactionStore.js`
- State: `transactions` (initialized from localStorage or mockData)
- Actions: `addTransaction`, `editTransaction`, `deleteTransaction`, `setFilters`
- Persist to localStorage on every change

**File:** `src/store/useAppStore.js`
- State: `role` (`viewer` | `admin`), `darkMode`
- Actions: `setRole`, `toggleDarkMode`
- Persist both to localStorage

---

## Step 4: Utility Functions
- `src/utils/formatCurrency.js` — `formatCurrency(amount)` → `$1,234.56`
- `src/utils/formatDate.js` — `formatDate(dateStr)` → `Jan 15, 2025`
- `src/utils/exportData.js` — `exportCSV(transactions)`, `exportJSON(transactions)`

---

## Step 5: Custom Hooks
**File:** `src/hooks/useFilteredTransactions.js`
- Reads transactions + filters from store
- Returns filtered, searched, and sorted list

**File:** `src/hooks/useInsights.js`
- Returns: `topCategory`, `savingsRate`, `monthlyComparison`, `top3Categories`, `spendingStreak`

---

## Step 6: Layout Components
**File:** `src/components/layout/Sidebar.jsx`
- Links: Dashboard, Transactions, Insights
- Collapsible on mobile → bottom nav

**File:** `src/components/layout/Header.jsx`
- Dark mode toggle button (Lucide `Sun`/`Moon`)
- RoleSwitcher dropdown

**File:** `src/components/layout/Layout.jsx`
- Wraps Sidebar + Header + `<main>` content area

---

## Step 7: Shared UI Components
- `src/components/ui/Badge.jsx` — colored badge for category/type
- `src/components/ui/EmptyState.jsx` — icon + message when no data
- `src/components/ui/RoleSwitcher.jsx` — dropdown: Viewer / Admin

---

## Step 8: Dashboard Page Components
**File:** `src/components/dashboard/SummaryCards.jsx`
- 4 cards: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Framer Motion count-up animation on mount

**File:** `src/components/dashboard/BalanceTrendChart.jsx`
- Recharts `LineChart` — balance per month for last 6 months

**File:** `src/components/dashboard/SpendingBreakdown.jsx`
- Recharts `PieChart` (donut) — expense amounts by category
- Legend with category colors

**Page:** `src/pages/Dashboard.jsx`
- Renders SummaryCards + BalanceTrendChart + SpendingBreakdown

---

## Step 9: Transactions Page Components
**File:** `src/components/transactions/TransactionFilters.jsx`
- Search input, type dropdown, category multi-select, date range inputs

**File:** `src/components/transactions/TransactionRow.jsx`
- Single table row; Admin sees Edit + Delete icon buttons

**File:** `src/components/transactions/TransactionTable.jsx`
- Sortable columns (Date, Amount); uses `useFilteredTransactions`
- Shows `EmptyState` when list is empty

**File:** `src/components/transactions/AddEditModal.jsx`
- Admin only; form fields: date, description, category, amount, type
- Framer Motion slide-in animation; form validation

**Page:** `src/pages/Transactions.jsx`
- Renders TransactionFilters + TransactionTable + AddEditModal
- Admin sees "Add Transaction" button

---

## Step 10: Insights Page Components
**File:** `src/components/insights/TopSpendingCard.jsx`
- Category name, total amount, % of total expenses

**File:** `src/components/insights/MonthlyComparison.jsx`
- Recharts `BarChart` — current vs previous month income & expenses

**File:** `src/components/insights/SavingsRate.jsx`
- Progress bar showing income vs expense ratio

**File:** `src/components/insights/InsightsPanel.jsx`
- Renders all insight cards + top 3 categories ranked list

**Page:** `src/pages/Insights.jsx`
- Renders InsightsPanel

---

## Step 11: App Entry & Routing
**File:** `src/App.jsx`
```jsx
// Simple hash-based or state-based navigation (no react-router needed)
// Apply dark class to <html> based on darkMode store value
// Render Layout with active page
```

**File:** `src/main.jsx`
- Standard Vite React entry point

---

## Step 12: Dark Mode Wiring
- Read `darkMode` from `useAppStore`
- Toggle `dark` class on `document.documentElement` via `useEffect`
- All components use `dark:` Tailwind variants

---

## Step 13: Export Feature (Admin Only)
- In Transactions page header, show "Export CSV" and "Export JSON" buttons
- Call `exportCSV` / `exportJSON` from `src/utils/exportData.js`

---

## Step 14: Responsive Design
- Sidebar hidden on mobile → fixed bottom nav with 3 icon links
- Cards stack vertically on small screens (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Table scrollable horizontally on mobile (`overflow-x-auto`)

---

## Step 15: README
**File:** `README.md`
Sections:
1. Project overview
2. Tech stack with reasons
3. Setup & run instructions (`npm install` → `npm run dev`)
4. Feature walkthrough (Dashboard, Transactions, Insights)
5. Role switching guide
6. Optional enhancements implemented
7. Screenshots (add after UI is complete)

---

## Build Order Summary
```
mockData → stores → utils → hooks → layout → ui → dashboard → transactions → insights → App → README
```
