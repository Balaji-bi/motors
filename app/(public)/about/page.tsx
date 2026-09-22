import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Users, Bike, Target, Heart, Building2 } from 'lucide-react';
import { PUBLIQWEBB } from '@/components/modals/LockedFeature';

export const metadata: Metadata = {
  title: 'About Tamil Motors',
  description:
    'Tamil Motors is a two-wheeler dealership based in Coimbatore, Tamil Nadu, offering sales, test rides, finance and insurance assistance.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { icon: Heart, title: 'Straight answers', body: 'Clear pricing conversations and no pressure to close on the same day.' },
  { icon: Target, title: 'One point of contact', body: 'The executive who takes your enquiry stays with you until delivery.' },
  { icon: Users, title: 'Local team', body: 'A sales and service team that knows Coimbatore roads and riding needs.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="section relative py-20">
          <span className="chip bg-white/10 text-white ring-1 ring-white/20">
            <MapPin className="h-3.5 w-3.5 text-brand-400" /> Coimbatore, Tamil Nadu
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            A two-wheeler dealership built around the rider
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            Tamil Motors sells and services two-wheelers across Coimbatore district. We help riders pick the
            right model, arrange test rides, explain finance options and handle the insurance and registration
            paperwork that usually takes the longest.
          </p>
        </div>
      </section>

      <section className="section grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-ink-900">What we do</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-600">
            <p>
              Our showroom carries commuter, scooter, sports, premium and electric two-wheelers, so a first-time
              rider and a long-distance tourer can both be served from the same floor.
            </p>
            <p>
              Beyond the sale, our team tracks each customer through booking, finance approval, registration,
              insurance and delivery — then stays in touch for servicing and policy renewals.
            </p>
            <p>
              This site is a demonstration platform. Inventory, prices, customers and performance figures shown
              across the public pages and the management dashboard are fictional demo data.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-5">
                <Icon className="h-5 w-5 text-brand-600" />
                <h3 className="mt-3 text-sm font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <Building2 className="h-6 w-6 text-brand-600" />
            <h2 className="mt-4 text-base font-bold text-ink-900">Showroom locations</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {['Coimbatore — Gandhipuram (main)', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'].map((l) => (
                <li key={l} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-ink-400" /> {l}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-400">Demo branch list shown for this demonstration platform.</p>
          </div>

          <div className="card p-6">
            <Bike className="h-6 w-6 text-brand-600" />
            <h2 className="mt-4 text-base font-bold text-ink-900">Demo statistics</h2>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[['500+', 'Customers'], ['25', 'Models'], ['15', 'Staff']].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-ink-50 py-3">
                  <dt className="text-lg font-black text-ink-900">{v}</dt>
                  <dd className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl bg-ink-950 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Technology partner</p>
            <p className="mt-3 text-lg font-black">{PUBLIQWEBB.name}</p>
            <p className="mt-2 text-sm text-white/70">
              The Tamil Motors website and dealership management platform are built by {PUBLIQWEBB.name}.
            </p>
            <Link href="/contact" className="btn mt-5 w-full bg-white text-ink-900 hover:bg-white/90">
              Get in touch
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
