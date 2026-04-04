# Financial Dashboard — Project Plan

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **State**: Zustand
- **Data Persistence**: localStorage
- **Icons**: Lucide React
- **Extras**: Framer Motion (animations), date-fns (date formatting)

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Header.jsx           # Top bar with role switcher + dark mode
│   │   └── Layout.jsx           # Wrapper layout
│   ├── dashboard/
│   │   ├── SummaryCards.jsx     # Balance, Income, Expense cards
│   │   ├── BalanceTrendChart.jsx # Line chart — balance over months
│   │   └── SpendingBreakdown.jsx # Donut/Pie chart — category breakdown
│   ├── transactions/
│   │   ├── TransactionTable.jsx  # Table with sort, filter, search
│   │   ├── TransactionRow.jsx    # Single row component
│   │   ├── TransactionFilters.jsx# Filter bar (category, type, date range)
│   │   └── AddEditModal.jsx      # Admin-only: add/edit transaction modal
│   ├── insights/
│   │   ├── InsightsPanel.jsx     # Container for all insight cards
│   │   ├── TopSpendingCard.jsx   # Highest spending category
│   │   ├── MonthlyComparison.jsx # Bar chart: this month vs last month
│   │   └── SavingsRate.jsx       # Income vs expense ratio insight
│   └── ui/
│       ├── Badge.jsx             # Category/type badges
│       ├── EmptyState.jsx        # Empty/no data fallback UI
│       └── RoleSwitcher.jsx      # Dropdown to switch Viewer/Admin
├── store/
│   ├── useTransactionStore.js   # Zustand: transactions CRUD + filters
│   └── useAppStore.js           # Zustand: role, theme, UI state
├── data/
│   └── mockData.js              # 40–60 realistic mock transactions
├── hooks/
│   ├── useFilteredTransactions.js # Derived filtered/sorted list
│   └── useInsights.js             # Computed insight values
├── utils/
│   ├── formatCurrency.js
│   ├── formatDate.js
│   └── exportData.js            # CSV + JSON export helpers
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
├── App.jsx
└── main.jsx
```

---

## Pages & Features Breakdown

### 1. Dashboard Page
| Feature | Details |
|---|---|
| Summary Cards | Total Balance, Monthly Income, Monthly Expenses, Savings Rate — animated count-up on load |
| Balance Trend | Line chart showing balance across last 6 months |
| Spending Breakdown | Donut chart with category legend (Food, Transport, Shopping, etc.) |
| Quick Stats | Largest single expense, most active category this month |

### 2. Transactions Page
| Feature | Details |
|---|---|
| Transaction Table | Date, Description, Category, Amount, Type (Income/Expense) |
| Search | Real-time search by description or category |
| Filter | By type (income/expense), category, date range |
| Sort | By date, amount (asc/desc) |
| Add Transaction | Admin only — modal form with validation |
| Edit/Delete | Admin only — inline actions per row |
| Empty State | Friendly UI when no results match filters |

### 3. Insights Page
| Feature | Details |
|---|---|
| Highest Spending Category | Card with category name, total amount, % of expenses |
| Monthly Comparison | Bar chart: current vs previous month income & expenses |
| Savings Rate | Visual gauge or progress bar |
| Spending Streak | Days since last large expense (fun metric) |
| Top 3 Expense Categories | Ranked list with amounts |

### 4. Role-Based UI
| Role | Capabilities |
|---|---|
| Viewer | Read-only: see all data, charts, insights. No add/edit/delete |
| Admin | Full access: add, edit, delete transactions. Sees extra action columns |

- Role switcher in the Header (dropdown)
- Role persisted in localStorage
- UI elements conditionally rendered — no routing guards needed

---

## Mock Data Design
- 50 transactions spanning last 6 months
- Categories: Food, Transport, Shopping, Entertainment, Health, Utilities, Salary, Freelance
- Mix of income and expense types
- Realistic amounts and descriptions

---

## Optional Enhancements (all included)
- **Dark Mode** — Tailwind `dark:` classes, toggled via Header button, persisted
- **localStorage persistence** — transactions and role survive page refresh
- **Export** — Download transactions as CSV or JSON (Admin only)
- **Animations** — Framer Motion on card mount, chart entry, modal open/close
- **Advanced Filtering** — Multi-select categories, date range picker

---

## UI/UX Design Decisions
- Sidebar navigation (collapsible on mobile → bottom nav)
- Color system: green for income, red for expense, blue for neutral/balance
- Cards with subtle shadows and hover lift effect
- Skeleton loaders on initial data load simulation
- Responsive: desktop sidebar, tablet/mobile hamburger + bottom nav
- Consistent 8px spacing grid via Tailwind

---

## What Makes This Stand Out
1. Animated summary cards with count-up numbers
2. Smooth chart transitions on data change
3. Role switcher with instant UI feedback (toast notification)
4. Export to CSV/JSON with one click
5. Fully responsive — pixel-perfect on mobile
6. Dark mode with system preference detection
7. Empty states with helpful illustrations/messages
8. Keyboard accessible modals and filters

---

## Setup Plan
1. `npm create vite@latest financial-dashboard -- --template react`
2. Install: `tailwindcss recharts zustand framer-motion lucide-react date-fns`
3. Configure Tailwind with dark mode (`class` strategy)
4. Build mock data → store → hooks → components → pages

---

## README Sections (to write at end)
- Project overview
- Tech stack with reasons
- Setup & run instructions
- Feature walkthrough
- Role switching guide
- Screenshots
