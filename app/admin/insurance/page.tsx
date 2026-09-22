'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { daysUntil } from '@/lib/utils';

export default function Page() {
  const d = useDealership();
  const rows = d.insurance;
  const expiring = rows.filter((r) => r.status === 'Expiring Soon').length;
  const expired = rows.filter((r) => r.status === 'Expired').length;

  return (
    <>
      <PageHeader
        title="Insurance"
        description="Policies issued against customer vehicles, with renewal and expiry tracking."
        action={<><ExportButtons /></>}
      />
      {expiring + expired > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span><strong>{expiring}</strong> policy(ies) expiring within 30 days and <strong>{expired}</strong> already expired. Contact these customers for renewal.</span>
        </div>
      ) : null}

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search insurance…"
        columns={[
          { key: 'customer', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.customerName}</span>, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'company', header: 'Insurance Company', render: (r) => r.company, search: (r) => r.company },
          { key: 'policy', header: 'Policy Number', render: (r) => <span className="font-mono text-xs">{r.policyNumber}</span>, search: (r) => r.policyNumber },
          { key: 'start', header: 'Policy Start', render: (r) => fmtDate(r.policyStart) },
          { key: 'expiry', header: 'Policy Expiry', render: (r) => <span className="font-semibold">{fmtDate(r.policyExpiry)}</span> },
          { key: 'days', header: 'Days Left', render: (r) => { const n = daysUntil(r.policyExpiry); return n < 0 ? <span className="text-rose-600">{Math.abs(n)}d overdue</span> : <span>{n}d</span>; } },
          { key: 'premium', header: 'Premium', render: (r) => inr(r.premium) },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]}
        filters={[
          { label: 'Status', options: ['Active', 'Expiring Soon', 'Expired'], match: (r, v) => r.status === v },
        ]}
      />
    </>
  );
}
