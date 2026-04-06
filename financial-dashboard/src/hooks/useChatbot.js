import { useInsights } from './useInsights';
import { useBudgetStore } from '../store/useBudgetStore';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const pct = (n) => `${Math.round(n)}%`;

// ─── intent patterns ───────────────────────────────────────────────────────
const INTENTS = [
  { keys: ['hello', 'hi', 'hey', 'help', 'what can you do'], id: 'greeting' },
  { keys: ['balance', 'net', 'total balance'], id: 'balance' },
  { keys: ['saving', 'savings rate', 'how much saved', 'saved this month'], id: 'savings' },
  { keys: ['top category', 'most spent', 'highest spending', 'where am i spending'], id: 'top_category' },
  { keys: ['budget', 'over budget', 'budget status', 'limits'], id: 'budget_status' },
  { keys: ['this month', 'monthly expense', 'spend this month', 'current month'], id: 'this_month' },
  { keys: ['last month', 'previous month', 'compare month'], id: 'last_month' },
  { keys: ['daily', 'today', 'this week', 'weekly', 'week expense'], id: 'period' },
  { keys: ['forecast', 'projected', 'end of month', 'month end'], id: 'forecast' },
  { keys: ['income', 'earned', 'salary', 'how much i earn'], id: 'income' },
  { keys: ['tip', 'suggest', 'advice', 'recommendation', 'improve', 'how to save'], id: 'tips' },
  { keys: ['recurring', 'subscriptions', 'fixed expense'], id: 'recurring' },
  { keys: ['streak', 'large expense', 'big purchase'], id: 'streak' },
  { keys: ['top 3', 'top three', 'categories breakdown', 'category breakdown'], id: 'top3' },
];

function matchIntent(input) {
  const lower = input.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some((k) => lower.includes(k))) return intent.id;
  }
  return 'unknown';
}

// ─── response generators ───────────────────────────────────────────────────
function buildResponse(intent, insights, budgets) {
  const {
    savingsRate, topCategory, top3Categories, monthlyComparison,
    spendingForecast, spendingStreak, categoryTotals, periodExpenses,
    balanceTrend,
  } = insights;

  const { thisMonthIncome, thisMonthExpenses, lastMonthIncome, lastMonthExpenses } = monthlyComparison;
  const netThisMonth = thisMonthIncome - thisMonthExpenses;
  const latestBalance = balanceTrend.reduce((s, m) => s + m.balance, 0);

  switch (intent) {
    case 'greeting':
      return `Hi! 👋 I'm your spending assistant. Ask me things like:\n• "What's my savings rate?"\n• "Am I over budget?"\n• "Give me spending tips"\n• "How much did I spend this month?"`;

    case 'balance':
      return `Your cumulative net balance across all tracked months is ${fmt(latestBalance)}.\n\nThis month: Income ${fmt(thisMonthIncome)} − Expenses ${fmt(thisMonthExpenses)} = ${netThisMonth >= 0 ? '✅' : '⚠️'} ${fmt(netThisMonth)}.`;

    case 'savings': {
      const saved = thisMonthIncome - thisMonthExpenses;
      const status = savingsRate >= 20 ? '🟢 Great job!' : savingsRate >= 10 ? '🟡 Decent, but room to improve.' : '🔴 Below healthy threshold (20%).';
      return `Your savings rate this month is **${pct(savingsRate)}** — you saved ${fmt(saved)}.\n\n${status}\n\n💡 Tip: A healthy savings rate is 20%+. Try trimming your top spending category (${topCategory?.category || 'N/A'}) to boost it.`;
    }

    case 'top_category':
      return topCategory
        ? `Your highest spending category (all time) is **${topCategory.category}** at ${fmt(topCategory.amount)}.\n\nThis month's top categories:\n${Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, a], i) => `${i + 1}. ${c} — ${fmt(a)}`).join('\n')}`
        : `No expense data found yet.`;

    case 'budget_status': {
      const lines = Object.entries(budgets).map(([cat, limit]) => {
        const spent = categoryTotals[cat] || 0;
        const p = Math.round((spent / limit) * 100);
        const icon = p >= 100 ? '🔴' : p >= 80 ? '🟡' : '🟢';
        return `${icon} ${cat}: ${fmt(spent)} / ${fmt(limit)} (${p}%)`;
      });
      return `Budget status this month:\n\n${lines.join('\n')}`;
    }

    case 'this_month':
      return `This month you've spent **${fmt(thisMonthExpenses)}** across all categories.\n\nTop spend: ${Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([c, a]) => `${c} (${fmt(a)})`)[0] || 'N/A'}.`;

    case 'last_month': {
      const diff = thisMonthExpenses - lastMonthExpenses;
      const arrow = diff > 0 ? `↑ ${fmt(diff)} more` : `↓ ${fmt(Math.abs(diff))} less`;
      return `Last month expenses: ${fmt(lastMonthExpenses)}\nThis month expenses: ${fmt(thisMonthExpenses)}\n\nYou're spending **${arrow}** than last month.${diff > 0 ? '\n\n💡 Try to identify what drove the increase.' : '\n\n✅ Good progress keeping expenses down!'}`;
    }

    case 'period': {
      const weekTotal = periodExpenses.weekly.at(-1)?.total || 0;
      const dayTotal = periodExpenses.daily.at(-1)?.total || 0;
      const weekAvg = Math.round(periodExpenses.weekly.reduce((s, w) => s + w.total, 0) / 6);
      return `📅 Recent spending:\n• Today: ${fmt(dayTotal)}\n• This week: ${fmt(weekTotal)}\n• 6-week avg/week: ${fmt(weekAvg)}\n\n${weekTotal > weekAvg ? '⚠️ This week is above your average.' : '✅ This week is within your average.'}`;
    }

    case 'forecast':
      return `Projected month-end spend: **${fmt(spendingForecast)}**\n\nLast month total: ${fmt(lastMonthExpenses)}\n\n${spendingForecast > lastMonthExpenses ? `⚠️ You're on track to spend ${fmt(spendingForecast - lastMonthExpenses)} more than last month.` : `✅ You're on track to spend less than last month.`}`;

    case 'income':
      return `This month's income: **${fmt(thisMonthIncome)}**\nLast month's income: ${fmt(lastMonthIncome)}\n\nAfter expenses, you have ${fmt(netThisMonth)} left this month.`;

    case 'tips': {
      const tips = [];
      if (savingsRate < 20) tips.push(`💰 Savings rate is ${pct(savingsRate)} — aim for 20%+ by cutting discretionary spend.`);
      Object.entries(budgets).forEach(([cat, limit]) => {
        const spent = categoryTotals[cat] || 0;
        if (spent > limit) tips.push(`🔴 ${cat} is over budget by ${fmt(spent - limit)} — review recent ${cat.toLowerCase()} transactions.`);
        else if (spent / limit >= 0.8) tips.push(`🟡 ${cat} is at ${pct((spent / limit) * 100)} of budget — slow down spending here.`);
      });
      if (thisMonthExpenses > lastMonthExpenses) tips.push(`📈 Spending is up ${fmt(thisMonthExpenses - lastMonthExpenses)} vs last month — check what changed.`);
      if (tips.length === 0) tips.push(`✅ Everything looks healthy! Keep maintaining your current spending habits.`);
      return `Here are personalised tips based on your data:\n\n${tips.join('\n\n')}`;
    }

    case 'recurring':
      return `Your recurring transactions are tracked on the Dashboard under "Recurring Transactions".\n\nThey contribute to your fixed monthly commitments — review them to spot any unused subscriptions.`;

    case 'streak':
      return spendingStreak !== null
        ? `It's been **${spendingStreak} day${spendingStreak !== 1 ? 's' : ''}** since your last expense over ₹2,000.\n\n${spendingStreak >= 7 ? '✅ Great streak! Keep avoiding large impulse purchases.' : '💡 Try to extend this streak — avoid non-essential purchases over ₹2,000.'}`
        : `No large expenses (over ₹2,000) found in your data.`;

    case 'top3':
      return top3Categories.length
        ? `Your top 3 expense categories (all time):\n\n${top3Categories.map((c, i) => `${i + 1}. **${c.category}** — ${fmt(c.amount)}`).join('\n')}`
        : `No expense data found yet.`;

    default:
      return `I didn't quite understand that. Try asking:\n• "What's my savings rate?"\n• "Show budget status"\n• "Give me spending tips"\n• "How much did I spend this week?"`;
  }
}

// ─── main hook ─────────────────────────────────────────────────────────────
export function useChatbot() {
  const insights = useInsights();
  const { budgets } = useBudgetStore();

  const respond = (input) => {
    const intent = matchIntent(input.trim());
    return buildResponse(intent, insights, budgets);
  };

  return { respond };
}
