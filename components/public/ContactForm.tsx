'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Field, Select, Spinner } from '@/components/ui';
import { TM, createDoc } from '@/lib/firebase/firestore';

const SUBJECTS = [
  'Bike enquiry', 'Test ride', 'Finance enquiry', 'Insurance renewal',
  'Service booking', 'Exchange valuation', 'Other',
];

export function ContactForm() {
  const params = useSearchParams();
  const presetSubject = params.get('subject');

  const [form, setForm] = React.useState({
    name: '', phone: '', email: '',
    subject: presetSubject && SUBJECTS.includes(presetSubject) ? presetSubject : SUBJECTS[0],
    message: presetSubject && !SUBJECTS.includes(presetSubject) ? presetSubject : '',
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
      // Enquiries land as leads in the Tamil Motors customer pipeline.
      await createDoc(TM.customers, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: '',
        city: 'Coimbatore',
        status: 'lead',
        source: 'Website enquiry',
        enquirySubject: form.subject,
        enquiryMessage: form.message,
      });
      await createDoc(TM.notifications, {
        type: 'New Customer',
        title: 'New website enquiry',
        message: `${form.name} submitted an enquiry — ${form.subject}.`,
        read: false,
        date: new Date().toISOString().slice(0, 10),
      });
      setState('done');
    } catch {
      setError('We could not send that right now. Please call the showroom instead.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-black text-ink-900">Enquiry sent</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
          Thanks {form.name.split(' ')[0]} — our sales desk has your enquiry about{' '}
          <strong className="text-ink-800">{form.subject.toLowerCase()}</strong> and will call you back shortly.
        </p>
        <button className="btn-outline mx-auto mt-6" onClick={() => setState('idle')}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <h2 className="text-base font-bold text-ink-900">Send an enquiry</h2>
      <p className="mt-1 text-xs text-ink-500">We usually respond within one working day.</p>

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
        <Field label="Subject">
          <Select ariaLabel="Subject" value={form.subject} onChange={set('subject')} options={SUBJECTS.map((s) => ({ value: s, label: s }))} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message">
            <textarea
              className="input min-h-[120px] resize-y"
              value={form.message}
              onChange={(e) => set('message')(e.target.value)}
              placeholder="Tell us which model you are considering, or what you need help with."
            />
          </Field>
        </div>
      </div>

      {state === 'error' && error ? (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      ) : null}

      <button type="submit" disabled={state === 'saving'} className="btn-primary mt-6 w-full sm:w-auto">
        {state === 'saving' ? <><Spinner className="h-4 w-4 text-white" /> Sending…</> : <><Send className="h-4 w-4" /> Send enquiry</>}
      </button>
    </form>
  );
}
