import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, MapPin, ShieldCheck, IdCard } from 'lucide-react';
import { TestDriveForm } from '@/components/public/TestDriveForm';
import { LoadingBlock } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Book a Test Ride',
  description:
    'Book a two-wheeler test ride at the Tamil Motors showroom in Coimbatore. Choose your preferred bike, date, time and location.',
  alternates: { canonical: '/test-drive' },
};

const NOTES = [
  { icon: IdCard, title: 'Carry a valid licence', body: 'A valid two-wheeler driving licence is required before any test ride.' },
  { icon: Clock, title: 'Slots run 10 AM – 7 PM', body: 'Each test ride slot is around 20 minutes, including a short briefing.' },
  { icon: MapPin, title: 'Four demo locations', body: 'Gandhipuram, Peelamedu, Tiruppur and Erode branches accept bookings.' },
  { icon: ShieldCheck, title: 'Safety first', body: 'Helmets are provided at the showroom and are mandatory for every ride.' },
];

export default function TestDrivePage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Test Ride</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">Book a Test Ride</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            Pick the model you want to ride, choose a date and time, and our sales team will confirm your slot.
          </p>
        </div>
      </section>

      <section className="section grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <Suspense fallback={<LoadingBlock label="Loading booking form…" />}>
          <TestDriveForm />
        </Suspense>

        <aside className="space-y-4">
          {NOTES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card flex gap-4 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 text-white">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm text-ink-500">{body}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
