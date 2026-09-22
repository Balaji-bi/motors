'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';
import { ProgressBar } from '@/components/admin/Kpi';
import { pct } from '@/lib/utils';

export default function Page() {
  const d = useDealership();
  const rows = d.employees;

  return (
    <>
      <PageHeader
        title="Employees"
        description="Sales executives, managers and support staff, with targets and achievement."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search employees…"
        columns={[
          { key: 'id', header: 'Employee ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.id}</span>, search: (r) => r.id },
          { key: 'name', header: 'Name', render: (r) => <Link href={`/admin/employees/${r.id}`} className="font-semibold text-ink-900 hover:text-brand-600">{r.name}</Link>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'role', header: 'Role', render: (r) => r.role, search: (r) => r.role },
          { key: 'joined', header: 'Joining Date', render: (r) => fmtDate(r.joiningDate) },
          { key: 'count', header: 'Sales Count', render: (r) => <span className="font-bold text-ink-900">{r.salesCount}</span> },
          { key: 'revenue', header: 'Revenue Generated', render: (r) => inr(r.revenueGenerated) },
          { key: 'target', header: 'Target', render: (r) => inr(r.monthlyTarget) },
          { key: 'achievement', header: 'Achievement', render: (r) => <div className="w-32"><ProgressBar value={r.monthlySales} max={r.monthlyTarget} label={`${pct(r.monthlySales, r.monthlyTarget)}%`} /></div> },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]}
        filters={[
          { label: 'Role', options: ['Sales Executive', 'Sales Manager', 'Accountant', 'Service Advisor', 'Admin'], match: (r, v) => r.role === v },
          { label: 'Status', options: ['active', 'inactive'], match: (r, v) => r.status === v },
        ]}
      />
    </>
  );
}
