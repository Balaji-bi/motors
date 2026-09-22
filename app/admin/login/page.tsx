'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Bike, Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { signIn, resolveRole, friendlyAuthError, ADMIN_EMAIL } from '@/lib/firebase/auth';
import { Field, Spinner } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await signIn(email, password);
      const role = await resolveRole(user);
      router.replace(role === 'customer' ? '/customer/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err instanceof FirebaseError ? friendlyAuthError(err.code) : 'Sign in failed. Please try again.');
      setBusy(false);
    }
  }

  function useDemoCredentials() {
    setEmail(ADMIN_EMAIL);
    setPassword('Tamil@motors');
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600">
            <Bike className="h-5 w-5" />
          </span>
          <span className="text-lg font-black">Tamil Motors</span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl font-black leading-tight">
            Dealership Management System
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Sales, customers, employees, inventory, bookings, finance, insurance, payments and revenue —
            managed from a single dashboard.
          </p>
          <ul className="mt-8 space-y-2.5">
            {['Live sales & revenue dashboard', 'Inventory and stock control', 'Employee performance tracking', 'Customer follow-ups and CRM'].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4 text-brand-400" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">Powered by PubliqWebb Tech</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>

          <div className="mt-8 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-950 text-white">
              <Bike className="h-5 w-5" />
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-black tracking-tight text-ink-900">Admin &amp; Employee Login</h2>
          <p className="mt-2 text-sm text-ink-500">
            Sign in to the Tamil Motors management system.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tamilmotors@admin.com"
                  autoComplete="email"
                  required
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  className="input pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </Field>

            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            ) : null}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? <><Spinner className="h-4 w-4 text-white" /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Demo administrator</p>
            <p className="mt-2 text-sm text-ink-700">{ADMIN_EMAIL}</p>
            <p className="text-sm text-ink-700">Tamil@motors</p>
            <button onClick={useDemoCredentials} className="btn-outline mt-3 w-full py-2 text-xs">
              Fill demo credentials
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500">
            Are you a customer?{' '}
            <Link href="/customer/login" className="font-semibold text-brand-600 hover:underline">
              Customer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
