'use client';

import * as React from 'react';
import {
  FileBarChart, ShoppingCart, TrendingUp, UserCog, Bike,
  Users, Wallet, BadgeIndianRupee, ShieldCheck, Receipt, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { ExportButtons } from '@/components/admin/DataModule';
import { useDealership } from '@/components/admin/useDealership';
import { Card, CardHeader, LoadingBlock, StatusChip } from '@/components/ui';
import { RevenueAreaChart, HBarChart } from '@/components/charts/Charts';
import { LockedButton } from '@/components/modals/LockedFeature';
import { revenueTotals, revenueByMonth, topBy, expenseTotals } from '@/lib/tamil-motors/revenue';
import { inr, cn, pct } from '@/lib/utils';

const RANGES = ['Today', 'This Week', 'This Month', 'Last Month', 'Custom Range'] as const;

const DAY = 86400000;
function inRange(dateStr: string, range: string) {
  const t = new Date(dateStr).getTime();
  const now = Date.now();
  const d = new Date();
  switch (range) {
    case 'Today': return dateStr === new Date().toISOString().slice(0, 10);
    case 'This Week': return now - t <= 7 * DAY;
    case 'This Month': return dateStr.slice(0, 7) === new Date().toISOString().slice(0, 7);
    case 'Last Month': {
      d.setMonth(d.getMonth() - 1);
      return dateStr.slice(0, 7) === d.toISOString().slice(0, 7);
    }
    default: return true;
  }
}

export default function ReportsPage() {
  const d = useDealership();
  const [range, setRange] = React.useState<string>('This Month');

  if (d.loading) {
    return (<><PageHeader title="Reports" description="Loading reports…" /><LoadingBlock /></>);
  }

  const sales = d.sales.filter((s) => inRange(s.saleDate, range));
  const payments = d.payments.filter((p) => inRange(p.date, range));
  const expenses = d.expenses.filter((e) => inRange(e.date, range));
  const totals = revenueTotals(sales);
  const exp = expenseTotals(expenses);

  const REPORTS = [
    { icon: ShoppingCart, title: 'Sales Report', value: `${sales.length} sales`, note: inr(totals.total) },
    { icon: TrendingUp, title: 'Revenue Report', value: inr(totals.total), note: `${range}` },
    { icon: UserCog, title: 'Employee Performance', value: `${d.employees.filter((e) => e.status === 'active').length} active`, note: 'Targets vs achievement' },
    { icon: Bike, title: 'Inventory Report', value: `${d.inventory.length} units`, note: `${d.inventory.filter((i) => i.stockStatus === 'Available').length} available` },
    { icon: Users, title: 'Customer Report', value: `${d.customers.length} customers`, note: `${d.customers.filter((c) => c.status === 'lead').length} open leads` },
    { icon: Wallet, title: 'Payment Report', value: `${payments.length} payments`, note: inr(payments.reduce((t, p) => t + p.amount, 0)) },
    { icon: BadgeIndianRupee, title: 'Finance Report', value: `${d.finance.length} applications`, note: `${d.finance.filter((f) => f.status === 'Approved' || f.status === 'Disbursed').length} approved` },
    { icon: ShieldCheck, title: 'Insurance Report', value: `${d.insurance.length} policies`, note: `${d.insurance.filter((i) => i.status === 'Expiring Soon').length} expiring soon` },
    { icon: Receipt, title: 'Expense Report', value: inr(exp.total), note: `${expenses.length} entries` },
  ];

  return (
    <>
      <PageHeader
        title="Reports"
        description="Operational and financial reporting across every module of the dealership."
        action={<ExportButtons />}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              range === r ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:text-ink-900',
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map(({ icon: Icon, title, value, note }) => (
          <div key={title} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-700">
                <Icon className="h-5 w-5" />
              </span>
              <FileBarChart className="h-4 w-4 text-ink-300" />
            </div>
            <p className="mt-4 text-sm font-bold text-ink-900">{title}</p>
            <p className="mt-1 text-xl font-black text-ink-900">{value}</p>
            <p className="mt-0.5 text-xs text-ink-500">{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Revenue trend" subtitle="Rolling 12 months" icon={TrendingUp} />
          <div className="p-4"><RevenueAreaChart data={revenueByMonth(d.sales)} /></div>
        </Card>
        <Card>
          <CardHeader title="Expenses by category" subtitle="All recorded expenses" icon={Receipt} />
          <div className="p-4"><HBarChart data={exp.byCategory} /></div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader title="Employee performance summary" subtitle="Monthly target vs achievement" icon={UserCog} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-ink-50/80">
              <tr>{['Employee', 'Role', 'Sales', 'Revenue', 'Target', 'Achievement', 'Status'].map((h) => <th key={h} className="th">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {d.employees.map((e) => (
                <tr key={e.id} className="hover:bg-ink-50/70">
                  <td className="td font-semibold text-ink-900">{e.name}</td>
                  <td className="td">{e.role}</td>
                  <td className="td">{e.salesCount}</td>
                  <td className="td">{inr(e.revenueGenerated)}</td>
                  <td className="td">{inr(e.monthlyTarget)}</td>
                  <td className="td font-bold text-ink-900">{pct(e.monthlySales, e.monthlyTarget)}%</td>
                  <td className="td"><StatusChip value={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-950 p-6 text-white">
        <div>
          <p className="text-sm font-bold">Scheduled &amp; branded reports</p>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            Automatic PDF and Excel exports, branded templates and scheduled email delivery to management
            are part of the complete reporting module.
          </p>
        </div>
        <LockedButton featureKey="export" label="Unlock Exports" className="btn bg-white text-ink-900 hover:bg-white/90" />
      </div>
    </>
  );
}
