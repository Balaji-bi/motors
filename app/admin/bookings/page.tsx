'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.bookings;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Confirmed bookings with advance amounts, payment position and delivery status."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search bookings…"
        columns={[
          { key: 'code', header: 'Booking ID', render: (r) => <span className="font-semibold text-ink-900">{r.bookingCode}</span>, search: (r) => r.bookingCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'amount', header: 'Booking Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.bookingAmount)}</span> },
          { key: 'date', header: 'Booking Date', render: (r) => fmtDate(r.bookingDate) },
          { key: 'employee', header: 'Sales Executive', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'pay', header: 'Payment Status', render: (r) => <StatusChip value={r.paymentStatus} /> },
          { key: 'delivery', header: 'Delivery Status', render: (r) => <StatusChip value={r.deliveryStatus} /> },
        ]}
        filters={[
          { label: 'Delivery', options: ['Booked', 'Payment Pending', 'Ready for Delivery', 'Delivered', 'Cancelled'], match: (r, v) => r.deliveryStatus === v },
          { label: 'Payment', options: ['paid', 'partial', 'pending'], match: (r, v) => r.paymentStatus === v },
        ]}
      />
    </>
  );
}
