'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Field, Select, Spinner } from '@/components/ui';
import { requestTestDrive } from '@/lib/tamil-motors/testDrives';
import { STATIC_BIKES } from '@/lib/tamil-motors/demo-data';

const TIMES = ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];
const LOCATIONS = [
  'Coimbatore — Gandhipuram',
  'Coimbatore — Peelamedu',
  'Tiruppur',
  'Erode',
];

const BIKE_OPTIONS = STATIC_BIKES.map((b) => ({
  value: `${b.brand} ${b.model}`,
  label: `${b.brand} ${b.model} — ${b.variant}`,
  id: b.id,
}));

export function TestDriveForm() {
  const params = useSearchParams();
  const preselected = params.get('bike');

  const [form, setForm] = React.useState({
    name: '', phone: '', email: '',
    bikeName: preselected && BIKE_OPTIONS.some((o) => o.value === preselected)
      ? preselected
      : BIKE_OPTIONS[0].value,
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: TIMES[0],
    location: LOCATIONS[0],
  });
  const [state, setState] = React.useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = React.useState('');

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required.');
      setState('error');
      return;
    }
    setState('saving');
    setError('');
    try {
      const bikeId = BIKE_OPTIONS.find((o) => o.value === form.bikeName)?.id;
      await requestTestDrive({ ...form, bikeId });
      setState('done');
    } catch {
      setError('We could not submit the request right now. Please call the showroom instead.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-black text-ink-900">Test ride request received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
          Thanks {form.name.split(' ')[0]} — your request for the <strong className="text-ink-800">{form.bikeName}</strong> on{' '}
          {form.date} at {form.time} has been sent to our sales team. They will confirm your slot by phone.
        </p>
        <button
          className="btn-outline mx-auto mt-6"
          onClick={() => { setState('idle'); setForm((f) => ({ ...f, name: '', phone: '', email: '' })); }}
        >
          Book another test ride
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-ink-200 pb-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-ink-900">Book your slot</h2>
          <p className="text-xs text-ink-500">Our sales team confirms every request by phone.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input className="input" value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Arun Kumar" required />
        </Field>
        <Field label="Phone number">
          <input className="input" value={form.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+91 98765 43210" required />
        </Field>
        <Field label="Email">
          <input type="email" className="input" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Preferred bike">
          <Select ariaLabel="Preferred bike" value={form.bikeName} onChange={set('bikeName')} options={BIKE_OPTIONS} />
        </Field>
        <Field label="Preferred date">
          <input type="date" className="input" value={form.date} onChange={(e) => set('date')(e.target.value)} required />
        </Field>
        <Field label="Preferred time">
          <Select ariaLabel="Preferred time" value={form.time} onChange={set('time')} options={TIMES.map((t) => ({ value: t, label: t }))} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Showroom location">
            <Select ariaLabel="Location" value={form.location} onChange={set('location')} options={LOCATIONS.map((l) => ({ value: l, label: l }))} />
          </Field>
        </div>
      </div>

      {state === 'error' && error ? (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      ) : null}

      <button type="submit" disabled={state === 'saving'} className="btn-primary mt-6 w-full sm:w-auto">
        {state === 'saving' ? <><Spinner className="h-4 w-4 text-white" /> Submitting…</> : 'Request Test Ride'}
      </button>

      <p className="mt-4 text-xs text-ink-400">
        Your request is stored in the Tamil Motors demo system and appears instantly in the admin Test Drives module.
      </p>
    </form>
  );
}
