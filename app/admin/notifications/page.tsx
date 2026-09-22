'use client';

import * as React from 'react';
import {
  Bell, ShoppingCart, UserPlus, CalendarCheck, PackageX,
  Wallet, BadgeIndianRupee, ShieldAlert, Target, Check,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { useDealership } from '@/components/admin/useDealership';
import { Card, LoadingBlock, EmptyState, Select } from '@/components/ui';
import { LockedButton } from '@/components/modals/LockedFeature';
import { markNotificationRead } from '@/lib/tamil-motors/payments';
import { fmtDate, cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'New Sale': ShoppingCart,
  'New Customer': UserPlus,
  'Test Drive Request': CalendarCheck,
  'Low Stock': PackageX,
  'Pending Payment': Wallet,
  'Finance Approval': BadgeIndianRupee,
  'Insurance Expiry': ShieldAlert,
  'Employee Target Alert': Target,
};

const TONES: Record<string, string> = {
  'New Sale': 'bg-emerald-50 text-emerald-600',
  'New Customer': 'bg-sky-50 text-sky-600',
  'Test Drive Request': 'bg-violet-50 text-violet-600',
  'Low Stock': 'bg-amber-50 text-amber-600',
  'Pending Payment': 'bg-amber-50 text-amber-600',
  'Finance Approval': 'bg-emerald-50 text-emerald-600',
  'Insurance Expiry': 'bg-rose-50 text-rose-600',
  'Employee Target Alert': 'bg-brand-50 text-brand-600',
};

export default function NotificationsPage() {
  const d = useDealership();
  const [filter, setFilter] = React.useState('All');
  const [readLocal, setReadLocal] = React.useState<Record<string, boolean>>({});

  const types = Array.from(new Set(d.notifications.map((n) => n.type)));
  const rows = [...d.notifications]
    .filter((n) => filter === 'All' || n.type === filter)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const unread = d.notifications.filter((n) => !n.read && !readLocal[n.id]).length;

  async function markRead(id: string) {
    setReadLocal((s) => ({ ...s, [id]: true }));
    try { await markNotificationRead(id); } catch { /* demo data may be local-only */ }
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Alerts raised by the dealership system across sales, stock, payments and customers."
        badge={unread ? <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">{unread} unread</span> : undefined}
        action={
          <>
            <Select
              ariaLabel="Filter notifications"
              className="w-52"
              value={filter}
              onChange={setFilter}
              options={['All', ...types].map((t) => ({ value: t, label: t === 'All' ? 'All types' : t }))}
            />
            <LockedButton featureKey="whatsapp" label="WhatsApp Alerts" className="btn-outline" />
          </>
        }
      />

      {d.loading ? <LoadingBlock /> : rows.length ? (
        <Card>
          <ul className="divide-y divide-ink-100">
            {rows.map((n) => {
              const Icon = ICONS[n.type] ?? Bell;
              const isRead = n.read || readLocal[n.id];
              return (
                <li key={n.id} className={cn('flex items-start gap-4 px-5 py-4 transition', !isRead && 'bg-brand-50/30')}>
                  <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', TONES[n.type] ?? 'bg-ink-100 text-ink-600')}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink-900">{n.title}</p>
                      <span className="chip bg-ink-100 text-ink-500">{n.type}</span>
                      {!isRead ? <span className="h-2 w-2 rounded-full bg-brand-600" /> : null}
                    </div>
                    <p className="mt-1 text-sm text-ink-600">{n.message}</p>
                    <p className="mt-1.5 text-xs text-ink-400">{fmtDate(n.date)}</p>
                  </div>
                  {!isRead ? (
                    <button onClick={() => markRead(n.id)} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
                      <Check className="h-3.5 w-3.5" /> Mark read
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <Card><EmptyState title="No notifications" message="System alerts will appear here as activity happens across the dealership." /></Card>
      )}
    </>
  );
}
