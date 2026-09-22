'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { Bike, Lock, Mail, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { signIn, registerCustomer, resolveRole, friendlyAuthError } from '@/lib/firebase/auth';
import { Field, Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<'signin' | 'register'>('signin');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'register') {
        await registerCustomer(email, password, name);
        router.replace('/customer/dashboard');
        return;
      }
      const user = await signIn(email, password);
      const role = await resolveRole(user);
      router.replace(role === 'customer' ? '/customer/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err instanceof FirebaseError ? friendlyAuthError(err.code) : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600"><Bike className="h-5 w-5" /></span>
          <span className="text-lg font-black">Tamil Motors</span>
        </Link>
        <div className="relative">
          <h1 className="text-4xl font-black leading-tight">Your bike, your account</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Track your enquiries, test drives, bookings, payments and service information in one place.
          </p>
          <ul className="mt-8 space-y-2.5">
            {['My enquiries & test drives', 'Booking and delivery status', 'Payment history', 'Service & insurance information'].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/40">Powered by PubliqWebb Tech</p>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>

          <h2 className="mt-8 text-2xl font-black tracking-tight text-ink-900">
            {mode === 'signin' ? 'Customer Login' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            {mode === 'signin' ? 'Sign in to view your enquiries, bookings and payments.' : 'Register to track your enquiries and bookings with Tamil Motors.'}
          </p>

          <div className="mt-6 flex gap-2">
            {(['signin', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={cn('flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition',
                  mode === m ? 'bg-ink-950 text-white' : 'border border-ink-200 text-ink-600 hover:bg-ink-50')}
              >
                {m === 'signin' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === 'register' ? (
              <Field label="Full name">
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-9" value={name} onChange={(e) => setName(e.target.value)} placeholder="Arun Kumar" required />
                </div>
              </Field>
            ) : null}

            <Field label="Email">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="email" className="input pl-9" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
              </div>
            </Field>

            <Field label="Password" hint={mode === 'register' ? 'At least 6 characters.' : undefined}>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-9" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required />
              </div>
            </Field>

            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            ) : null}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? <><Spinner className="h-4 w-4 text-white" /> Please wait…</> : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Staff member?{' '}
            <Link href="/admin/login" className="font-semibold text-brand-600 hover:underline">Admin login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
