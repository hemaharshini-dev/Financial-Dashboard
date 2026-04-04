# FinDash — Financial Dashboard

A clean, interactive financial dashboard built with React + Vite. Track transactions, visualize spending patterns, and switch between Viewer and Admin roles — with dark mode, animations, and localStorage persistence. All amounts are in Indian Rupees (₹).

---

## Tech Stack

| Tool | Reason |
|---|---|
| React 18 + Vite | Fast dev server, modern React features |
| Tailwind CSS | Utility-first styling, dark mode via `class` strategy |
| Recharts | Composable, responsive charts |
| Zustand | Minimal boilerplate state management |
| Framer Motion | Page transitions, card animations, modal slide-in, toast notifications |
| Lucide React | Consistent icon set |
| date-fns | Lightweight date formatting |
| Inter (Google Fonts) | Clean, readable UI typography |

---

## Setup & Run

```bash
cd financial-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Features

### Dashboard
- Skeleton loaders on initial page load (800ms simulation)
- Animated count-up summary cards: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Balance trend line chart across last 6 months
- Spending breakdown donut chart by category with legend
- Quick stats: largest single expense this month, most active spending category

### Transactions
- Skeleton rows on initial table load (600ms simulation)
- Table with Date, Description, Category, Type, Amount columns
- Real-time search by description or category
- Filter by type (income / expense), multi-select category chips, date range
- Sort by date (newest/oldest) or amount (high/low)
- Empty state UI when no results match filters
- **Admin only:** Add, Edit, Delete transactions via animated modal
- **Admin only:** Export filtered transactions as CSV or JSON

### Insights
- Staggered card entrance animations on page load
- Top spending category card with amount and % of total expenses
- Savings rate progress bar with health indicator (Great / On track / Warning)
- Days since last large expense (>$100) streak counter
- Monthly comparison bar chart: current vs previous month income & expenses
- Top 3 expense categories ranked with relative progress bars

### Role-Based UI
- **Viewer** — read-only: all data, charts, and insights visible; no add/edit/delete
- **Admin** — full access: add, edit, delete transactions; export buttons visible
- Role switcher (Viewer / Admin toggle) in the header
- Toast notification fires instantly on every role switch
- Role persisted to localStorage across page refreshes

### UX & Polish
- Smooth page transitions (fade + slide) between Dashboard, Transactions, Insights
- Toast notification system with auto-dismiss (3s) and manual close
- Dark mode toggle in header, persisted to localStorage
- System-level dark mode respected on first load
- All transaction data persisted to localStorage (survives refresh)
- Fully responsive: sidebar on desktop (md+), fixed bottom nav on mobile
- Inter font for clean, professional typography

---

## Role Switching

Use the **Viewer / Admin** toggle in the top-right header. Switching roles:
- Instantly shows/hides Add, Edit, Delete, and Export controls
- Fires a toast notification confirming the active role
- Persists the selected role to localStorage

---

## Mock Data

60 transactions spanning January–June 2025 across 8 categories:
`Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`

All amounts are in Indian Rupees (₹) with realistic Indian pricing (e.g. ₹65,000 salary, ₹999 internet bill, ₹649 Netflix, ₹1,500 petrol). Merchant names reflect Indian context (Ola, Rapido, PVR, Wonderla, Barbeque Nation, etc.).

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Header, Layout (with page transitions)
│   ├── dashboard/    # SummaryCards, BalanceTrendChart, SpendingBreakdown
│   ├── transactions/ # TransactionTable, TransactionRow, TransactionFilters, AddEditModal
│   ├── insights/     # InsightsPanel, TopSpendingCard, MonthlyComparison, SavingsRate
│   └── ui/           # Badge, EmptyState, RoleSwitcher, Toast, Skeleton
├── store/            # useTransactionStore, useAppStore (Zustand + localStorage)
├── data/             # mockData.js — 60 transactions, 6 months, 8 categories
├── hooks/            # useFilteredTransactions, useInsights
├── utils/            # formatCurrency, formatDate, exportData (CSV + JSON)
└── pages/            # Dashboard, Transactions, Insights
```
