import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, FileCheck2, BellRing, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Two-Wheeler Insurance Assistance',
  description:
    'Tamil Motors helps you with two-wheeler insurance paperwork, renewals and policy reminders at our Coimbatore showroom.',
  alternates: { canonical: '/insurance' },
};

const SERVICES = [
  { icon: FileCheck2, title: 'New policy at purchase', body: 'Insurance is arranged along with registration when you take delivery of your bike.' },
  { icon: RefreshCw, title: 'Renewal support', body: 'We help you renew an expiring policy without a separate trip to the insurer.' },
  { icon: BellRing, title: 'Expiry reminders', body: 'The dealership system flags policies expiring within 30 days so nobody is caught out.' },
  { icon: ShieldCheck, title: 'Claim guidance', body: 'Our service desk explains the claim process and the documents you will need.' },
];

const COVERS = [
  ['Third-party liability', 'Mandatory cover required to ride legally on Indian roads.'],
  ['Own damage', 'Covers damage to your own vehicle from accidents, fire or theft.'],
  ['Comprehensive', 'Combines third-party and own-damage cover in a single policy.'],
  ['Add-on covers', 'Optional extras such as zero depreciation or roadside assistance.'],
];

export default function InsurancePage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Insurance</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">Insurance Assistance</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            We handle the paperwork so your two-wheeler is covered from day one, and remind you before the
            policy lapses. Cover terms and premiums are set by the insurance provider.
          </p>
        </div>
      </section>

      <section className="section py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-sm font-bold text-ink-900">{title}</h2>
              <p className="mt-2 text-sm text-ink-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section grid gap-6 pb-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="card overflow-hidden">
          <h2 className="border-b border-ink-200 px-6 py-5 text-lg font-bold text-ink-900">Types of cover explained</h2>
          <dl className="divide-y divide-ink-100">
            {COVERS.map(([k, v]) => (
              <div key={k} className="px-6 py-4">
                <dt className="flex items-center gap-2 text-sm font-bold text-ink-900">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" /> {k}
                </dt>
                <dd className="mt-1.5 pl-6 text-sm text-ink-500">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl bg-ink-950 p-7 text-white">
          <ShieldCheck className="h-8 w-8 text-brand-400" />
          <h2 className="mt-5 text-xl font-black">Policy expiring soon?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Bring your existing policy details to the showroom and our team will check the renewal options
            available for your vehicle.
          </p>
          <Link href="/contact?subject=Insurance%20renewal" className="btn mt-7 w-full bg-white text-ink-900 hover:bg-white/90">
            Request renewal help
          </Link>
          <p className="mt-4 text-xs text-white/50">
            Tamil Motors provides assistance only; policies are issued by the insurance company.
          </p>
        </div>
      </section>
    </>
  );
}
