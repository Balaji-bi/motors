'use client';

import Link from 'next/link';
import {
  IndianRupee, TrendingUp, Wallet, CalendarClock, Users, UserPlus,
  MessageSquare, CalendarCheck, Bike, PackageCheck, PackageX, PackageSearch,
  AlertTriangle, UserCog, Trophy, ArrowRight, Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { KpiCard, MiniStat, ProgressBar } from '@/components/admin/Kpi';
import { useDealership } from '@/components/admin/useDealership';
import { RevenueAreaChart, HBarChart, DonutChart } from '@/components/charts/Charts';
import { Card, CardHeader, StatusChip, LoadingBlock, TableShell, Thead, Tbody, Tr, Td } from '@/components/ui';
import { LockedButton } from '@/components/modals/LockedFeature';
import { revenueTotals, revenueByMonth, topBy, employeeLeaderboard, revenueSplit } from '@/lib/tamil-motors/revenue';
import { inr, fmtDate, pct } from '@/lib/utils';

export default function AdminDashboardPage() {
  const d = useDealership();

  if (d.loading) {
    return (
      <>
        <PageHeader title="Dashboard" description="Loading your dealership overview…" />
        <LoadingBlock label="Loading dealership data…" />
      </>
    );
  }

  const totals = revenueTotals(d.sales);
  const split = revenueSplit(d.sales);
  const monthly = revenueByMonth(d.sales);
  const byModel = topBy(d.sales, (s) => s.bikeName as never, 6);

  const newCustomers = d.customers.filter((c) => c.status === 'lead' || c.status === 'interested').length;
  const pendingEnquiries = d.customers.filter((c) => c.status === 'lead').length;
  const openTestDrives = d.testDrives.filter((t) => t.status === 'Requested' || t.status === 'Confirmed').length;

  const available = d.inventory.filter((i) => i.stockStatus === 'Available').length;
  const sold = d.inventory.filter((i) => i.stockStatus === 'Sold').length;
  const reserved = d.inventory.filter((i) => i.stockStatus === 'Reserved').length;
  const lowStock = d.bikes.filter((b) => b.status !== 'available').length;

  const activeSales = d.employees.filter((e) => e.status === 'active' && e.role.includes('Sales')).length;
  const leaders = employeeLeaderboard(d.employees, 5);
  const recentSales = [...d.sales].sort((a, b) => b.saleDate.localeCompare(a.saleDate)).slice(0, 6);

  return (
    <>
      {d.offline.length ? (
        <div className="mb-5 flex flex-wrap items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          <span>
            <strong>Showing local demo data for {d.offline.length} collection(s).</strong>{' '}
            Firestore returned nothing or refused the read for: {d.offline.join(', ')}. Seed the
            database from <Link href="/admin/settings/demo-data" className="underline">Settings → Demo Data</Link>,
            or check the security rules.
          </span>
        </div>
      ) : null}

      <PageHeader
        title="Dashboard"
        description="Live overview of sales, customers, inventory and team performance across Tamil Motors."
        badge={<span className="chip bg-ink-100 text-ink-600">Demo data</span>}
        action={
          <>
            <Link href="/admin/sales/new" className="btn-primary">New Sale</Link>
            <Link href="/admin/reports" className="btn-outline">Reports</Link>
          </>
        }
      />

      {/* Top KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Sales" value={inr(totals.total)} icon={IndianRupee} tone="brand" delta={12.4}
          hint={`${d.sales.filter((s) => s.saleStatus !== 'Cancelled').length} transactions`} />
        <KpiCard label="Today's Sales" value={inr(totals.today)} icon={TrendingUp} tone="green" delta={4.8} hint="Recorded today" />
        <KpiCard label="Monthly Revenue" value={inr(totals.month)} icon={Wallet} tone="blue" delta={8.1} hint="Last 30 days" />
        <KpiCard label="Pending Payments" value={inr(totals.pending)} icon={CalendarClock} tone="amber" delta={-3.2} hint="Awaiting collection" />
      </div>

      {/* Revenue + model split */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue by month" subtitle="Rolling 12 months of confirmed sales" icon={TrendingUp}
            action={<Link href="/admin/revenue" className="btn-ghost text-xs">Open revenue <ArrowRight className="h-3.5 w-3.5" /></Link>} />
          <div className="p-4"><RevenueAreaChart data={monthly} /></div>
        </Card>

        <Card>
          <CardHeader title="Revenue split" subtitle="Where the money comes from" icon={IndianRupee} />
          <div className="p-4">
            <DonutChart height={260} data={[
              { name: 'Bike sales', value: split.bikeSales },
              { name: 'Accessories', value: split.accessories },
              { name: 'Insurance', value: split.insurance },
              { name: 'Other charges', value: split.other },
            ]} />
          </div>
        </Card>
      </div>

      {/* Customers / Inventory / Employees */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Customers" subtitle="Pipeline health" icon={Users}
            action={<Link href="/admin/customers" className="btn-ghost text-xs">View</Link>} />
          <div className="grid grid-cols-2 gap-3 p-5">
            <MiniStat label="Total customers" value={d.customers.length} />
            <MiniStat label="New / leads" value={newCustomers} />
            <MiniStat label="Pending enquiries" value={pendingEnquiries} />
            <MiniStat label="Test drives open" value={openTestDrives} />
          </div>
          <div className="flex items-center gap-2 border-t border-ink-100 px-5 py-3 text-xs text-ink-500">
            <MessageSquare className="h-3.5 w-3.5" /> {d.followups.filter((f) => !f.done).length} follow-ups outstanding
          </div>
        </Card>

        <Card>
          <CardHeader title="Inventory" subtitle="Physical stock position" icon={Bike}
            action={<Link href="/admin/inventory" className="btn-ghost text-xs">View</Link>} />
          <div className="grid grid-cols-2 gap-3 p-5">
            <MiniStat label="Total units" value={d.inventory.length} />
            <MiniStat label="Available" value={available} />
            <MiniStat label="Sold" value={sold} />
            <MiniStat label="Reserved" value={reserved} />
          </div>
          <div className="flex items-center gap-2 border-t border-ink-100 px-5 py-3 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" /> {lowStock} model(s) low or out of stock
          </div>
        </Card>

        <Card>
          <CardHeader title="Employees" subtitle="Team & targets" icon={UserCog}
            action={<Link href="/admin/employees" className="btn-ghost text-xs">View</Link>} />
          <div className="grid grid-cols-2 gap-3 p-5">
            <MiniStat label="Total employees" value={d.employees.length} />
            <MiniStat label="Active sales staff" value={activeSales} />
          </div>
          <div className="space-y-3 border-t border-ink-100 px-5 py-4">
            {leaders.slice(0, 3).map((e) => (
              <ProgressBar key={e.id} label={e.name} value={e.monthlySales} max={e.monthlyTarget} />
            ))}
          </div>
        </Card>
      </div>

      {/* Recent sales + leaderboard */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader title="Recent sales" subtitle="Latest transactions across all branches" icon={IndianRupee}
              action={<Link href="/admin/sales" className="btn-ghost text-xs">All sales <ArrowRight className="h-3.5 w-3.5" /></Link>} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <Thead cols={['Sale ID', 'Customer', 'Bike', 'Employee', 'Date', 'Amount', 'Status']} />
                <Tbody>
                  {recentSales.map((s) => (
                    <Tr key={s.id}>
                      <Td className="font-semibold text-ink-900">{s.saleCode}</Td>
                      <Td>{s.customerName}</Td>
                      <Td>{s.bikeName}</Td>
                      <Td>{s.employeeName}</Td>
                      <Td>{fmtDate(s.saleDate)}</Td>
                      <Td className="font-bold text-ink-900">{inr(s.finalAmount)}</Td>
                      <Td><StatusChip value={s.saleStatus} /></Td>
                    </Tr>
                  ))}
                </Tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Top sales employees" subtitle="By monthly achievement" icon={Trophy} />
          <ul className="divide-y divide-ink-100">
            {leaders.map((e, i) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-950 text-xs font-black text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/employees/${e.id}`} className="block truncate text-sm font-bold text-ink-900 hover:text-brand-600">
                    {e.name}
                  </Link>
                  <p className="truncate text-xs text-ink-500">{e.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-ink-900">{inr(e.monthlySales, true)}</p>
                  <p className="text-[11px] text-ink-400">{pct(e.monthlySales, e.monthlyTarget)}% of target</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Model revenue + upsell */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue by bike model" subtitle="Top performing models this period" icon={PackageSearch} />
          <div className="p-4"><HBarChart data={byModel} /></div>
        </Card>

        <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="relative">
            <Sparkles className="h-7 w-7 text-brand-400" />
            <h3 className="mt-4 text-lg font-black">AI Sales Intelligence</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Predict which enquiries will convert, spot high-demand models early and get an automated
              weekly business summary for Tamil Motors.
            </p>
            <div className="mt-5 space-y-2">
              {['Conversion probability per customer', 'Demand forecast per model', 'Automated business insights'].map((f) => (
                <p key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> <span className="blur-[0.4px]">{f}</span>
                </p>
              ))}
            </div>
            <div className="mt-6"><LockedButton featureKey="ai-sales" label="Unlock Feature" className="btn w-full bg-white text-ink-900 hover:bg-white/90" /></div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/test-drives', label: 'Test Drives', value: openTestDrives, icon: CalendarCheck },
          { href: '/admin/bookings', label: 'Active Bookings', value: d.bookings.filter((b) => b.deliveryStatus !== 'Delivered' && b.deliveryStatus !== 'Cancelled').length, icon: PackageCheck },
          { href: '/admin/finance', label: 'Finance In Review', value: d.finance.filter((f) => ['Applied', 'Under Review', 'Documents Pending'].includes(f.status)).length, icon: UserPlus },
          { href: '/admin/insurance', label: 'Policies Expiring', value: d.insurance.filter((i) => i.status === 'Expiring Soon').length, icon: PackageX },
        ].map(({ href, label, value, icon: Icon }) => (
          <Link key={href} href={href} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-100 text-ink-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-black text-ink-900">{value}</p>
              <p className="text-xs font-semibold text-ink-500">{label}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 text-ink-300" />
          </Link>
        ))}
      </div>
    </>
  );
}
