# Spendlytic — Financial Dashboard

A clean, interactive financial dashboard built with React + Vite. Track transactions, visualize spending patterns, set budget goals, monitor net worth, and switch between Viewer and Admin roles — with dark mode, animations, and localStorage persistence. All amounts are in Indian Rupees (₹).

---

## Tech Stack

| Tool | Reason |
|---|---|
| React 19 + Vite | Fast dev server, modern React features |
| Tailwind CSS v4 | Utility-first styling, dark mode via `class` strategy |
| Recharts | Composable, responsive charts with dark mode support |
| Zustand | Minimal boilerplate state management with localStorage persistence |
| Framer Motion | Card animations, modal slide-in, alerts dropdown, page transitions |
| Lucide React | Consistent icon set |
| date-fns | Lightweight date formatting and arithmetic |
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
- Animated count-up summary cards with gradient icons: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- **Income vs Expenses stacked area chart** — 6-month view with separate income and expense lines, dark-mode aware
- **Spending Breakdown donut chart** — click any slice to jump to Transactions filtered by that category
- Quick stats: largest single expense this month, most active spending category
- **Spending Forecast** — projects end-of-month spend based on current daily pace; green if lower than last month, red if higher
- **Recurring Transactions** — deduplicated list of monthly recurring items (Salary, Netflix, Electricity, etc.) with Monthly badge
- **Net Worth Tracker** — separate Assets and Liabilities sections with real net worth calculation; Admin can add/remove entries inline
- **Customizable Widgets** — settings gear icon in header lets you show/hide any of the 6 dashboard sections; preferences saved to localStorage

### Transactions
- Table with Date, Description, Category, Type, Amount columns
- Notes shown as sub-text under description
- Real-time search by description, category, or notes
- Filter by type (income / expense), multi-select category chips with `aria-pressed`, date range
- Sort by date (newest/oldest) or amount (high/low)
- **Pagination** — 15 rows per page with Previous/Next controls; resets automatically on filter change
- **Transaction count badge** on sidebar link — shows filtered count when filters are active
- Empty state UI when no results match filters
- **Admin only:** Add, Edit, Delete transactions via animated modal with focus trap
- **Admin only:** `N` keyboard shortcut opens Add Transaction modal
- **Admin only:** Add optional Notes and mark transactions as Recurring monthly in the modal
- **Admin only:** Delete confirmation dialog — no accidental data loss
- **Admin only:** Export filtered transactions as CSV or JSON
- **Admin only:** Import transactions from a CSV file with row-level validation and toast feedback

### Insights
- Skeleton loaders on page load
- Staggered card entrance animations
- Top spending category card with amount and % of total expenses
- Savings rate progress bar with health indicator (Great / On track / Warning)
- Days since last large expense (>₹2,000) streak counter
- Monthly comparison bar chart: current vs previous month income & expenses
- Top 3 expense categories ranked with relative progress bars
- **Budget Goals** — per-category monthly spending limits with color-coded progress bars and text labels; month label shown in header; Admin can edit limits inline

### Alerts Panel
- Bell icon in the header with a red badge showing active alert count
- Smart alerts derived automatically from your data:
  - Savings rate below 10%
  - Current month spending higher than last month (with ₹ difference)
  - Any category at 80%+ of its monthly budget (warning)
  - Any category exceeding its monthly budget (danger)
- Color-coded by severity: blue (info), amber (warning), red (danger)
- Per-alert dismiss on hover + "Dismiss All" button
- Click-outside to close; shows "All clear" when no alerts

### Role-Based UI
- **Viewer** — read-only: all data, charts, and insights visible; no add/edit/delete/import
- **Admin** — full access: add, edit, delete, import transactions; export buttons; inline budget and asset/liability editing
- Role switcher (Viewer / Admin toggle) in the header
- Toast notification fires instantly on every role switch
- Role persisted to localStorage across page refreshes

### Accessibility
- `aria-label` on all icon-only buttons
- Focus trap in Add/Edit modal — Tab cycles within the modal
- `role="dialog"` and `aria-modal="true"` on modal
- `aria-pressed` on category filter chips
- Budget status conveyed with both color and text labels
- Delete confirmation dialog with `role="alertdialog"`

### UX & Polish
- Hash-based routing — URL updates on navigation (`#dashboard`, `#transactions`, `#insights`); refresh restores the correct page
- Error boundaries on all pages — a single component crash shows a friendly "Try again" UI instead of a blank screen
- Toast notification system with auto-dismiss (3s) and manual close
- Dark mode toggle in header, persisted to localStorage; system preference respected on first load
- All data (transactions, budgets, assets, liabilities, widget preferences, role) persisted to localStorage
- Fully responsive: sidebar on desktop (md+), fixed bottom nav on mobile
- Inter font for clean, professional typography

---

## Role Switching

Use the **Viewer / Admin** toggle in the top-right header. Switching roles:
- Instantly shows/hides Add, Edit, Delete, Import, Export, and keyboard shortcut
- Hides inline budget editing in Budget Goals and asset/liability editing in Net Worth
- Fires a toast notification confirming the active role
- Persists the selected role to localStorage

---

## How Budget Goals Work

Budget Goals track your spending **per category for the current month only** — not across all time. The current month is shown in the section header (e.g. "June 2025").

| Progress | Color | Text Label |
|---|---|---|
| Under 80% | 🟢 Green | — |
| 80–99% | 🟡 Amber | "X% used — approaching limit" |
| 100%+ | 🔴 Red | "Over budget by ₹X" |

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

The **Spending Breakdown pie chart** and **Top 3 Categories** list use all-time totals — only Budget Goals and Alerts use the current month figure.

---

## Import CSV Format

Admin users can bulk-import transactions via the **Import CSV** button on the Transactions page:

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

Recurring transactions flagged on: Monthly Salary, Netflix, Spotify, Electricity Bill, Internet Bill, Gym Membership, Water Bill.

Mock data version is auto-detected via a hash of transaction count + dates + amounts — localStorage clears automatically when data changes, no manual version bumping needed.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar (filter badge), Header (alerts + widgets), Layout, AlertsPanel
│   ├── dashboard/    # SummaryCards, BalanceTrendChart (area), SpendingBreakdown (drill-down),
│   │                 # RecurringList, NetWorthCard (assets + liabilities)
│   ├── transactions/ # TransactionTable (paginated), TransactionRow (memo + confirm delete),
│   │                 # TransactionFilters (a11y chips), AddEditModal (focus trap)
│   ├── insights/     # InsightsPanel, TopSpendingCard, MonthlyComparison, SavingsRate, BudgetGoals
│   └── ui/           # Badge, EmptyState, RoleSwitcher, Toast, Skeleton, ErrorBoundary
├── context/          # InsightsContext — shared computed insights, runs useInsights once per page
├── store/            # useTransactionStore, useAppStore (widgets), useBudgetStore, useNetWorthStore
├── data/             # mockData.js — 60 transactions, auto-hash versioning, recurring flags
├── hooks/            # useFilteredTransactions, useInsights (split sub-hooks), useAlerts
├── utils/            # formatCurrency, formatDate, exportData (CSV + JSON), importData (CSV parse)
└── pages/            # Dashboard (InsightsProvider), Transactions (import/export), Insights (InsightsProvider)
```

---

## Architecture Notes

- **InsightsContext** — `useInsights` runs exactly once per page (Dashboard and Insights each have their own `InsightsProvider`). All child components consume the shared result via `useInsightsContext`, eliminating duplicate Zustand subscriptions and redundant `useMemo` recalculations.
- **useInsights** is split into 5 focused sub-hooks (`useDateAnchors`, `useMonthlyTotals`, `useCategoryTotals`, `useBalanceTrend`, `useSpendingStreak`), each with narrowed `useMemo` dependencies so only the affected calculation re-runs on data change.
- **TransactionRow** is wrapped with `React.memo` — only re-renders when its own transaction prop changes.
- **ErrorBoundary** wraps all pages — a crash in one section shows a "Try again" UI without taking down the whole app.
