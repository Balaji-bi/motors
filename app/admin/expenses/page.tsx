'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';
import { KpiCard } from '@/components/admin/Kpi';
import { Receipt, TrendingUp, PiggyBank } from 'lucide-react';
import { revenueTotals } from '@/lib/tamil-motors/revenue';

export default function Page() {
  const d = useDealership();
  const rows = d.expenses;
  const totalExpenses = rows.reduce((t, e) => t + e.amount, 0);
  const revenue = revenueTotals(d.sales).total;
  const profit = revenue - totalExpenses;

  return (
    <>
      <PageHeader
        title="Expenses"
        description="Operating costs by category, and what they leave behind as profit."
        action={<><ExportButtons /></>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total Expenses" value={inr(totalExpenses)} icon={Receipt} tone="amber" hint={`${rows.length} entries`} />
        <KpiCard label="Net Revenue" value={inr(revenue)} icon={TrendingUp} tone="blue" hint="Confirmed sales" />
        <KpiCard label="Profit Estimate" value={inr(profit)} icon={PiggyBank} tone={profit >= 0 ? 'green' : 'brand'} hint="Revenue less expenses" />
      </div>

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search expenses…"
        columns={[
          { key: 'title', header: 'Expense', render: (r) => <span className="font-semibold text-ink-900">{r.title}</span>, search: (r) => r.title },
          { key: 'category', header: 'Category', render: (r) => <span className="chip bg-ink-100 text-ink-600">{r.category}</span>, search: (r) => r.category },
          { key: 'amount', header: 'Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.amount)}</span> },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'employee', header: 'Employee', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'description', header: 'Description', render: (r) => <span className="text-ink-500">{r.description}</span>, search: (r) => r.description },
        ]}
        filters={[
          { label: 'Category', options: ['Rent', 'Salary', 'Electricity', 'Marketing', 'Maintenance', 'Transport', 'Office', 'Other'], match: (r, v) => r.category === v },
        ]}
      />
    </>
  );
}
