'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import {
  Bike, MessageSquare, CalendarCheck, ClipboardList, Wallet,
  FolderLock, Wrench, LogOut, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { watchAuth, logOut } from '@/lib/firebase/auth';
import { useDealership } from '@/components/admin/useDealership';
import { Card, CardHeader, StatusChip, LoadingBlock, EmptyState, Spinner } from '@/components/ui';
import { LockedButton } from '@/components/modals/LockedFeature';
import { inr, fmtDate, initials } from '@/lib/utils';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [checking, setChecking] = React.useState(true);
  const d = useDealership();

  React.useEffect(() => watchAuth((u) => {
    if (!u) { router.replace('/customer/login'); return; }
    setUser(u);
    setChecking(false);
  }), [router]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-7 w-7" />
          <p className="text-sm font-semibold text-ink-500">Loading your account…</p>
        </div>
      </div>
    );
  }

  const email = user?.email ?? '';
  const displayName = user?.displayName || email.split('@')[0] || 'Customer';

  // Match the signed-in customer against the dealership records by email.
  const profile = d.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  const myTestDrives = d.testDrives.filter((t) => t.email.toLowerCase() === email.toLowerCase());
  const myBookings = profile ? d.bookings.filter((b) => b.customerId === profile.id) : [];
  const mySales = profile ? d.sales.filter((s) => s.customerId === profile.id) : [];
  const myPayments = profile ? d.payments.filter((p) => p.customerId === profile.id) : [];
  const myInsurance = profile ? d.insurance.filter((i) => i.customerId === profile.id) : [];
  const myBike = profile?.purchasedBikeId ? d.bikes.find((b) => b.id === profile.purchasedBikeId) : undefined;

  const SECTIONS = [
    { key: 'enquiries', icon: MessageSquare, title: 'My Enquiries', count: profile ? 1 : 0 },
    { key: 'testdrives', icon: CalendarCheck, title: 'My Test Drives', count: myTestDrives.length },
    { key: 'bookings', icon: ClipboardList, title: 'My Bookings', count: myBookings.length },
    { key: 'payments', icon: Wallet, title: 'My Payments', count: myPayments.length },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="section flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-950 text-white"><Bike className="h-4.5 w-4.5" /></span>
            <span className="text-base font-black text-ink-900">Tamil Motors</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2.5 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-xs font-bold text-white">{initials(displayName)}</span>
              <span className="text-sm font-semibold text-ink-800">{displayName}</span>
            </span>
            <button onClick={async () => { await logOut(); router.replace('/'); }} className="btn-outline py-2 text-xs">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="section py-8">
        <h1 className="text-2xl font-black tracking-tight text-ink-900">Welcome back, {displayName.split(' ')[0]}</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Your enquiries, test drives, bookings and payments with Tamil Motors.
        </p>

        {d.loading ? <div className="mt-8"><LoadingBlock /></div> : (
          <>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS.map(({ key, icon: Icon, title, count }) => (
                <div key={key} className="card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-2xl font-black text-ink-900">{count}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-5">
                <Card>
                  <CardHeader title="My Test Drives" icon={CalendarCheck} />
                  {myTestDrives.length ? (
                    <ul className="divide-y divide-ink-100">
                      {myTestDrives.map((t) => (
                        <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                          <div>
                            <p className="text-sm font-bold text-ink-900">{t.bikeName}</p>
                            <p className="text-xs text-ink-500">{fmtDate(t.date)} · {t.time} · {t.location}</p>
                          </div>
                          <StatusChip value={t.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState title="No test drives yet" message="Book a test ride from the bike catalog and it will show up here." />
                  )}
                </Card>

                <Card>
                  <CardHeader title="My Bookings" icon={ClipboardList} />
                  {myBookings.length ? (
                    <ul className="divide-y divide-ink-100">
                      {myBookings.map((b) => (
                        <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                          <div>
                            <p className="text-sm font-bold text-ink-900">{b.bikeName}</p>
                            <p className="text-xs text-ink-500">{b.bookingCode} · {fmtDate(b.bookingDate)} · {inr(b.bookingAmount)} advance</p>
                          </div>
                          <StatusChip value={b.deliveryStatus} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState title="No bookings yet" message="Once you book a bike at the showroom, its delivery status appears here." />
                  )}
                </Card>

                <Card>
                  <CardHeader title="My Payments" icon={Wallet} />
                  {myPayments.length ? (
                    <ul className="divide-y divide-ink-100">
                      {myPayments.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                          <div>
                            <p className="text-sm font-bold text-ink-900">{inr(p.amount)}</p>
                            <p className="text-xs text-ink-500">{p.paymentCode} · {p.method} · {fmtDate(p.date)}</p>
                          </div>
                          <StatusChip value={p.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState title="No payments recorded" message="Payments made at the showroom will be listed here." />
                  )}
                </Card>
              </div>

              <aside className="space-y-5">
                <Card>
                  <CardHeader title="My Vehicle" icon={Bike} />
                  {myBike ? (
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{myBike.brand}</p>
                      <p className="mt-1 text-lg font-black text-ink-900">{myBike.model}</p>
                      <p className="text-sm text-ink-500">{myBike.variant}</p>
                      <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
                        <div className="flex justify-between"><dt className="text-ink-500">Engine</dt><dd className="font-semibold text-ink-900">{myBike.engine}</dd></div>
                        <div className="flex justify-between"><dt className="text-ink-500">Mileage</dt><dd className="font-semibold text-ink-900">{myBike.mileage}</dd></div>
                        <div className="flex justify-between"><dt className="text-ink-500">Fuel</dt><dd className="font-semibold text-ink-900">{myBike.fuelType}</dd></div>
                      </dl>
                      <Link href={`/bikes/${myBike.slug}`} className="btn-outline mt-5 w-full">
                        View model page <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <EmptyState title="No vehicle yet" message="After your purchase, your vehicle details will appear here." />
                  )}
                </Card>

                <Card>
                  <CardHeader title="Service Information" icon={Wrench} />
                  <div className="p-5">
                    {myInsurance.length ? (
                      <ul className="space-y-3">
                        {myInsurance.map((i) => (
                          <li key={i.id} className="rounded-xl bg-ink-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-bold text-ink-900">{i.company}</p>
                              <StatusChip value={i.status} />
                            </div>
                            <p className="mt-1 text-xs text-ink-500">
                              Policy {i.policyNumber} · expires {fmtDate(i.policyExpiry)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-ink-500">
                        Your service schedule and insurance details will be listed here once your purchase is completed.
                      </p>
                    )}
                    <Link href="/services" className="btn-ghost mt-4 w-full">View showroom services</Link>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="My Documents" icon={FolderLock} />
                  <div className="p-5 text-center">
                    <ShieldCheck className="mx-auto h-7 w-7 text-ink-300" />
                    <p className="mt-3 text-sm text-ink-500">
                      RC, invoice, insurance and loan documents in one secure place is part of the complete
                      Tamil Motors system.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <LockedButton featureKey="documents" label="Learn more" className="btn-outline" />
                    </div>
                  </div>
                </Card>
              </aside>
            </div>

            {!profile ? (
              <div className="mt-6 rounded-2xl border border-dashed border-ink-300 bg-white p-5 text-sm text-ink-500">
                No dealership record is linked to <strong className="text-ink-800">{email}</strong> yet. Once our
                team adds you as a customer, your enquiries, bookings and payments will appear on this page.
                {mySales.length ? null : ' In the meantime you can browse the catalog and book a test ride.'}
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
