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
| Framer Motion | Card animations, sidebar collapse, modal slide-in, page transitions |
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
- **Trend indicators** on each card — shows ↑/↓ % change vs last month, color-coded (green = good, red = bad)
- **Income vs Expenses stacked area chart** — 6-month view with gradient fills, dark-mode aware grid and tooltips
- **Spending Breakdown donut chart** — click any slice to jump to Transactions filtered by that category
- Quick stats: largest single expense this month, most active spending category, projected month-end spend
- **Spending Forecast** — anchored to latest transaction date; green if lower than last month, red if higher
- **Recurring Transactions** — shows Done ✓ / Pending status per item for the current month; displays total monthly income and expense commitments in the header
- **Net Worth Tracker** — separate Assets and Liabilities sections with real net worth; Admin can add/remove entries inline
- **Customizable Widgets** — settings gear icon in header lets you show/hide any of the 6 dashboard sections; preferences saved to localStorage

### Transactions
- Table with Date, Description, Category, Type, Amount columns
- Notes shown as sub-text under description
- Real-time search by description, category, or notes
- Filter by type (income / expense), multi-select category chips, date range with **From / To labels**
- Sort by date (newest/oldest) or amount (high/low)
- **Totals summary bar** — shows total income, total expenses, and net for all currently filtered transactions; updates live
- **Pagination** — 15 rows per page with Previous/Next controls; resets automatically on filter change
- **Transaction count badge** on sidebar link — shows filtered count when filters are active
- Empty state UI when no results match filters
- Viewer sees a hint: "Switch to Admin to add or edit transactions"
- **Admin only:** Add transaction modal — **defaults to today's date**, no negative amounts allowed
- **Admin only:** Add, Edit, Delete transactions via animated modal with focus trap
- **Admin only:** `N` keyboard shortcut opens Add Transaction modal
- **Admin only:** Add optional Notes and mark transactions as Recurring monthly in the modal
- **Admin only:** Delete confirmation dialog — no accidental data loss
- **Admin only:** Export filtered transactions as CSV (shows count, e.g. "Export CSV (23)") or JSON
- **Admin only:** Import transactions from a CSV file with row-level validation and toast feedback

### Insights
- Skeleton loaders on page load
- Staggered card entrance animations
- Top spending category card with amount and % of total expenses
- Savings rate progress bar — shows `—` with "No income recorded this month" when there's no income data
- Days since last large expense (>₹2,000) streak counter
- Monthly comparison bar chart: current vs previous month income & expenses
- Top 3 expense categories ranked with relative progress bars
- **Budget Goals** — single unified color system (green → amber → red) based on % used; status badge pill per category ("On track", "Approaching limit", "Over budget"); shows exact % used and overage amount; Admin can edit limits inline

### Sidebar
- **Collapsible/expandable** — circular toggle button sits on the right edge of the sidebar border, always in the same position
- Collapsed state (64px): icon-only with hover tooltips showing label and filter count
- Expanded state (240px): full labels with smooth Framer Motion width animation
- Active item has a left accent bar (`border-l-[3px]`) for clear visual hierarchy
- Collapse preference persisted to localStorage

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
- **Viewer** — read-only: all data, charts, and insights visible; no add/edit/delete/import; sees hint to switch to Admin
- **Admin** — full access: add, edit, delete, import transactions; export buttons with count; inline budget and asset/liability editing
- Role switcher (Viewer / Admin toggle) in the header
- Toast notification fires instantly on every role switch
- Role persisted to localStorage across page refreshes

### Accessibility
- `aria-label` on all icon-only buttons
- Focus trap in Add/Edit modal — Tab cycles within the modal
- `role="dialog"` and `aria-modal="true"` on modal
- `aria-pressed` on category filter chips with keyboard support
- Budget status conveyed with both color and text labels
- Delete confirmation dialog with `role="alertdialog"`

### UX & Polish
- Subtle dot-grid background pattern for visual depth
- Card hover lift animation (`whileHover={{ y: -2 }}`) via Framer Motion
- Hash-based routing — URL updates on navigation; refresh restores the correct page
- Error boundaries on all pages — a crash shows a friendly "Try again" UI
- Toast notification system with auto-dismiss (3s) and manual close
- Dark mode toggle in header, persisted to localStorage; system preference respected on first load
- All data (transactions, budgets, assets, liabilities, widget preferences, role, sidebar state) persisted to localStorage
- Fully responsive: collapsible sidebar on desktop (md+), fixed bottom nav on mobile

---

## Role Switching

Use the **Viewer / Admin** toggle in the top-right header. Switching roles:
- Instantly shows/hides Add, Edit, Delete, Import, Export controls and keyboard shortcut
- Hides inline budget editing in Budget Goals and asset/liability editing in Net Worth
- Fires a toast notification confirming the active role
- Persists the selected role to localStorage

---

## How Budget Goals Work

Budget Goals track your spending **per category for the current month only**. The month is shown in the section header (e.g. "June 2025").

| Progress | Bar Color | Status Badge |
|---|---|---|
| Under 80% | 🟢 Green | "On track" |
| 80–99% | 🟡 Amber | "Approaching limit" |
| 100%+ | 🔴 Red | "Over budget" |

Each row shows: category name · status badge · `₹spent / ₹limit` · `X% used` · overage amount if exceeded.

Default monthly limits:

| Category | Default Budget |
|---|---|
| Food | ₹5,000 |
| Transport | ₹2,000 |
| Shopping | ₹3,000 |
| Entertainment | ₹1,500 |
| Health | ₹2,000 |
| Utilities | ₹3,000 |

As **Admin**, click the pencil icon next to any limit to edit inline. Use Reset to restore defaults. Limits saved to localStorage.

The **Spending Breakdown pie chart** and **Top 3 Categories** use all-time totals — Budget Goals and Alerts use current month only.

---

## Import CSV Format

Admin users can bulk-import via the **Import CSV** button on the Transactions page:

```
date,description,category,amount,type
2025-07-01,Monthly Salary,Salary,65000,income
2025-07-05,Groceries,Food,2500,expense
```

- `date` — `YYYY-MM-DD` format
- `category` — one of: `Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`
- `type` — `income` or `expense`
- Optional: `notes`, `recurring` (`true` / `false`)

Invalid rows are skipped and reported in the toast message.

---

## Mock Data

60 transactions spanning January–June 2025 across 8 categories:
`Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`

All amounts in Indian Rupees (₹) with realistic Indian pricing. Merchant names reflect Indian context (Ola, Rapido, PVR, Wonderla, Barbeque Nation, etc.).

Recurring transactions flagged on: Monthly Salary, Netflix, Spotify, Electricity Bill, Internet Bill, Gym Membership, Water Bill.

Mock data version is auto-detected via a hash of transaction count + dates + amounts — localStorage clears automatically when data changes.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar (collapsible), Header (alerts + widgets), Layout, AlertsPanel
│   ├── dashboard/    # SummaryCards (trend badges), BalanceTrendChart (area),
│   │                 # SpendingBreakdown (drill-down), RecurringList (done/pending),
│   │                 # NetWorthCard (assets + liabilities)
│   ├── transactions/ # TransactionTable (totals bar + pagination), TransactionRow (memo + confirm),
│   │                 # TransactionFilters (labeled date range), AddEditModal (focus trap + today default)
│   ├── insights/     # InsightsPanel, TopSpendingCard, MonthlyComparison, SavingsRate, BudgetGoals
│   └── ui/           # Badge, EmptyState, RoleSwitcher, Toast, Skeleton, ErrorBoundary
├── context/          # InsightsContext — shared computed insights, runs useInsights once per page
├── store/            # useTransactionStore, useAppStore (widgets + sidebar), useBudgetStore, useNetWorthStore
├── data/             # mockData.js — 60 transactions, auto-hash versioning, recurring flags
├── hooks/            # useFilteredTransactions, useInsights (split sub-hooks), useAlerts
├── utils/            # formatCurrency, formatDate, exportData (CSV + JSON), importData (CSV parse)
└── pages/            # Dashboard (InsightsProvider), Transactions (import/export), Insights (InsightsProvider)
```

---

## Architecture Notes

- **InsightsContext** — `useInsights` runs exactly once per page. All child components consume via `useInsightsContext`, eliminating duplicate Zustand subscriptions.
- **useInsights** is split into 5 focused sub-hooks (`useDateAnchors`, `useMonthlyTotals`, `useCategoryTotals`, `useBalanceTrend`, `useSpendingStreak`), each with narrowed `useMemo` dependencies.
- **Spending Forecast** is anchored to the latest transaction date — not `new Date()` — so mock data always shows a meaningful projection.
- **TransactionRow** is wrapped with `React.memo` — only re-renders when its own transaction prop changes.
- **ErrorBoundary** wraps all pages — a crash in one section shows "Try again" without taking down the whole app.
- **Sidebar collapse state** is persisted to localStorage via `useAppStore`.
