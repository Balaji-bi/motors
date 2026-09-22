import Link from 'next/link';
import {
  ArrowRight, Users, Bike as BikeIcon, BadgeIndianRupee, ShieldCheck,
  CalendarCheck, Headset, Star, MapPin, Wrench, CheckCircle2,
} from 'lucide-react';
import { STATIC_BIKES } from '@/lib/tamil-motors/demo-data';
import { BikeCard } from '@/components/public/BikeCard';

const TRUST = [
  { icon: Users, value: '500+', label: 'Customers', note: 'Served across Coimbatore district' },
  { icon: BikeIcon, value: '10+', label: 'Bike Models', note: 'Commuter to premium line-up' },
  { icon: Headset, value: 'Experienced', label: 'Sales Team', note: 'Guided model selection' },
  { icon: BadgeIndianRupee, value: 'Easy', label: 'Finance Assistance', note: 'EMI options explained upfront' },
  { icon: CalendarCheck, value: 'Available', label: 'Test Rides', note: 'Book a slot that suits you' },
  { icon: ShieldCheck, value: 'Insurance', label: 'Assistance', note: 'Policy paperwork handled' },
];

const STEPS = [
  { title: 'Explore the line-up', body: 'Browse commuter, scooter, sports, premium and electric models with clear specifications.' },
  { title: 'Book a test ride', body: 'Pick a bike, date and time. Our sales team confirms your slot at the showroom.' },
  { title: 'Finance & insurance', body: 'We walk you through EMI options and help you complete the policy paperwork.' },
  { title: 'Delivery & service', body: 'Track your booking through to delivery, with service reminders after purchase.' },
];

export default function HomePage() {
  const featured = STATIC_BIKES.slice(0, 6);

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-brand-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="section relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-fade-up">
            <span className="chip bg-white/10 text-white ring-1 ring-white/20">
              <MapPin className="h-3.5 w-3.5 text-brand-400" /> Two-wheeler showroom · Coimbatore
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Find Your <span className="text-brand-500">Perfect Ride</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Explore our latest two-wheelers, compare models, book a test ride and connect with our sales team.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/bikes" className="btn-primary">
                Explore Bikes <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/test-drive" className="btn bg-white text-ink-900 hover:bg-white/90">
                Book a Test Ride
              </Link>
              <Link href="/contact" className="btn border border-white/25 text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[['10+', 'Models'], ['5', 'Categories'], ['500+', 'Customers']].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-black">{v}</dt>
                  <dd className="text-xs font-semibold uppercase tracking-wider text-white/50">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Showroom visual */}
          <div className="relative animate-fade-up">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600 via-brand-800 to-ink-950 p-8 shadow-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
              <div className="relative">
                <span className="chip bg-white/15 text-white ring-1 ring-white/25">Featured · Demo unit</span>
                <BikeIcon className="mt-8 h-32 w-32 text-white/90" strokeWidth={0.9} />
                <p className="mt-6 text-3xl font-black leading-none">Yamaha MT-15 V2</p>
                <p className="mt-2 text-sm text-white/70">155cc · 6-Speed Manual · 48 kmpl</p>
                <div className="mt-8 flex items-end justify-between border-t border-white/15 pt-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Demo price</p>
                    <p className="text-2xl font-black">₹1,78,500</p>
                  </div>
                  <Link href="/bikes/yamaha-mt-15-v2" className="btn bg-white text-ink-900 hover:bg-white/90">
                    View details
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: CalendarCheck, label: 'Test ride' },
                { icon: BadgeIndianRupee, label: 'Finance' },
                { icon: Wrench, label: 'Service' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="card-glass flex flex-col items-center gap-2 py-4 text-white">
                  <Icon className="h-5 w-5 text-brand-400" />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Trust cards ---------------------------- */}
      <section className="section py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Why Tamil Motors</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
              A showroom that handles everything
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-500">
            Figures on this page are demo statistics shown for this demonstration platform.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map(({ icon: Icon, value, label, note }) => (
            <div key={label} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-2xl font-black text-ink-900">{value}</p>
              <p className="text-sm font-bold text-ink-800">{label}</p>
              <p className="mt-2 text-sm text-ink-500">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ Line-up ------------------------------ */}
      <section className="bg-ink-50/70 py-20">
        <div className="section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Showroom line-up</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">Popular models</h2>
            </div>
            <Link href="/bikes" className="btn-outline">
              View all bikes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        </div>
      </section>

      {/* ------------------------------- Steps ------------------------------- */}
      <section className="section py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">How it works</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
          From first enquiry to delivery, in four steps
        </h2>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card relative p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-ink-100">{i + 1}</span>
              <CheckCircle2 className="h-6 w-6 text-brand-600" />
              <h3 className="mt-4 text-base font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ----------------------------- Testimonial ---------------------------- */}
      <section className="section pb-4">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ['The team explained the EMI options clearly and the test ride was arranged the same week.', 'Arun Kumar', 'Demo customer · Gandhipuram'],
            ['Booking to delivery was tracked properly and I got updates at every stage.', 'Divya S', 'Demo customer · Peelamedu'],
            ['Insurance paperwork was handled at the showroom itself, which saved me a trip.', 'Vignesh R', 'Demo customer · Tiruppur'],
          ].map(([quote, who, meta]) => (
            <figure key={who} className="card p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-ink-700">&ldquo;{quote}&rdquo;</blockquote>
              <figcaption className="mt-5 border-t border-ink-100 pt-4">
                <p className="text-sm font-bold text-ink-900">{who}</p>
                <p className="text-xs text-ink-500">{meta}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-400">
          Testimonials shown are illustrative demo content created for this demonstration platform.
        </p>
      </section>
    </>
  );
}
