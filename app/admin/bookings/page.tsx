'use client';

import * as React from 'react';
import { ClipboardList, Trash2, PackageCheck, Truck, IndianRupee } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { InlineStatus } from '@/components/admin/InlineStatus';
import { KpiCard } from '@/components/admin/Kpi';
import { useDealership } from '@/components/admin/useDealership';
import { StatusChip } from '@/components/ui';
import { setBookingStatus, setBookingPaymentStatus, deleteBooking } from '@/lib/tamil-motors/bookings';
import { inr, fmtDate } from '@/lib/utils';
import type { Booking, BookingStatus, PaymentStatus } from '@/types';

const DELIVERY: readonly BookingStatus[] = ['Booked', 'Payment Pending', 'Ready for Delivery', 'Delivered', 'Cancelled'];
const PAYMENT: readonly PaymentStatus[] = ['paid', 'partial', 'pending'];

export default function BookingsPage() {
  const d = useDealership();
  const [removing, setRemoving] = React.useState<string | null>(null);

  const rows = d.bookings;
  const active = rows.filter((b) => b.deliveryStatus !== 'Delivered' && b.deliveryStatus !== 'Cancelled');
  const ready = rows.filter((b) => b.deliveryStatus === 'Ready for Delivery').length;
  const advance = rows.reduce((t, b) => t + b.bookingAmount, 0);

  async function remove(row: Booking) {
    if (!window.confirm(`Delete booking ${row.bookingCode} for ${row.customerName}?`)) return;
    setRemoving(row.id);
    try {
      await deleteBooking(row.id);
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete this booking.');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Advance bookings with payment position and delivery status. Status changes save to Firestore immediately."
        action={<ExportButtons />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Bookings" value={String(rows.length)} icon={ClipboardList} tone="ink" />
        <KpiCard label="Active" value={String(active.length)} icon={PackageCheck} tone="blue" />
        <KpiCard label="Ready for Delivery" value={String(ready)} icon={Truck} tone="green" />
        <KpiCard label="Advance Collected" value={inr(advance)} icon={IndianRupee} tone="brand" />
      </div>

      <DataModule<Booking>
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search booking ID, customer or bike…"
        columns={[
          { key: 'code', header: 'Booking ID', render: (r) => <span className="font-semibold text-ink-900">{r.bookingCode}</span>, search: (r) => r.bookingCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'amount', header: 'Booking Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.bookingAmount)}</span> },
          { key: 'date', header: 'Booking Date', render: (r) => fmtDate(r.bookingDate) },
          { key: 'employee', header: 'Sales Executive', render: (r) => r.employeeName, search: (r) => r.employeeName },
          {
            key: 'pay',
            header: 'Payment Status',
            render: (r) => (
              <InlineStatus<PaymentStatus>
                ariaLabel={`Payment status for ${r.bookingCode}`}
                value={r.paymentStatus}
                options={PAYMENT}
                onSave={async (next) => { await setBookingPaymentStatus(r.id, next); }}
              />
            ),
          },
          {
            key: 'delivery',
            header: 'Delivery Status',
            render: (r) => (
              <InlineStatus<BookingStatus>
                ariaLabel={`Delivery status for ${r.bookingCode}`}
                value={r.deliveryStatus}
                options={DELIVERY}
                onSave={async (next) => { await setBookingStatus(r.id, next); }}
              />
            ),
          },
          { key: 'chip', header: 'Current', render: (r) => <StatusChip value={r.deliveryStatus} /> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <button
                onClick={(e) => { e.stopPropagation(); remove(r); }}
                disabled={removing === r.id}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                aria-label={`Delete booking ${r.bookingCode}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        filters={[
          { label: 'Delivery', options: [...DELIVERY], match: (r, v) => r.deliveryStatus === v },
          { label: 'Payment', options: [...PAYMENT], match: (r, v) => r.paymentStatus === v },
        ]}
      />
    </>
  );
}
