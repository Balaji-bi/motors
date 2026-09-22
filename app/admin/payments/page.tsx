'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.payments;

  return (
    <>
      <PageHeader
        title="Payments"
        description="Every payment collected against a sale, by method and status."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search payments…"
        columns={[
          { key: 'code', header: 'Payment ID', render: (r) => <span className="font-semibold text-ink-900">{r.paymentCode}</span>, search: (r) => r.paymentCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'sale', header: 'Sale ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.saleId}</span>, search: (r) => r.saleId },
          { key: 'amount', header: 'Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.amount)}</span> },
          { key: 'method', header: 'Method', render: (r) => r.method, search: (r) => r.method },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]}
        filters={[
          { label: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance'], match: (r, v) => r.method === v },
          { label: 'Status', options: ['Success', 'Pending', 'Failed'], match: (r, v) => r.status === v },
        ]}
      />
    </>
  );
}
