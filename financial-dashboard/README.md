# Spendlytic — Financial Dashboard

A clean, interactive financial dashboard built with React + Vite. Track transactions, visualize spending patterns, set budget goals, monitor net worth, and switch between Viewer and Admin roles — with dark mode, animations, and localStorage persistence. All amounts are in Indian Rupees (₹).

![Spendlytic Demo](./assets/demo.gif)

---

## Tech Stack

| Tool | Reason |
|---|---|
| React 19 + Vite | Fast dev server, modern React features |
| Tailwind CSS v4 | Utility-first styling, dark mode via `class` strategy |
| Recharts | Composable, responsive charts with dark mode support |
| Zustand | Minimal boilerplate state management with localStorage persistence |
| Framer Motion | Animations — stagger, count-up, hover lift, page transitions |
| Lucide React | Consistent icon set |
| date-fns | Lightweight date formatting and arithmetic |
| Inter (Google Fonts) | Clean, readable UI typography |

---

## Setup & Run

**Prerequisites:** Node.js 18+ and npm

```bash
cd financial-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
# Production build
npm run build && npm run preview
```

---

## Approach & Key Design Decisions

**Why Zustand over Redux?**
Each store (`useTransactionStore`, `useAppStore`, `useBudgetStore`, `useNetWorthStore`) has a single responsibility with zero boilerplate. Redux would add unnecessary complexity for a frontend-only app with no async middleware needs.

**Why no react-router?**
Only 3 pages. Hash-based routing (`window.location.hash`) achieves deep-linking and refresh-persistence in ~15 lines with zero dependencies.

**Why InsightsContext?**
`useInsights` is an expensive computation across 5 sub-hooks. Without context, every child component runs it independently. `InsightsProvider` wraps each page so the computation runs exactly once and all children share the result.

**Why split useInsights into 5 sub-hooks?**
A single `useMemo([transactions])` recalculates everything on every change. Splitting into `useDateAnchors`, `useMonthlyTotals`, `useCategoryTotals`, `useBalanceTrend`, `useSpendingStreak` means each only re-runs when its specific inputs change.

**Why mock data anchored to June 2025?**
If mock data used today's date, charts and insights would show empty data for most of the year. Anchoring to the latest transaction date means everything always shows meaningful data regardless of when the app is opened.

**Why a custom CSV parser instead of a library?**
The parser is ~25 lines and handles all needed edge cases (quoted fields, escaped quotes, commas in descriptions). Adding Papa Parse (~50KB) would be disproportionate.

---

## Features

### Dashboard

![Dashboard](./assets/dashboard.jpeg)

- Animated summary cards with trend indicators (↑/↓ % vs last month): Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Income vs Expenses stacked area chart — 6-month view with 6-month net callout
- Spending Breakdown donut chart — click any slice to filter Transactions by that category
- Quick stats: largest expense this month, most active category, projected month-end spend
- Recurring Transactions — Done ✓ / Pending status per item; total monthly commitments
- Net Worth Tracker — hero net worth number, assets vs liabilities ratio bar, Admin edits inline
- Customizable Widgets — show/hide any of 6 dashboard sections via ⚙ gear icon
- Welcome Guide — inline banner on first visit; re-open anytime via `?` in header

### Transactions

![Transactions Page](./assets/transactionPage.jpeg)

- Table with search, multi-select category filter, type filter, date range, and sort
- Active filter indicator — border highlights and filter summary pills when filters are on
- Search clear button, totals summary bar (income / expenses / net), pagination (15/page)
- **Admin only:** Add / Edit / Delete with confirmation dialog, `N` keyboard shortcut, Notes field, Recurring flag
- **Admin only:** Export CSV (RFC 4180 quoted, includes notes + recurring) and JSON
- **Admin only:** Import CSV with row-level validation and toast feedback

### Insights

![Insights Page](./assets/insightsPage.jpeg)

- Top Spending Category — colored card tinted with the category's own color
- Savings Rate — gradient progress bar, target marker at 20%, ₹ saved amount, income/expense breakdown
- Days Since Large Expense — streak counter for expenses over ₹2,000
- Monthly Comparison — bar chart with gradient fills and ↑/↓ % expense callout
- Top 3 Expense Categories — ranked with relative progress bars
- Budget Goals — per-category monthly limits, green → amber → red color system, Admin edits inline

### Alerts Panel
Smart alerts auto-derived from data: savings rate below 10%, spending higher than last month, budget at 80%+ or exceeded. Per-alert dismiss and Dismiss All. Color-coded by severity.

### Role-Based UI
- **Viewer** — read-only access to all data, charts, and insights
- **Admin** — full access: add, edit, delete, import, export, inline budget and asset editing
- Role switcher in header; toast on switch; persisted to localStorage

---

## Role Switching

Use the **Viewer / Admin** toggle in the header. Switching instantly shows/hides all admin controls and fires a confirmation toast. Role persists across page refreshes.

---

## How Budget Goals Work

Tracks spending **per category for the current month only**.

| Progress | Color | Badge |
|---|---|---|
| Under 80% | 🟢 Green | On track |
| 80–99% | 🟡 Amber | Approaching limit |
| 100%+ | 🔴 Red | Over budget |

Default limits: Food ₹5,000 · Transport ₹2,000 · Shopping ₹3,000 · Entertainment ₹1,500 · Health ₹2,000 · Utilities ₹3,000

As **Admin**, click the pencil icon to edit inline. Limits saved to localStorage.

---

## Import CSV Format

```
date,description,category,amount,type
2025-07-01,Monthly Salary,Salary,65000,income
2025-07-05,Groceries,Food,2500,expense
```

- `date` — `YYYY-MM-DD` · `category` — one of the 8 supported categories · `type` — `income` or `expense`
- Optional: `notes`, `recurring` (`true` / `false`)
- Invalid rows are skipped and reported in the toast

---

## Optional Enhancements Implemented

All optional enhancements from the spec were implemented, plus several additional ones:

| Enhancement | Details |
|---|---|
| ✅ Dark mode | System preference on first load; toggled via header; persisted |
| ✅ localStorage persistence | All data survives refresh — transactions, budgets, assets, role, preferences |
| ✅ Export CSV + JSON | RFC 4180 quoted CSV with notes and recurring columns |
| ✅ Import CSV | RFC 4180 parser, row-level validation, error reporting |
| ✅ Advanced filtering | Multi-select categories, date range, type, sort — all combinable |
| ✅ Animations | Framer Motion — stagger, count-up, hover lift, page transitions |
| ✅ Budget Goals | Per-category monthly limits, inline editing, smart color system |
| ✅ Net Worth Tracker | Assets + liabilities with ratio bar |
| ✅ Recurring Transactions | Done/Pending status, monthly commitment totals |
| ✅ Spending Forecast | Projected month-end spend anchored to latest transaction date |
| ✅ Smart Alerts | Auto-derived from savings rate, spending trends, budget overruns |
| ✅ Collapsible Sidebar | Edge toggle, icon-only collapsed state with tooltips |
| ✅ Customizable Widgets | Show/hide 6 dashboard sections, persisted |
| ✅ Onboarding Guide | First-visit inline banner, re-openable via `?` |
| ✅ Keyboard shortcuts | `N` to add transaction, `Escape` to close modal |
| ✅ Drill-down navigation | Pie chart slice → Transactions filtered by category |
| ✅ Error boundaries | Crash recovery without taking down the whole app |
| ✅ Hash-based routing | Deep-linking — refresh restores the correct page |

---

## Mock Data

60 transactions · January–June 2025 · 8 categories · Indian Rupees (₹)

Realistic Indian pricing and merchant names (Ola, Rapido, PVR, Wonderla, Barbeque Nation, etc.). Mock data version auto-detected via hash — localStorage clears automatically when data changes.

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Header, Layout, AlertsPanel
│   ├── dashboard/    # SummaryCards, BalanceTrendChart, SpendingBreakdown,
│   │                 # RecurringList, NetWorthCard
│   ├── transactions/ # TransactionTable, TransactionRow, TransactionFilters, AddEditModal
│   ├── insights/     # InsightsPanel, TopSpendingCard, MonthlyComparison,
│   │                 # SavingsRate, BudgetGoals
│   └── ui/           # Badge, EmptyState, RoleSwitcher, Toast, Skeleton,
│                     # ErrorBoundary, WelcomeBanner
├── context/          # InsightsContext — shared computed insights per page
├── store/            # useTransactionStore, useAppStore, useBudgetStore, useNetWorthStore
├── data/             # mockData.js — 60 transactions, auto-hash versioning
├── hooks/            # useFilteredTransactions, useInsights (5 sub-hooks), useAlerts
├── utils/            # formatCurrency, formatDate, exportData, importData
└── pages/            # Dashboard, Transactions, Insights
```

---

## Architecture Notes

- **InsightsContext** — `useInsights` runs once per page; all child components share the result via `useInsightsContext`, eliminating duplicate Zustand subscriptions.
- **useInsights** split into 5 focused sub-hooks with narrowed `useMemo` dependencies — only the affected calculation re-runs on data change.
- **Spending Forecast** anchored to latest transaction date — not `new Date()` — so mock data always shows a meaningful projection.
- **TransactionRow** wrapped with `React.memo` — only re-renders when its own transaction prop changes.
- **ErrorBoundary** wraps all pages — a crash shows "Try again" without taking down the whole app.
- **DEFAULT_FILTERS** constant in `useTransactionStore` — single source of truth for filter reset, no duplication.
