'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Phone, Mail, Briefcase, Target, IndianRupee,
  TrendingUp, Percent, MessageSquare, MapPin,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { KpiCard, ProgressBar } from '@/components/admin/Kpi';
import { useDealership } from '@/components/admin/useDealership';
import { Card, CardHeader, StatusChip, LoadingBlock, EmptyState } from '@/components/ui';
import { RevenueAreaChart, TrendLineChart, HBarChart } from '@/components/charts/Charts';
import { LockedButton } from '@/components/modals/LockedFeature';
import { revenueByMonth, topBy } from '@/lib/tamil-motors/revenue';
import { inr, fmtDate, pct, initials, MONTH_LABELS } from '@/lib/utils';

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const d = useDealership();

  if (d.loading) return (<><PageHeader title="Employee" description="Loading profile…" /><LoadingBlock /></>);

  const employee = d.employees.find((e) => e.id === params.id);
  if (!employee) {
    return (
      <>
        <PageHeader title="Employee not found" description="This employee record is not in the demo dataset." />
        <Card><EmptyState title="Not found" message="Go back to the employee list and pick another record." /></Card>
        <Link href="/admin/employees" className="btn-outline mt-4">Back to employees</Link>
      </>
    );
  }

  const sales = d.sales.filter((s) => s.employeeId === employee.id);
  const followups = d.followups.filter((f) => f.employeeName === employee.name && !f.done);
  const achievement = pct(employee.monthlySales, employee.monthlyTarget);

  // Target vs achievement across the last 6 months (demo distribution).
  const now = new Date();
  const targetTrend = Array.from({ length: 6 }, (_, i) => {
    const dt = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    const achieved = sales
      .filter((s) => s.saleDate.slice(0, 7) === key && s.saleStatus !== 'Cancelled')
      .reduce((t, s) => t + s.finalAmount, 0);
    return { name: MONTH_LABELS[dt.getMonth()], target: employee.monthlyTarget, achieved };
  });

  const byModel = topBy(sales, (s) => s.bikeName as never, 5);

  return (
    <>
      <Link href="/admin/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to employees
      </Link>

      <div className="card mb-5 p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-950 text-lg font-black text-white">
            {initials(employee.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-ink-900">{employee.name}</h1>
              <StatusChip value={employee.status} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
              <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{employee.role}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{employee.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{employee.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{employee.branch}</span>
            </div>
            <p className="mt-1.5 text-xs text-ink-400">Joined {fmtDate(employee.joiningDate)}</p>
          </div>
          <div className="w-full max-w-xs">
            <ProgressBar value={employee.monthlySales} max={employee.monthlyTarget} label="Monthly achievement" />
            <p className="mt-2 text-xs text-ink-500">
              {inr(employee.monthlySales)} of {inr(employee.monthlyTarget)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Monthly Target" value={inr(employee.monthlyTarget)} icon={Target} tone="blue" />
        <KpiCard label="Monthly Sales" value={inr(employee.monthlySales)} icon={IndianRupee} tone="brand" />
        <KpiCard label="Revenue Generated" value={inr(employee.revenueGenerated)} icon={TrendingUp} tone="green" />
        <KpiCard label="Achievement" value={`${achievement}%`} icon={Percent} tone={achievement >= 80 ? 'green' : 'amber'} hint={`${employee.salesCount} sales closed`} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Conversion Rate</p>
          <p className="mt-1 text-2xl font-black text-ink-900">{employee.conversionRate}%</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Pending Follow-ups</p>
          <p className="mt-1 text-2xl font-black text-ink-900">{followups.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Sales Recorded</p>
          <p className="mt-1 text-2xl font-black text-ink-900">{sales.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Branch</p>
          <p className="mt-1 text-sm font-bold text-ink-900">{employee.branch}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Target vs achievement" subtitle="Last 6 months" icon={Target} />
          <div className="p-4"><TrendLineChart data={targetTrend} /></div>
        </Card>
        <Card>
          <CardHeader title="Revenue trend" subtitle="This employee's sales over 12 months" icon={TrendingUp} />
          <div className="p-4"><RevenueAreaChart data={revenueByMonth(sales)} /></div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent sales" subtitle={`${sales.length} transactions attributed to ${employee.name}`} icon={IndianRupee} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead className="bg-ink-50/80">
                <tr>{['Sale ID', 'Customer', 'Bike', 'Date', 'Amount', 'Status'].map((h) => <th key={h} className="th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {sales.slice(0, 10).map((s) => (
                  <tr key={s.id} className="hover:bg-ink-50/70">
                    <td className="td font-semibold text-ink-900">{s.saleCode}</td>
                    <td className="td">{s.customerName}</td>
                    <td className="td">{s.bikeName}</td>
                    <td className="td">{fmtDate(s.saleDate)}</td>
                    <td className="td font-bold text-ink-900">{inr(s.finalAmount)}</td>
                    <td className="td"><StatusChip value={s.saleStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!sales.length ? <EmptyState title="No sales yet" message="Sales attributed to this employee will appear here." /> : null}
          </div>
        </Card>

        <Card>
          <CardHeader title="Customer conversion by model" icon={MessageSquare} />
          <div className="p-4">
            {byModel.length ? <HBarChart data={byModel} height={260} /> : <EmptyState title="No data yet" message="Model performance appears once sales are recorded." />}
          </div>
        </Card>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-950 p-6 text-white">
        <div>
          <p className="text-sm font-bold">Employee performance prediction</p>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            Forecast whether {employee.name.split(' ')[0]} will hit target this month and get coaching
            recommendations from the AI analytics module.
          </p>
        </div>
        <LockedButton featureKey="ai-sales" label="Unlock Prediction" className="btn bg-white text-ink-900 hover:bg-white/90" />
      </div>
    </>
  );
}
