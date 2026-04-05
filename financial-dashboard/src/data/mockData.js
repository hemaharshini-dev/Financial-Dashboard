const generateId = () => Math.random().toString(36).substring(2, 11);

// Auto-invalidate localStorage when mock data changes.
// Hash is derived from transaction count + first/last dates + total amount sum.
// No need to manually bump a version string.
const computeHash = (txns) => {
  const sig = `${txns.length}|${txns[0]?.date}|${txns[txns.length - 1]?.date}|${txns.reduce((s, t) => s + t.amount, 0)}`;
  return sig.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0).toString(36);
};

export const mockTransactions = [
  { id: generateId(), date: '2025-01-03', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-01-05', description: 'Grocery Store', category: 'Food', amount: 2800, type: 'expense' },
  { id: generateId(), date: '2025-01-07', description: 'Ola Ride', category: 'Transport', amount: 320, type: 'expense' },
  { id: generateId(), date: '2025-01-09', description: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-01-11', description: 'Electricity Bill', category: 'Utilities', amount: 1850, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-01-13', description: 'Freelance Project', category: 'Freelance', amount: 18000, type: 'income' },
  { id: generateId(), date: '2025-01-15', description: 'Amazon Shopping', category: 'Shopping', amount: 4200, type: 'expense' },
  { id: generateId(), date: '2025-01-18', description: 'Doctor Visit', category: 'Health', amount: 800, type: 'expense' },
  { id: generateId(), date: '2025-01-20', description: 'Restaurant Dinner', category: 'Food', amount: 1400, type: 'expense' },
  { id: generateId(), date: '2025-01-22', description: 'Metro Card Recharge', category: 'Transport', amount: 500, type: 'expense' },
  { id: generateId(), date: '2025-01-25', description: 'Gym Membership', category: 'Health', amount: 1200, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-01-28', description: 'Internet Bill', category: 'Utilities', amount: 999, type: 'expense', recurring: true },

  { id: generateId(), date: '2025-02-01', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-02-03', description: 'Cafe Coffee Day', category: 'Food', amount: 480, type: 'expense' },
  { id: generateId(), date: '2025-02-05', description: 'Spotify Premium', category: 'Entertainment', amount: 119, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-02-07', description: 'Freelance Design', category: 'Freelance', amount: 25000, type: 'income' },
  { id: generateId(), date: '2025-02-10', description: 'Clothing Store', category: 'Shopping', amount: 3500, type: 'expense' },
  { id: generateId(), date: '2025-02-12', description: 'Auto Fare', category: 'Transport', amount: 280, type: 'expense' },
  { id: generateId(), date: '2025-02-14', description: 'Valentine Dinner', category: 'Food', amount: 2200, type: 'expense' },
  { id: generateId(), date: '2025-02-17', description: 'Water Bill', category: 'Utilities', amount: 450, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-02-20', description: 'Pharmacy', category: 'Health', amount: 650, type: 'expense' },
  { id: generateId(), date: '2025-02-24', description: 'Movie Tickets', category: 'Entertainment', amount: 900, type: 'expense' },

  { id: generateId(), date: '2025-03-01', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-03-03', description: 'Supermarket', category: 'Food', amount: 3200, type: 'expense' },
  { id: generateId(), date: '2025-03-06', description: 'Freelance Consulting', category: 'Freelance', amount: 20000, type: 'income' },
  { id: generateId(), date: '2025-03-08', description: 'Petrol', category: 'Transport', amount: 1500, type: 'expense' },
  { id: generateId(), date: '2025-03-10', description: 'Electronics Purchase', category: 'Shopping', amount: 12000, type: 'expense' },
  { id: generateId(), date: '2025-03-13', description: 'Electricity Bill', category: 'Utilities', amount: 1700, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-03-16', description: 'Dental Checkup', category: 'Health', amount: 1500, type: 'expense' },
  { id: generateId(), date: '2025-03-19', description: 'Concert Tickets', category: 'Entertainment', amount: 2500, type: 'expense' },
  { id: generateId(), date: '2025-03-22', description: 'Lunch Out', category: 'Food', amount: 750, type: 'expense' },
  { id: generateId(), date: '2025-03-26', description: 'Online Course', category: 'Shopping', amount: 1999, type: 'expense' },

  { id: generateId(), date: '2025-04-01', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-04-04', description: 'Grocery Run', category: 'Food', amount: 2600, type: 'expense' },
  { id: generateId(), date: '2025-04-06', description: 'Freelance Writing', category: 'Freelance', amount: 12000, type: 'income' },
  { id: generateId(), date: '2025-04-08', description: 'Metro Card Recharge', category: 'Transport', amount: 500, type: 'expense' },
  { id: generateId(), date: '2025-04-11', description: 'Footwear Purchase', category: 'Shopping', amount: 2800, type: 'expense' },
  { id: generateId(), date: '2025-04-14', description: 'Internet Bill', category: 'Utilities', amount: 999, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-04-17', description: 'Vitamin Supplements', category: 'Health', amount: 850, type: 'expense' },
  { id: generateId(), date: '2025-04-20', description: 'Hotstar Subscription', category: 'Entertainment', amount: 299, type: 'expense' },
  { id: generateId(), date: '2025-04-23', description: 'Barbeque Nation', category: 'Food', amount: 1800, type: 'expense' },
  { id: generateId(), date: '2025-04-27', description: 'Gas Cylinder', category: 'Utilities', amount: 950, type: 'expense' },

  { id: generateId(), date: '2025-05-01', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-05-03', description: 'Bakery', category: 'Food', amount: 380, type: 'expense' },
  { id: generateId(), date: '2025-05-05', description: 'Freelance App Dev', category: 'Freelance', amount: 35000, type: 'income' },
  { id: generateId(), date: '2025-05-08', description: 'Car Service', category: 'Transport', amount: 3500, type: 'expense' },
  { id: generateId(), date: '2025-05-11', description: 'Book Store', category: 'Shopping', amount: 1200, type: 'expense' },
  { id: generateId(), date: '2025-05-14', description: 'Electricity Bill', category: 'Utilities', amount: 2100, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-05-17', description: 'Eye Checkup', category: 'Health', amount: 1200, type: 'expense' },
  { id: generateId(), date: '2025-05-20', description: 'Wonderla Theme Park', category: 'Entertainment', amount: 1800, type: 'expense' },
  { id: generateId(), date: '2025-05-24', description: 'Weekly Groceries', category: 'Food', amount: 2200, type: 'expense' },

  { id: generateId(), date: '2025-06-01', description: 'Monthly Salary', category: 'Salary', amount: 65000, type: 'income', recurring: true },
  { id: generateId(), date: '2025-06-03', description: 'Tea & Snacks', category: 'Food', amount: 220, type: 'expense' },
  { id: generateId(), date: '2025-06-05', description: 'Freelance SEO', category: 'Freelance', amount: 15000, type: 'income' },
  { id: generateId(), date: '2025-06-07', description: 'Rapido Ride', category: 'Transport', amount: 180, type: 'expense' },
  { id: generateId(), date: '2025-06-10', description: 'Summer Clothes', category: 'Shopping', amount: 4500, type: 'expense' },
  { id: generateId(), date: '2025-06-13', description: 'Water & Internet', category: 'Utilities', amount: 1450, type: 'expense', recurring: true },
  { id: generateId(), date: '2025-06-16', description: 'Protein Supplement', category: 'Health', amount: 1800, type: 'expense' },
  { id: generateId(), date: '2025-06-19', description: 'PVR Cinema', category: 'Entertainment', amount: 700, type: 'expense' },
  { id: generateId(), date: '2025-06-22', description: 'Dinner Party', category: 'Food', amount: 3200, type: 'expense' },
  { id: generateId(), date: '2025-06-25', description: 'Laptop Accessory', category: 'Shopping', amount: 2200, type: 'expense' },
];

export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Salary', 'Freelance'];

// Auto-invalidate localStorage if mock data has changed
if (typeof window !== 'undefined') {
  const hash = computeHash(mockTransactions);
  if (localStorage.getItem('fd_data_version') !== hash) {
    localStorage.removeItem('fd_transactions');
    localStorage.setItem('fd_data_version', hash);
  }
}

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Entertainment: '#ec4899',
  Health: '#22c55e',
  Utilities: '#eab308',
  Salary: '#10b981',
  Freelance: '#06b6d4',
};
