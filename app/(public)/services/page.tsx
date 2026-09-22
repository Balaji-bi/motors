import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Wrench, Bike, BadgeIndianRupee, ShieldCheck, Repeat,
  PackageCheck, Headset, CalendarCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Showroom Services',
  description:
    'Sales, test rides, finance assistance, insurance support, servicing, accessories and exchange help at Tamil Motors, Coimbatore.',
  alternates: { canonical: '/services' },
};

const SERVICES = [
  { icon: Bike, title: 'New Bike Sales', body: 'Commuter, scooter, sports, premium and electric models with guided selection.' },
  { icon: CalendarCheck, title: 'Test Rides', body: 'Book a slot online and ride the model you are considering before you decide.' },
  { icon: BadgeIndianRupee, title: 'Finance Assistance', body: 'EMI comparison and document support for two-wheeler loan applications.' },
  { icon: ShieldCheck, title: 'Insurance Support', body: 'New policies at delivery, renewals and expiry reminders handled at the showroom.' },
  { icon: Wrench, title: 'Periodic Servicing', body: 'Scheduled service, running repairs and genuine spare parts at our service bay.' },
  { icon: PackageCheck, title: 'Accessories Fitment', body: 'Helmets, guards, seat covers and connectivity accessories fitted at purchase.' },
  { icon: Repeat, title: 'Exchange Assistance', body: 'Valuation support if you want to exchange your existing two-wheeler.' },
  { icon: Headset, title: 'Customer Support', body: 'A single point of contact from enquiry through delivery and after-sales.' },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Services</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">What we handle for you</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            Everything from the first enquiry to after-sales service, managed by one team at the showroom.
          </p>
        </div>
      </section>

      <section className="section py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink-950 text-white transition group-hover:bg-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-sm font-bold text-ink-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/test-drive" className="btn-primary">Book a Test Ride</Link>
          <Link href="/bikes" className="btn-outline">Browse the catalog</Link>
          <Link href="/contact" className="btn-ghost">Contact the showroom</Link>
        </div>
      </section>
    </>
  );
}
