'use client';

import { MONTH_LABELS } from '@/lib/utils';
import type { Sale, Expense, Employee } from '@/types';

const DAY = 86400000;
const countable = (s: Sale) => s.saleStatus !== 'Cancelled';

export function revenueTotals(sales: Sale[]) {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const live = sales.filter(countable);
  const sum = (rows: Sale[]) => rows.reduce((t, s) => t + s.finalAmount, 0);

  return {
    total: sum(live),
    today: sum(live.filter((s) => s.saleDate === today)),
    week: sum(live.filter((s) => now - new Date(s.saleDate).getTime() <= 7 * DAY)),
    month: sum(live.filter((s) => now - new Date(s.saleDate).getTime() <= 30 * DAY)),
    year: sum(live.filter((s) => now - new Date(s.saleDate).getTime() <= 365 * DAY)),
    pending: sales.filter((s) => s.paymentStatus !== 'paid' && countable(s))
      .reduce((t, s) => t + s.finalAmount, 0),
  };
}

export function revenueByMonth(sales: Sale[]) {
  const buckets = new Map<string, number>();
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, 0);
  }
  sales.filter(countable).forEach((s) => {
    const key = s.saleDate.slice(0, 7);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + s.finalAmount);
  });
  return [...buckets.entries()].map(([key, revenue]) => ({
    month: `${MONTH_LABELS[Number(key.slice(5, 7)) - 1]} ${key.slice(2, 4)}`,
    revenue,
  }));
}

export function topBy<T extends string>(
  sales: Sale[], keyFn: (s: Sale) => T, take = 6,
) {
  const map = new Map<string, number>();
  sales.filter(countable).forEach((s) => {
    const k = keyFn(s);
    map.set(k, (map.get(k) ?? 0) + s.finalAmount);
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([name, value]) => ({ name, value }));
}

export function revenueSplit(sales: Sale[]) {
  const live = sales.filter(countable);
  return {
    bikeSales: live.reduce((t, s) => t + s.basePrice - s.discount, 0),
    accessories: live.reduce((t, s) => t + s.accessoriesAmount, 0),
    insurance: live.reduce((t, s) => t + s.insuranceAmount, 0),
    other: live.reduce((t, s) => t + s.registrationAmount + s.financeCharges + s.otherCharges, 0),
  };
}

export function expenseTotals(expenses: Expense[]) {
  const total = expenses.reduce((t, e) => t + e.amount, 0);
  const byCategory = new Map<string, number>();
  expenses.forEach((e) => byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount));
  return {
    total,
    byCategory: [...byCategory.entries()].map(([name, value]) => ({ name, value })),
  };
}

export function employeeLeaderboard(employees: Employee[], take = 5) {
  return [...employees]
    .filter((e) => e.status === 'active')
    .sort((a, b) => b.monthlySales - a.monthlySales)
    .slice(0, take);
}
