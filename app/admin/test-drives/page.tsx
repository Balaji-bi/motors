'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.testDrives;

  return (
    <>
      <PageHeader
        title="Test Drives"
        description="Requests from the public website and the showroom floor, with their current status."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search test drives…"
        columns={[
          { key: 'name', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.name}</span>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'time', header: 'Time', render: (r) => r.time },
          { key: 'employee', header: 'Sales Employee', render: (r) => r.employeeName ?? '—', search: (r) => r.employeeName ?? '' },
          { key: 'location', header: 'Location', render: (r) => r.location, search: (r) => r.location },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
          { key: 'notes', header: 'Notes', render: (r) => <span className="text-ink-500">{r.notes || '—'}</span> },
        ]}
        filters={[
          { label: 'Status', options: ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], match: (r, v) => r.status === v },
          { label: 'Location', options: ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'], match: (r, v) => r.location === v },
        ]}
      />
    </>
  );
}
