'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Phone, Mail, MapPin, User, MessageSquare,
  CalendarCheck, ClipboardList, ShoppingCart, Wallet, FolderLock, Activity,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { useDealership } from '@/components/admin/useDealership';
import { Card, StatusChip, LoadingBlock, EmptyState } from '@/components/ui';
import { LockedButton } from '@/components/modals/LockedFeature';
import { inr, fmtDate, cn, initials } from '@/lib/utils';

const TABS = [
  'Overview', 'Personal Details', 'Enquiries', 'Test Drives', 'Bookings',
  'Purchases', 'Payments', 'Documents', 'Follow-ups', 'Activity',
] as const;

export default function CustomerProfilePage() {
  const params = useParams<{ id: string }>();
  const d = useDealership();
  const [tab, setTab] = React.useState<(typeof TABS)[number]>('Overview');

  if (d.loading) return (<><PageHeader title="Customer" description="Loading profile…" /><LoadingBlock /></>);

  const customer = d.customers.find((c) => c.id === params.id);
  if (!customer) {
    return (
      <>
        <PageHeader title="Customer not found" description="This customer record is not in the demo dataset." />
        <Card><EmptyState title="Not found" message="Go back to the customer list and pick another record." /></Card>
        <Link href="/admin/customers" className="btn-outline mt-4">Back to customers</Link>
      </>
    );
  }

  const sales = d.sales.filter((s) => s.customerId === customer.id);
  const bookings = d.bookings.filter((b) => b.customerId === customer.id);
  const testDrives = d.testDrives.filter((t) => t.email === customer.email || t.name === customer.name);
  const payments = d.payments.filter((p) => p.customerId === customer.id);
  const followups = d.followups.filter((f) => f.customerId === customer.id);
  const employee = d.employees.find((e) => e.id === customer.assignedEmployeeId);
  const interested = d.bikes.find((b) => b.id === customer.interestedBikeId);
  const purchased = d.bikes.find((b) => b.id === customer.purchasedBikeId);

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  );

  const simpleTable = (cols: string[], rows: React.ReactNode[][], empty: string) =>
    rows.length ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead className="bg-ink-50/80"><tr>{cols.map((c) => <th key={c} className="th">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-ink-50/70">{r.map((cell, j) => <td key={j} className="td">{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : <EmptyState title="Nothing here yet" message={empty} />;

  return (
    <>
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <div className="card mb-5 p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink-950 text-lg font-black text-white">
            {initials(customer.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-ink-900">{customer.name}</h1>
              <StatusChip value={customer.status} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{customer.city}</span>
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{employee?.name ?? 'Unassigned'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total purchase</p>
            <p className="text-2xl font-black text-ink-900">{inr(customer.totalPurchase ?? 0)}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('rounded-full px-4 py-2 text-sm font-semibold transition',
              tab === t ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:text-ink-900')}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        {tab === 'Overview' ? (
          <dl className="divide-y divide-ink-100">
            {row('Status', <StatusChip value={customer.status} />)}
            {row('Interested bike', interested ? `${interested.brand} ${interested.model}` : '—')}
            {row('Purchased bike', purchased ? `${purchased.brand} ${purchased.model}` : '—')}
            {row('Assigned employee', employee?.name ?? '—')}
            {row('Total purchase', inr(customer.totalPurchase ?? 0))}
            {row('Payment status', customer.paymentStatus ? <StatusChip value={customer.paymentStatus} /> : '—')}
            {row('Sales recorded', sales.length)}
            {row('Test drives', testDrives.length)}
            {row('Bookings', bookings.length)}
          </dl>
        ) : null}

        {tab === 'Personal Details' ? (
          <dl className="divide-y divide-ink-100">
            {row('Full name', customer.name)}
            {row('Phone', customer.phone)}
            {row('Email', customer.email)}
            {row('Address', customer.address || '—')}
            {row('City', customer.city)}
          </dl>
        ) : null}

        {tab === 'Enquiries' ? (
          <div className="p-1">
            {simpleTable(
              ['Bike', 'Status', 'Assigned to'],
              interested ? [[`${interested.brand} ${interested.model}`, <StatusChip key="s" value={customer.status} />, employee?.name ?? '—']] : [],
              'No enquiries recorded for this customer.',
            )}
          </div>
        ) : null}

        {tab === 'Test Drives' ? (
          <div className="p-1">
            {simpleTable(
              ['Bike', 'Date', 'Time', 'Location', 'Status'],
              testDrives.map((t) => [t.bikeName, fmtDate(t.date), t.time, t.location, <StatusChip key={t.id} value={t.status} />]),
              'This customer has not booked a test drive yet.',
            )}
          </div>
        ) : null}

        {tab === 'Bookings' ? (
          <div className="p-1">
            {simpleTable(
              ['Booking ID', 'Bike', 'Amount', 'Date', 'Delivery'],
              bookings.map((b) => [b.bookingCode, b.bikeName, inr(b.bookingAmount), fmtDate(b.bookingDate), <StatusChip key={b.id} value={b.deliveryStatus} />]),
              'No bookings recorded.',
            )}
          </div>
        ) : null}

        {tab === 'Purchases' ? (
          <div className="p-1">
            {simpleTable(
              ['Sale ID', 'Bike', 'Final amount', 'Date', 'Status'],
              sales.map((s) => [s.saleCode, s.bikeName, inr(s.finalAmount), fmtDate(s.saleDate), <StatusChip key={s.id} value={s.saleStatus} />]),
              'No purchases recorded.',
            )}
          </div>
        ) : null}

        {tab === 'Payments' ? (
          <div className="p-1">
            {simpleTable(
              ['Payment ID', 'Amount', 'Method', 'Date', 'Status'],
              payments.map((p) => [p.paymentCode, inr(p.amount), p.method, fmtDate(p.date), <StatusChip key={p.id} value={p.status} />]),
              'No payments recorded.',
            )}
          </div>
        ) : null}

        {tab === 'Follow-ups' ? (
          <div className="p-1">
            {simpleTable(
              ['Due', 'Priority', 'Note', 'Owner', 'Done'],
              followups.map((f) => [fmtDate(f.dueDate), <StatusChip key={f.id} value={f.priority} />, f.note, f.employeeName, f.done ? 'Yes' : 'No']),
              'No follow-ups scheduled.',
            )}
          </div>
        ) : null}

        {tab === 'Documents' ? (
          <div className="p-8 text-center">
            <FolderLock className="mx-auto h-8 w-8 text-ink-300" />
            <h3 className="mt-4 text-base font-bold text-ink-900">Automated Document Management</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              RC, insurance, invoice, loan documents, KYC and delivery paperwork filed automatically against
              each customer is part of the complete system.
            </p>
            <div className="mt-5 flex justify-center"><LockedButton featureKey="documents" label="Unlock Documents" /></div>
          </div>
        ) : null}

        {tab === 'Activity' ? (
          <ul className="divide-y divide-ink-100">
            {[
              ...sales.map((s) => ({ icon: ShoppingCart, date: s.saleDate, text: `Sale ${s.saleCode} — ${s.bikeName} (${inr(s.finalAmount)})` })),
              ...bookings.map((b) => ({ icon: ClipboardList, date: b.bookingDate, text: `Booking ${b.bookingCode} — ${b.bikeName}` })),
              ...testDrives.map((t) => ({ icon: CalendarCheck, date: t.date, text: `Test drive — ${t.bikeName} (${t.status})` })),
              ...payments.map((p) => ({ icon: Wallet, date: p.date, text: `Payment ${p.paymentCode} — ${inr(p.amount)} via ${p.method}` })),
              ...followups.map((f) => ({ icon: MessageSquare, date: f.dueDate, text: `Follow-up — ${f.note}` })),
            ]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 20)
              .map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-800">{a.text}</p>
                    <p className="text-xs text-ink-400">{fmtDate(a.date)}</p>
                  </div>
                </li>
              ))}
            {!sales.length && !bookings.length && !testDrives.length ? (
              <li><EmptyState title="No activity yet" message="Activity appears here as the customer moves through the pipeline." /></li>
            ) : null}
          </ul>
        ) : null}
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink-950 p-6 text-white">
        <div className="flex items-start gap-3">
          <Activity className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
          <div>
            <p className="text-sm font-bold">AI Customer Follow-Up</p>
            <p className="mt-1 max-w-xl text-sm text-white/60">
              Automatically rank this customer against everyone else in the pipeline by likelihood to convert.
            </p>
          </div>
        </div>
        <LockedButton featureKey="ai-followup" label="Unlock Follow-Up AI" className="btn bg-white text-ink-900 hover:bg-white/90" />
      </div>
    </>
  );
}
