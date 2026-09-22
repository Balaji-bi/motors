'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.customers;
  const bikeName = (id?: string) => d.bikes.find((b) => b.id === id);
  const empName = (id?: string) => d.employees.find((e) => e.id === id)?.name ?? '—';

  return (
    <>
      <PageHeader
        title="Customers"
        description="Every lead, enquiry and buyer in the Tamil Motors pipeline."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search customers…"
        columns={[
          { key: 'id', header: 'Customer ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.id.slice(0, 10)}</span>, search: (r) => r.id },
          { key: 'name', header: 'Name', render: (r) => <Link href={`/admin/customers/${r.id}`} className="font-semibold text-ink-900 hover:text-brand-600">{r.name}</Link>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'email', header: 'Email', render: (r) => <span className="text-ink-500">{r.email}</span>, search: (r) => r.email },
          { key: 'interested', header: 'Interested Bike', render: (r) => { const b = bikeName(r.interestedBikeId); return b ? `${b.brand} ${b.model}` : '—'; } },
          { key: 'purchased', header: 'Purchased Bike', render: (r) => { const b = bikeName(r.purchasedBikeId); return b ? `${b.brand} ${b.model}` : '—'; } },
          { key: 'employee', header: 'Sales Employee', render: (r) => empName(r.assignedEmployeeId) },
          { key: 'total', header: 'Total Purchase', render: (r) => r.totalPurchase ? <span className="font-bold text-ink-900">{inr(r.totalPurchase)}</span> : '—' },
          { key: 'pay', header: 'Payment', render: (r) => r.paymentStatus ? <StatusChip value={r.paymentStatus} /> : '—' },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]}
        filters={[
          { label: 'Status', options: ['lead', 'interested', 'booked', 'customer'], match: (r, v) => r.status === v },
          { label: 'City', options: ['Coimbatore', 'Tiruppur', 'Erode', 'Pollachi', 'Mettupalayam', 'Sulur', 'Karamadai'], match: (r, v) => r.city === v },
        ]}
      />
    </>
  );
}
