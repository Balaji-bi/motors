import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ContactForm } from '@/components/public/ContactForm';
import { LoadingBlock } from '@/components/ui';
import { PUBLIQWEBB } from '@/components/modals/LockedFeature';

export const metadata: Metadata = {
  title: 'Contact Tamil Motors',
  description:
    'Contact the Tamil Motors two-wheeler showroom in Coimbatore for enquiries about bikes, test rides, finance, insurance and service.',
  alternates: { canonical: '/contact' },
};

const BRANCHES = [
  ['Coimbatore — Gandhipuram', 'Main showroom & service bay'],
  ['Coimbatore — Peelamedu', 'Sales & test rides'],
  ['Tiruppur', 'Sales & bookings'],
  ['Erode', 'Sales & bookings'],
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Contact</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">Talk to our team</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            Send an enquiry about a model, a test ride, finance or servicing and our sales desk will get back to you.
          </p>
        </div>
      </section>

      <section className="section grid gap-8 py-12 lg:grid-cols-[1.3fr_1fr]">
        <Suspense fallback={<LoadingBlock label="Loading enquiry form…" />}>
          <ContactForm />
        </Suspense>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="text-base font-bold text-ink-900">Showroom</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                Gandhipuram, Coimbatore, Tamil Nadu
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <a href="tel:+919600376168" className="hover:text-ink-900">+91 96003 76168</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <a href={`mailto:${PUBLIQWEBB.email}`} className="break-all hover:text-ink-900">{PUBLIQWEBB.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                Mon – Sat, 9:30 AM – 8:00 PM
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-bold text-ink-900">Branches</h2>
            <ul className="mt-4 space-y-3">
              {BRANCHES.map(([name, note]) => (
                <li key={name} className="rounded-xl bg-ink-50 px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">{name}</p>
                  <p className="text-xs text-ink-500">{note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-ink-950 p-6 text-white">
            <ShieldCheck className="h-6 w-6 text-brand-400" />
            <p className="mt-4 text-sm font-bold">Staff &amp; management access</p>
            <p className="mt-2 text-sm text-white/60">
              Employees and administrators sign in to the dealership management system.
            </p>
            <Link href="/admin/login" className="btn mt-5 w-full bg-white text-ink-900 hover:bg-white/90">
              Admin / Employee Login
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
