'use client';

import Link from 'next/link';
import {
  Database, Building2, Users2, Bell, ShieldCheck, Palette,
  ArrowRight, Store, FolderLock,
} from 'lucide-react';
import { PageHeader, useSession } from '@/components/admin/AdminShell';
import { Card, CardHeader } from '@/components/ui';
import { LockedButton, PUBLIQWEBB } from '@/components/modals/LockedFeature';

export default function SettingsPage() {
  const session = useSession();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Dealership configuration, demo data and platform information."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Demo data" subtitle="Populate Firestore with the Tamil Motors dataset" icon={Database} />
          <div className="p-6">
            <p className="text-sm text-ink-600">
              Seed 25 bike models, 15 employees, 30 customers, 60 sales and the full supporting dataset into
              the <code className="font-mono text-xs">tamilMotors_*</code> collections.
            </p>
            <Link href="/admin/settings/demo-data" className="btn-primary mt-5">
              Open demo data initializer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader title="Signed in as" subtitle="Your current session" icon={ShieldCheck} />
          <dl className="divide-y divide-ink-100">
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="text-sm text-ink-500">Email</dt>
              <dd className="truncate text-sm font-semibold text-ink-900">{session?.user.email ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="text-sm text-ink-500">Role</dt>
              <dd className="text-sm font-semibold capitalize text-ink-900">{session?.role ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <dt className="text-sm text-ink-500">Access</dt>
              <dd className="text-sm font-semibold text-ink-900">
                {session?.role === 'admin' ? 'Full platform access' : 'Module-restricted access'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Dealership profile" subtitle="Business details shown on the public site" icon={Store} />
          <dl className="divide-y divide-ink-100">
            {[
              ['Business name', 'Tamil Motors'],
              ['Business type', 'Two-wheeler dealership'],
              ['Head office', 'Gandhipuram, Coimbatore'],
              ['Phone', '+91 96003 76168'],
              ['Technology partner', PUBLIQWEBB.name],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <dt className="text-sm text-ink-500">{k}</dt>
                <dd className="text-right text-sm font-semibold text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <CardHeader title="Advanced configuration" subtitle="Available in the complete system" icon={Palette} />
          <ul className="divide-y divide-ink-100">
            {[
              { icon: Building2, label: 'Branch management', key: 'multi-branch' as const },
              { icon: Users2, label: 'Role & permission editor', key: 'generic' as const },
              { icon: Bell, label: 'WhatsApp & SMS templates', key: 'whatsapp' as const },
              { icon: FolderLock, label: 'Document templates & KYC vault', key: 'documents' as const },
            ].map(({ icon: Icon, label, key }) => (
              <li key={label} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="flex items-center gap-3 text-sm text-ink-700">
                  <Icon className="h-4 w-4 text-ink-400" /> {label}
                </span>
                <LockedButton featureKey={key} label="Unlock" className="btn-ghost px-3 py-1.5 text-xs" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
