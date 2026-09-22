'use client';

import * as React from 'react';
import { CalendarCheck, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { InlineStatus } from '@/components/admin/InlineStatus';
import { KpiCard } from '@/components/admin/Kpi';
import { useDealership } from '@/components/admin/useDealership';
import { StatusChip } from '@/components/ui';
import { setTestDriveStatus, deleteTestDrive } from '@/lib/tamil-motors/testDrives';
import { fmtDate } from '@/lib/utils';
import type { TestDrive, TestDriveStatus } from '@/types';

const STATUSES: readonly TestDriveStatus[] = ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
const LOCATIONS = ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'];

export default function TestDrivesPage() {
  const d = useDealership();
  const [removing, setRemoving] = React.useState<string | null>(null);

  const rows = d.testDrives;
  const requested = rows.filter((t) => t.status === 'Requested').length;
  const confirmed = rows.filter((t) => t.status === 'Confirmed').length;
  const completed = rows.filter((t) => t.status === 'Completed').length;

  async function remove(row: TestDrive) {
    if (!window.confirm(`Delete the test drive request from ${row.name} for ${row.bikeName}?`)) return;
    setRemoving(row.id);
    try {
      await deleteTestDrive(row.id);
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete this request.');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Test Drives"
        description="Requests from the public website and the showroom floor. Change a status here and it is written to Firestore immediately."
        action={<ExportButtons />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Requests" value={String(rows.length)} icon={CalendarCheck} tone="ink" />
        <KpiCard label="Awaiting Confirmation" value={String(requested)} icon={CalendarCheck} tone="amber" />
        <KpiCard label="Confirmed" value={String(confirmed)} icon={CalendarCheck} tone="blue" />
        <KpiCard label="Completed" value={String(completed)} icon={CalendarCheck} tone="green" />
      </div>

      <DataModule<TestDrive>
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search customer, phone or bike…"
        columns={[
          { key: 'name', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.name}</span>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'time', header: 'Time', render: (r) => r.time },
          { key: 'employee', header: 'Sales Employee', render: (r) => r.employeeName ?? '—', search: (r) => r.employeeName ?? '' },
          { key: 'location', header: 'Location', render: (r) => r.location, search: (r) => r.location },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <InlineStatus<TestDriveStatus>
                ariaLabel={`Status for ${r.name}`}
                value={r.status}
                options={STATUSES}
                onSave={async (next) => { await setTestDriveStatus(r.id, next); }}
              />
            ),
          },
          { key: 'chip', header: 'Current', render: (r) => <StatusChip value={r.status} /> },
          { key: 'notes', header: 'Notes', render: (r) => <span className="text-ink-500">{r.notes || '—'}</span> },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <button
                onClick={(e) => { e.stopPropagation(); remove(r); }}
                disabled={removing === r.id}
                className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                aria-label={`Delete request from ${r.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        filters={[
          { label: 'Status', options: [...STATUSES], match: (r, v) => r.status === v },
          { label: 'Location', options: LOCATIONS, match: (r, v) => r.location === v },
        ]}
      />
    </>
  );
}
