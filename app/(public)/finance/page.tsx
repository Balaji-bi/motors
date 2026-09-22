import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Percent, Clock3, UserCheck } from 'lucide-react';
import { EmiCalculator } from '@/components/public/EmiCalculator';

export const metadata: Metadata = {
  title: 'Bike Finance & EMI Assistance',
  description:
    'Understand two-wheeler finance options at Tamil Motors Coimbatore. Use the demo EMI calculator and see the documents required for a loan application.',
  alternates: { canonical: '/finance' },
};

const DOCS = [
  'Identity proof (Aadhaar / PAN)',
  'Address proof',
  'Recent passport-size photographs',
  'Income proof or salary slips',
  'Bank statement (last 3–6 months)',
  'Valid driving licence',
];

const STEPS = [
  { icon: UserCheck, title: 'Share your details', body: 'Tell our sales team the model you want and your preferred down payment.' },
  { icon: FileText, title: 'Submit documents', body: 'We help you assemble the KYC and income documents the financier needs.' },
  { icon: Clock3, title: 'Application review', body: 'The financier reviews the application; we track its status for you.' },
  { icon: Percent, title: 'Approval & disbursal', body: 'Once approved, the loan is disbursed and delivery is scheduled.' },
];

export default function FinancePage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Finance</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">Finance Assistance</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            Our team helps you compare EMI options and complete the paperwork. Loan approval, interest rate
            and eligibility are decided by the financier, not by the showroom.
          </p>
        </div>
      </section>

      <section className="section py-12">
        <EmiCalculator />
      </section>

      <section className="section grid gap-6 pb-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-ink-900">How the process works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="card relative p-5">
                <span className="absolute right-5 top-4 text-3xl font-black text-ink-100">{i + 1}</span>
                <Icon className="h-5 w-5 text-brand-600" />
                <h3 className="mt-3 text-sm font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-ink-900">Documents usually required</h2>
          <ul className="mt-4 space-y-2.5">
            {DOCS.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-ink-700">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {d}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-ink-400">
            Exact requirements vary by financier. Our sales team confirms the final list for your application.
          </p>
          <Link href="/contact?subject=Finance%20enquiry" className="btn-primary mt-6 w-full">
            Talk to our finance desk
          </Link>
        </div>
      </section>
    </>
  );
}
