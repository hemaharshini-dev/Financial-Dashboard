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
| Framer Motion | Card animations, sidebar collapse, modal slide-in, page transitions, stagger effects |
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
- Staggered animated count-up summary cards with gradient icons: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- **Trend indicators** on each card — ↑/↓ % change vs last month, color-coded (green = good, red = bad) with sub-labels
- **Income vs Expenses stacked area chart** — 6-month view with gradient fills, horizontal-only grid, 6-month net callout, dark-mode aware
- **Spending Breakdown donut chart** — click any slice to jump to Transactions filtered by that category
- Quick stats with colored icon badges: largest expense, most active category, projected month-end spend
- **Spending Forecast** — anchored to latest transaction date; color-coded vs last month
- **Recurring Transactions** — Done ✓ / Pending status per item for current month; total monthly commitments shown in header
- **Net Worth Tracker** — hero net worth number, assets vs liabilities ratio bar, separate editable sections; Admin can add/remove entries inline
- **Customizable Widgets** — ⚙ gear icon in header shows/hides any of the 6 dashboard sections; preferences saved to localStorage
- **Welcome Guide** — shown on first visit as an inline banner; re-open anytime via the `?` icon in the header

### Transactions
- Table with Date, Description, Category, Type, Amount columns
- Notes shown as sub-text under description
- Real-time search by description, category, or notes
- Filter by type (income / expense), multi-select category chips with `aria-pressed`, date range with From / To labels
- Sort by date (newest/oldest) or amount (high/low)
- **Totals summary bar** — live total income, expenses, and net for all filtered transactions
- **Pagination** — 15 rows per page; resets automatically on filter change
- **Transaction count badge** on sidebar link — shows filtered count when filters are active
- Empty state UI when no results match filters
- Viewer sees a hint to switch to Admin mode
- **Admin only:** Add transaction modal — defaults to today's date, no negative amounts, focus trap, scrollable on short screens
- **Admin only:** `N` keyboard shortcut (shown as `kbd` badge on button) opens Add Transaction modal
- **Admin only:** Add optional Notes and mark transactions as Recurring monthly
- **Admin only:** Delete confirmation dialog — no accidental data loss
- **Admin only:** Export filtered transactions as CSV (shows count) or JSON
- **Admin only:** Import transactions from CSV with row-level validation and toast feedback

### Insights
- Skeleton loaders on page load with staggered card entrance animations
- **Top Spending Category** — colored tinted card background using the category's own color; decorative accent circle
- **Savings Rate** — gradient progress bar with glow effect; target marker at 20%; saved amount in ₹; income/expenses/saved breakdown row; handles no-income state gracefully
- **Days Since Large Expense** — streak counter for expenses over ₹2,000
- **Monthly Comparison** — bar chart with gradient fills and expense change callout (↑/↓ % vs last month)
- **Top 3 Expense Categories** — ranked with relative progress bars
- **Budget Goals** — unified green → amber → red color system; status badge pill per category; `X% used` label; overage amount; Admin edits inline; month label in header

### Visual Design
- Glassmorphism header — `bg-white/80 backdrop-blur-md` floats above the dot-grid background
- Subtle dot-grid background pattern on `html` and `html.dark` for visual depth
- Card hover lift animation via Framer Motion `whileHover={{ y: -2 }}`
- Gradient icon backgrounds on summary cards
- Color-coded RoleSwitcher — Admin is solid blue, Viewer is white/gray
- Page icon badge in header title for each page

### Sidebar
- **Collapsible/expandable** — circular toggle button on the right border edge, always in the same position
- Collapsed (64px): icon-only with hover tooltips; expanded (240px): full labels with smooth width animation
- Active item has a left accent bar (`border-l-[3px]`) for clear visual hierarchy
- Collapse preference persisted to localStorage

### Alerts Panel
- Bell icon with red badge showing active alert count
- Smart alerts derived automatically:
  - Savings rate below 10%
  - Current month spending higher than last month (with ₹ difference)
  - Any category at 80%+ of its monthly budget (warning)
  - Any category exceeding its monthly budget (danger)
- Color-coded: blue (info), amber (warning), red (danger)
- Per-alert dismiss on hover + "Dismiss All" button; click-outside to close

### Role-Based UI
- **Viewer** — read-only: all data, charts, and insights visible; no add/edit/delete/import; sees hint to switch to Admin
- **Admin** — full access: add, edit, delete, import; export with count; inline budget and asset/liability editing
- Role switcher in header — icon-only on mobile, icon + label on desktop
- Toast notification on every role switch; role persisted to localStorage

### Accessibility
- `aria-label` on all icon-only buttons
- Focus trap in Add/Edit modal — Tab cycles within the modal
- `role="dialog"` and `aria-modal="true"` on modal; `role="alertdialog"` on delete confirmation
- `aria-pressed` on category filter chips with keyboard support
- Budget status conveyed with both color and text labels

### Responsiveness
- Desktop (md+): collapsible sidebar, multi-column grids
- Mobile: fixed bottom nav, single-column stacks, `pb-28` clears bottom nav
- Header: compact on mobile — reduced padding, icon-only RoleSwitcher on small screens
- Transaction filters: date range inputs share a single row with `flex-1 min-w-0`
- Add/Edit modal: `max-h-[90vh]` with scrollable form body — never clips on short screens
- Welcome banner: `grid-cols-2` on mobile — compact, not overwhelming
- Charts: `ResponsiveContainer width="100%"` — auto-resize at all breakpoints
- Transaction table: `overflow-x-auto` — horizontal scroll on narrow screens

### UX & Polish
- Hash-based routing — URL updates on navigation; refresh restores the correct page
- Error boundaries on all pages — crash shows "Try again" UI without taking down the app
- Toast notification system with auto-dismiss (3s) and manual close
- Dark mode toggle in header; system preference respected on first load
- All data persisted to localStorage: transactions, budgets, assets, liabilities, widgets, role, sidebar state, guide dismissed flag

---

## Onboarding Guide

A **Welcome Guide** appears inline at the top of the Dashboard on first visit, explaining 6 non-obvious features:

| Feature | What it does |
|---|---|
| Click any chart slice | Filters Transactions by that category |
| Smart alerts | Bell icon auto-detects budget/savings issues |
| Budget Goals | Monthly limits editable inline (Admin) |
| Recurring tracker | Done/Pending status per item this month |
| Keyboard shortcut | `N` opens Add Transaction (Admin) |
| Customise dashboard | ⚙ gear hides/shows widgets |

After dismissing, click the **`?` icon** in the header anytime to re-open the guide inline on the Dashboard.

---

## Role Switching

Use the **Viewer / Admin** toggle in the header:
- Instantly shows/hides Add, Edit, Delete, Import, Export, keyboard shortcut
- Hides inline budget and asset/liability editing
- Fires a toast confirming the active role
- Persists to localStorage

---

## How Budget Goals Work

Budget Goals track spending **per category for the current month only**. Month shown in the section header.

| Progress | Bar Color | Status Badge |
|---|---|---|
| Under 80% | 🟢 Green | "On track" |
| 80–99% | 🟡 Amber | "Approaching limit" |
| 100%+ | 🔴 Red | "Over budget" |

Each row: category name · status badge · `₹spent / ₹limit` · `X% used` · overage if exceeded.

Default monthly limits: Food ₹5,000 · Transport ₹2,000 · Shopping ₹3,000 · Entertainment ₹1,500 · Health ₹2,000 · Utilities ₹3,000

As **Admin**, click the pencil icon to edit inline. Reset button restores defaults. Saved to localStorage.

The Spending Breakdown pie chart and Top 3 Categories use all-time totals — Budget Goals and Alerts use current month only.

---

## Import CSV Format

```
date,description,category,amount,type
2025-07-01,Monthly Salary,Salary,65000,income
2025-07-05,Groceries,Food,2500,expense
```

- `date` — `YYYY-MM-DD`
- `category` — one of: `Food`, `Transport`, `Shopping`, `Entertainment`, `Health`, `Utilities`, `Salary`, `Freelance`
- `type` — `income` or `expense`
- Optional: `notes`, `recurring` (`true` / `false`)

Invalid rows are skipped and reported in the toast.

---

## Mock Data

60 transactions · January–June 2025 · 8 categories · Indian Rupees (₹)

Realistic Indian pricing and merchant names (Ola, Rapido, PVR, Wonderla, Barbeque Nation, etc.).

Recurring flagged on: Monthly Salary, Netflix, Spotify, Electricity Bill, Internet Bill, Gym Membership, Water Bill.

Mock data version auto-detected via hash — localStorage clears automatically when data changes.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar (collapsible + edge toggle), Header (glassmorphism + guide),
│   │                 # Layout, AlertsPanel
│   ├── dashboard/    # SummaryCards (stagger + trends), BalanceTrendChart (area + net callout),
│   │                 # SpendingBreakdown (drill-down), RecurringList (done/pending + totals),
│   │                 # NetWorthCard (hero number + ratio bar)
│   ├── transactions/ # TransactionTable (totals bar + pagination), TransactionRow (memo + confirm),
│   │                 # TransactionFilters (responsive date range), AddEditModal (scrollable + focus trap)
│   ├── insights/     # InsightsPanel, TopSpendingCard (colored bg), MonthlyComparison (gradient bars),
│   │                 # SavingsRate (gradient + target marker), BudgetGoals (unified color system)
│   └── ui/           # Badge, EmptyState, RoleSwitcher (color-coded), Toast, Skeleton,
│                     # ErrorBoundary, WelcomeBanner (inline + re-openable)
├── context/          # InsightsContext — shared computed insights, runs useInsights once per page
├── store/            # useTransactionStore, useAppStore (widgets + sidebar + guide), useBudgetStore,
│                     # useNetWorthStore
├── data/             # mockData.js — 60 transactions, auto-hash versioning, recurring flags
├── hooks/            # useFilteredTransactions, useInsights (5 focused sub-hooks), useAlerts
├── utils/            # formatCurrency, formatDate, exportData (CSV + JSON), importData (CSV parse)
└── pages/            # Dashboard (InsightsProvider + WelcomeBanner), Transactions, Insights
```

---

## Architecture Notes

- **InsightsContext** — `useInsights` runs exactly once per page (Dashboard and Insights each have their own `InsightsProvider`). All child components consume via `useInsightsContext`, eliminating duplicate Zustand subscriptions and redundant `useMemo` recalculations.
- **useInsights** is split into 5 focused sub-hooks (`useDateAnchors`, `useMonthlyTotals`, `useCategoryTotals`, `useBalanceTrend`, `useSpendingStreak`), each with narrowed `useMemo` dependencies — only the affected calculation re-runs on data change.
- **Spending Forecast** anchored to latest transaction date — not `new Date()` — so mock data always shows a meaningful projection.
- **TransactionRow** wrapped with `React.memo` — only re-renders when its own transaction prop changes.
- **ErrorBoundary** wraps all pages — a crash shows "Try again" without taking down the whole app.
- **Sidebar collapse** and **guide dismissed** state both persisted to localStorage via `useAppStore`.
- **WelcomeBanner** uses `showGuide` from `useAppStore` (session state) combined with a localStorage flag for first-visit detection — inline on Dashboard, re-openable via `?` in header.
