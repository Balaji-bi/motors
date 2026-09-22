'use client';

import { IndianRupee, CalendarDays, CalendarRange, CalendarCheck2, TrendingUp, Users, Wallet, Bike } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { KpiCard } from '@/components/admin/Kpi';
import { ExportButtons } from '@/components/admin/DataModule';
import { useDealership } from '@/components/admin/useDealership';
import { Card, CardHeader, LoadingBlock } from '@/components/ui';
import { RevenueAreaChart, HBarChart, DonutChart } from '@/components/charts/Charts';
import { LockedButton } from '@/components/modals/LockedFeature';
import { revenueTotals, revenueByMonth, topBy, revenueSplit } from '@/lib/tamil-motors/revenue';
import { inr } from '@/lib/utils';

export default function RevenuePage() {
  const d = useDealership();

  if (d.loading) {
    return (<><PageHeader title="Revenue" description="Loading revenue analytics…" /><LoadingBlock /></>);
  }

  const totals = revenueTotals(d.sales);
  const split = revenueSplit(d.sales);
  const byModel = topBy(d.sales, (s) => s.bikeName as never, 6);
  const byEmployee = topBy(d.sales, (s) => s.employeeName as never, 6);
  const byMethod = topBy(d.sales, (s) => s.paymentMethod as never, 6);

  return (
    <>
      <PageHeader
        title="Revenue"
        description="Financial performance across sales, accessories, insurance and other charges."
        action={<ExportButtons />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Today's Revenue" value={inr(totals.today)} icon={CalendarDays} tone="brand" />
        <KpiCard label="Weekly Revenue" value={inr(totals.week)} icon={CalendarRange} tone="blue" />
        <KpiCard label="Monthly Revenue" value={inr(totals.month)} icon={CalendarCheck2} tone="green" />
        <KpiCard label="Yearly Revenue" value={inr(totals.year)} icon={TrendingUp} tone="violet" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="card p-5 xl:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total Revenue</p>
          <p className="mt-1 text-2xl font-black text-ink-900">{inr(totals.total)}</p>
        </div>
        <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Bike Sales</p><p className="mt-1 text-xl font-black text-ink-900">{inr(split.bikeSales)}</p></div>
        <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Accessories</p><p className="mt-1 text-xl font-black text-ink-900">{inr(split.accessories)}</p></div>
        <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Insurance</p><p className="mt-1 text-xl font-black text-ink-900">{inr(split.insurance)}</p></div>
        <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Other</p><p className="mt-1 text-xl font-black text-ink-900">{inr(split.other)}</p></div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue by month" subtitle="Rolling 12 months" icon={TrendingUp} />
          <div className="p-4"><RevenueAreaChart data={revenueByMonth(d.sales)} /></div>
        </Card>
        <Card>
          <CardHeader title="Revenue by payment method" icon={Wallet} />
          <div className="p-4"><DonutChart data={byMethod} height={260} /></div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Revenue by bike model" icon={Bike} />
          <div className="p-4"><HBarChart data={byModel} /></div>
        </Card>
        <Card>
          <CardHeader title="Revenue by employee" icon={Users} />
          <div className="p-4"><HBarChart data={byEmployee} /></div>
        </Card>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-950 p-6 text-white">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold"><IndianRupee className="h-4 w-4 text-brand-400" /> AI Revenue Forecast</p>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            Projected revenue, demand prediction and best-selling model forecasting are part of the advanced dealership package.
          </p>
        </div>
        <LockedButton featureKey="ai-revenue" label="Unlock Forecasting" className="btn bg-white text-ink-900 hover:bg-white/90" />
      </div>
    </>
  );
}
