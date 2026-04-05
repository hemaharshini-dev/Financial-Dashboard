# FinDash — Financial Dashboard

A clean, interactive financial dashboard built with React + Vite. Track transactions, visualize spending patterns, set budget goals, monitor net worth, and switch between Viewer and Admin roles — with dark mode, animations, and localStorage persistence. All amounts are in Indian Rupees (₹).

---

## Tech Stack

| Tool | Reason |
|---|---|
| React 18 + Vite | Fast dev server, modern React features |
| Tailwind CSS | Utility-first styling, dark mode via `class` strategy |
| Recharts | Composable, responsive charts |
| Zustand | Minimal boilerplate state management |
| Framer Motion | Card animations, modal slide-in, alerts dropdown |
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
- Spending breakdown donut chart — **click any slice to jump to Transactions filtered by that category**
- Quick stats: largest single expense this month, most active spending category
- **Spending Forecast** — projects end-of-month spend based on current daily pace; color-coded green/red vs last month
- **Recurring Transactions** — deduplicated list of monthly recurring items (Salary, Netflix, Electricity, etc.) with Monthly badge
- **Net Worth Tracker** — Assets vs Liabilities summary with net worth; Admin can add/remove asset entries inline
- **Customizable Widgets** — settings gear icon in header lets you show/hide any dashboard section; preferences saved to localStorage

### Transactions
- Skeleton rows on initial table load (600ms simulation)
- Table with Date, Description, Category, Type, Amount columns
- **Notes sub-text** shown under description when a transaction has notes
- Real-time search by description, category, or notes
- Filter by type (income / expense), multi-select category chips, date range
- Sort by date (newest/oldest) or amount (high/low)
- **Pagination** — 15 rows per page with Previous/Next controls; resets automatically on filter change
- Empty state UI when no results match filters
- **Admin only:** Add, Edit, Delete transactions via animated modal
- **Admin only:** Add optional Notes and mark transactions as Recurring monthly in the modal
- **Admin only:** Export filtered transactions as CSV or JSON
- **Admin only:** Import transactions from a CSV file with validation and toast feedback

### Insights
- Staggered card entrance animations on page load
- Top spending category card with amount and % of total expenses
- Savings rate progress bar with health indicator (Great / On track / Warning)
- Days since last large expense (>₹2,000) streak counter
- Monthly comparison bar chart: current vs previous month income & expenses
- Top 3 expense categories ranked with relative progress bars
- **Budget Goals** — per-category **monthly** spending limits with color-coded progress bars (green → amber → red); compares only the current month's spending against each limit; Admin can edit limits inline; shows "Over budget by ₹X" when exceeded

### Alerts Panel
- Bell icon in the header with a red badge showing the active alert count
- Smart alerts derived automatically from your data:
  - Savings rate below 10%
  - Current month spending higher than last month (with ₹ difference)
  - Any category at 80%+ of its **monthly** budget (warning)
  - Any category exceeding its **monthly** budget (danger)
- Color-coded by severity: blue (info), amber (warning), red (danger)
- Click-outside to dismiss; shows "All clear" when no alerts

### Role-Based UI
- **Viewer** — read-only: all data, charts, and insights visible; no add/edit/delete/import
- **Admin** — full access: add, edit, delete, import transactions; export buttons; inline budget and asset editing
- Role switcher (Viewer / Admin toggle) in the header
- Toast notification fires instantly on every role switch
- Role persisted to localStorage across page refreshes

### UX & Polish
- Toast notification system with auto-dismiss (3s) and manual close
- Dark mode toggle in header, persisted to localStorage
- System-level dark mode respected on first load
- All transaction data, budgets, assets, and widget preferences persisted to localStorage
- Fully responsive: sidebar on desktop (md+), fixed bottom nav on mobile
- Inter font for clean, professional typography

---

## Role Switching

Use the **Viewer / Admin** toggle in the top-right header. Switching roles:
- Instantly shows/hides Add, Edit, Delete, Import, and Export controls
- Hides inline budget editing in Budget Goals and asset editing in Net Worth
- Fires a toast notification confirming the active role
- Persists the selected role to localStorage

### How Budget Goals Work

Budget Goals track your spending **per category for the current month only** — not across all time.

| Progress | Color | Meaning |
|---|---|---|
| Under 80% | 🟢 Green | On track |
| 80–99% | 🟡 Amber | Getting close |
| 100%+ | 🔴 Red | Over budget |

Default monthly limits:

| Category | Default Budget |
|---|---|
| Food | ₹5,000 |
| Transport | ₹2,000 |
| Shopping | ₹3,000 |
| Entertainment | ₹1,500 |
| Health | ₹2,000 |
| Utilities | ₹3,000 |

As **Admin**, click the pencil icon next to any limit to edit it inline. Use the Reset button to restore all defaults. Limits are saved to localStorage.

The **Spending Breakdown pie chart** on the Dashboard and the **Top 3 Categories** list in Insights use all-time totals across all 6 months — only Budget Goals and Alerts use the current month figure.

---


Admin users can bulk-import transactions via the **Import CSV** button on the Transactions page. The file must follow this format:

```
date,description,category,amount,type
2025-07-01,Monthly Salary,Salary,65000,income
2025-07-05,Groceries,Food,2500,expense
```

- `date` — `YYYY-MM-DD` format
- `category` — must be one of: `Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`
- `type` — `income` or `expense`
- Optional columns: `notes`, `recurring` (`true` / `false`)

Invalid rows are skipped and reported in the toast message.

---

## Mock Data

60 transactions spanning January–June 2025 across 8 categories:
`Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`

All amounts are in Indian Rupees (₹) with realistic Indian pricing (e.g. ₹65,000 salary, ₹999 internet bill, ₹649 Netflix, ₹1,500 petrol). Merchant names reflect Indian context (Ola, Rapido, PVR, Wonderla, Barbeque Nation, etc.).

Recurring transactions are flagged on: Monthly Salary, Netflix, Spotify, Electricity Bill, Internet Bill, Gym Membership, Water Bill.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Header (with alerts + widget customize), Layout, AlertsPanel
│   ├── dashboard/    # SummaryCards, BalanceTrendChart, SpendingBreakdown (drill-down),
│   │                 # RecurringList, NetWorthCard
│   ├── transactions/ # TransactionTable (paginated), TransactionRow, TransactionFilters, AddEditModal
│   ├── insights/     # InsightsPanel, TopSpendingCard, MonthlyComparison, SavingsRate, BudgetGoals
│   └── ui/           # Badge, EmptyState, RoleSwitcher, Toast, Skeleton
├── store/            # useTransactionStore, useAppStore (widgets), useBudgetStore, useNetWorthStore
├── data/             # mockData.js — 60 transactions, 6 months, 8 categories, recurring flags
├── hooks/            # useFilteredTransactions (notes search), useInsights (forecast), useAlerts
├── utils/            # formatCurrency, formatDate, exportData (CSV + JSON), importData (CSV parse)
└── pages/            # Dashboard (widget-aware), Transactions (import/export), Insights (budgets)
```
