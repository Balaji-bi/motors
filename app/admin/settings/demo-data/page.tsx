'use client';

import * as React from 'react';
import Link from 'next/link';
import { Database, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { Card, CardHeader } from '@/components/ui';
import { TM, batchSeed, hasAnyDocs, type TMCollection } from '@/lib/firebase/firestore';
import { buildDemoDataset } from '@/lib/tamil-motors/demo-data';

type Step = { key: TMCollection; label: string; rows: readonly object[] };

export default function DemoDataPage() {
  const [state, setState] = React.useState<'idle' | 'checking' | 'running' | 'done' | 'exists' | 'error'>('idle');
  const [log, setLog] = React.useState<string[]>([]);
  const [error, setError] = React.useState('');

  function buildSteps(): Step[] {
    const d = buildDemoDataset();
    return [
      { key: TM.bikes, label: 'Bike models', rows: d.bikes },
      { key: TM.employees, label: 'Employees', rows: d.employees },
      { key: TM.customers, label: 'Customers', rows: d.customers },
      { key: TM.inventory, label: 'Inventory units', rows: d.inventory },
      { key: TM.sales, label: 'Sales', rows: d.sales },
      { key: TM.testDrives, label: 'Test drives', rows: d.testDrives },
      { key: TM.bookings, label: 'Bookings', rows: d.bookings },
      { key: TM.payments, label: 'Payments', rows: d.payments },
      { key: TM.finance, label: 'Finance applications', rows: d.finance },
      { key: TM.insurance, label: 'Insurance records', rows: d.insurance },
      { key: TM.expenses, label: 'Expenses', rows: d.expenses },
      { key: TM.notifications, label: 'Notifications', rows: d.notifications },
      { key: TM.followups, label: 'Follow-ups', rows: d.followups },
    ];
  }

  async function initialize() {
    setState('checking');
    setLog([]);
    setError('');
    try {
      // Guard: never duplicate records if the demo set is already present.
      const already = await hasAnyDocs(TM.sales);
      if (already) {
        setState('exists');
        return;
      }

      setState('running');
      for (const step of buildSteps()) {
        await batchSeed(step.key, step.rows);
        setLog((l) => [...l, `${step.label}: ${step.rows.length} records written to ${step.key}`]);
      }
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seeding failed.');
      setState('error');
    }
  }

  const busy = state === 'checking' || state === 'running';

  return (
    <>
      <Link href="/admin/settings" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> Back to settings
      </Link>

      <PageHeader
        title="Demo Data"
        description="Populate the Tamil Motors collections in Firestore with a realistic fictional dataset."
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="Initialize Tamil Motors demo data" subtitle="Writes only to tamilMotors_* collections" icon={Database} />
          <div className="p-6">
            <p className="text-sm leading-relaxed text-ink-600">
              This creates 25 bike models, 15 employees, 30 customers, 50 inventory units, 60 sales,
              40 test drives, 30 bookings, 60 payments, 20 finance applications, 30 insurance records,
              40 expenses plus notifications and follow-ups.
            </p>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Only <code className="font-mono text-xs">tamilMotors_*</code> collections are written.
                The existing Driving School demo data in this Firebase project is never read, renamed or modified.
              </span>
            </div>

            {state === 'exists' ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Demo data already initialized. No records were duplicated.
              </p>
            ) : null}

            {state === 'done' ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Demo data initialized. Every admin module is now reading live Firestore data.
              </p>
            ) : null}

            {state === 'error' ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error || 'Seeding failed. Check that Firestore rules allow writes for this account.'}
              </p>
            ) : null}

            <button onClick={initialize} disabled={busy} className="btn-primary mt-6">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> {state === 'checking' ? 'Checking…' : 'Seeding…'}</> : 'Initialize Tamil Motors Demo Data'}
            </button>

            {log.length ? (
              <div className="mt-6 max-h-64 overflow-y-auto rounded-xl bg-ink-950 p-4 font-mono text-xs leading-relaxed text-emerald-300">
                {log.map((l) => <p key={l}>✓ {l}</p>)}
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader title="Collections used" subtitle="Namespaced for this dealership" icon={Database} />
          <ul className="divide-y divide-ink-100">
            {Object.values(TM).map((c) => (
              <li key={c} className="px-5 py-2.5 font-mono text-xs text-ink-600">{c}</li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
