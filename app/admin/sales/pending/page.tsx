'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.sales;
  const pending = rows.filter((s) => ['Enquiry', 'Quotation', 'Booking', 'Payment Pending'].includes(s.saleStatus));

  return (
    <>
      <PageHeader
        title="Pending Sales"
        description="Sales still awaiting payment, confirmation or delivery. These need follow-up from the sales team."
        action={<><Link href="/admin/sales" className="btn-outline">All sales</Link><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={pending}
        searchPlaceholder="Search pending sales…"
        columns={[
          { key: 'code', header: 'Sale ID', render: (r) => <span className="font-semibold text-ink-900">{r.saleCode}</span>, search: (r) => r.saleCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'employee', header: 'Sales Employee', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'date', header: 'Sale Date', render: (r) => fmtDate(r.saleDate) },
          { key: 'price', header: 'Bike Price', render: (r) => inr(r.basePrice) },
          { key: 'discount', header: 'Discount', render: (r) => r.discount ? <span className="text-rose-600">-{inr(r.discount)}</span> : '—' },
          { key: 'finance', header: 'Finance', render: (r) => r.financeCharges ? inr(r.financeCharges) : '—' },
          { key: 'insurance', header: 'Insurance', render: (r) => inr(r.insuranceAmount) },
          { key: 'final', header: 'Final Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.finalAmount)}</span> },
          { key: 'pay', header: 'Payment', render: (r) => <StatusChip value={r.paymentStatus} /> },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.saleStatus} /> },
        ]}
        filters={[
          {
            label: 'Status',
            options: ['Enquiry', 'Quotation', 'Booking', 'Payment Pending', 'Confirmed', 'Delivered', 'Cancelled'],
            match: (r, v) => r.saleStatus === v,
          },
          {
            label: 'Payment',
            options: ['paid', 'partial', 'pending'],
            match: (r, v) => r.paymentStatus === v,
          },
        ]}
      />
    </>
  );
}
