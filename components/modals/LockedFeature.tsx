'use client';

import * as React from 'react';
import { Lock, Sparkles, Mail, Phone, Globe, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui';

export const PUBLIQWEBB = {
  name: 'PubliqWebb Tech',
  website: 'publiqwebb.com',
  email: 'publiqwebbtech@gmail.com',
  phone: '+91 96003 76168',
};

/** Feature-specific copy so the upsell never feels like a generic wall. */
export const LOCKED_COPY: Record<string, { title: string; lead: string; body: string; bullets: string[] }> = {
  'ai-sales': {
    title: 'AI Sales Intelligence is part of the advanced dealership package',
    lead: 'Turn your sales history into decisions.',
    body: 'Analyse sales performance, identify high-demand bikes, predict customer conversion and generate business insights automatically.',
    bullets: ['High-demand model detection', 'Conversion probability scoring', 'Sales-team coaching insights', 'Automated weekly business summary'],
  },
  'ai-followup': {
    title: 'AI Customer Follow-Up is available in the complete system',
    lead: 'Never lose a warm customer again.',
    body: 'The system identifies customers who have not completed their purchase and tells your team exactly who to call first.',
    bullets: ['Priority-ranked follow-up queue', 'Likely-to-convert scoring', 'Pending test-drive recovery', 'Automatic reminders for executives'],
  },
  whatsapp: {
    title: 'WhatsApp Automation is available in the advanced package',
    lead: 'Reach every customer, automatically.',
    body: 'Automatically notify customers about bookings, payments, test drives, deliveries and service reminders.',
    bullets: ['Test drive & booking confirmations', 'Payment reminders', 'Delivery notifications', 'Insurance & service reminders'],
  },
  'ai-revenue': {
    title: 'AI Revenue Analytics is part of the advanced dealership package',
    lead: 'See next month before it happens.',
    body: 'Get automated revenue forecasting, sales insights and business recommendations from your own dealership data.',
    bullets: ['Projected revenue by month', 'Demand prediction per model', 'Best-selling model detection', 'Employee performance prediction'],
  },
  'multi-branch': {
    title: 'Multi-Branch Management is available in the complete dealership system',
    lead: 'One dashboard, every showroom.',
    body: 'Manage multiple showrooms, employees, inventory and revenue from a single dashboard.',
    bullets: ['Coimbatore, Tiruppur, Erode, Madurai', 'Branch-wise revenue comparison', 'Stock transfer between branches', 'Branch-level employee targets'],
  },
  crm: {
    title: 'Complete CRM & Service Management is part of the full platform',
    lead: 'Own the customer relationship after delivery.',
    body: 'Service history, warranty tracking and retention automation keep customers coming back to Tamil Motors.',
    bullets: ['Customer service history', 'Service reminders', 'Warranty tracking', 'Automatic retention follow-ups'],
  },
  documents: {
    title: 'Automated Document Management is available in the complete system',
    lead: 'Every document, filed automatically.',
    body: 'RC, insurance, invoices, loan papers, KYC and delivery documents stored against each customer and generated on demand.',
    bullets: ['RC & insurance storage', 'Auto-generated invoices', 'Loan document tracking', 'Customer KYC vault'],
  },
  export: {
    title: 'Advanced exports are part of the complete reporting module',
    lead: 'Board-ready reports in one click.',
    body: 'Scheduled PDF and Excel exports, branded report templates and automatic email delivery to management.',
    bullets: ['PDF & Excel export', 'Branded report templates', 'Scheduled email delivery', 'Custom date-range analytics'],
  },
  bi: {
    title: 'Business Intelligence is part of the advanced dealership package',
    lead: 'Your whole dealership, one view.',
    body: 'Cross-module dashboards that connect sales, stock, finance and staff performance into a single business picture.',
    bullets: ['Cross-module dashboards', 'Profitability per model', 'Stock ageing analysis', 'Custom KPI builder'],
  },
  generic: {
    title: 'Unlock the Complete Tamil Motors Management System',
    lead: 'This module is part of the complete platform.',
    body: 'The complete system can automate sales, employee management, inventory, revenue, customer follow-ups, WhatsApp communication, AI analytics, finance tracking and multi-branch operations.',
    bullets: ['Automated sales & CRM workflows', 'AI analytics and forecasting', 'WhatsApp customer automation', 'Multi-branch operations'],
  },
};

export type LockedKey = keyof typeof LOCKED_COPY;

type Ctx = { open: (key?: LockedKey) => void };
const LockedContext = React.createContext<Ctx>({ open: () => {} });

export function useLockedFeature() {
  return React.useContext(LockedContext);
}

export function LockedFeatureProvider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = React.useState<LockedKey | null>(null);
  const open = React.useCallback((k: LockedKey = 'generic') => setKey(k), []);
  const close = React.useCallback(() => setKey(null), []);
  const value = React.useMemo(() => ({ open }), [open]);

  const copy = LOCKED_COPY[key ?? 'generic'];

  return (
    <LockedContext.Provider value={value}>
      {children}
      <Modal open={key !== null} onClose={close} size="lg">
        <div className="relative overflow-hidden bg-ink-950 px-6 pb-10 pt-12 text-white sm:px-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative">
            <span className="chip bg-white/10 text-white ring-1 ring-white/20">
              <Lock className="h-3.5 w-3.5" /> Premium Feature
            </span>
            <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">{copy.title}</h2>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              You are currently viewing the demo version of the Tamil Motors dealership management system.
            </p>
            <p className="mt-2 max-w-xl text-sm text-white/80">{copy.body}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {copy.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-white/85">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-10">
          <div className="grid gap-3 sm:grid-cols-3">
            <a href={`mailto:${PUBLIQWEBB.email}?subject=Tamil%20Motors%20-%20Full%20System%20Enquiry`} className="btn-primary w-full">
              Contact {PUBLIQWEBB.name}
            </a>
            <a href={`mailto:${PUBLIQWEBB.email}?subject=Request%20Full%20Demo%20-%20Tamil%20Motors`} className="btn-dark w-full">
              Request Full Demo
            </a>
            <button onClick={close} className="btn-outline w-full">Continue Exploring</button>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl bg-ink-50 p-5 text-sm sm:grid-cols-3">
            <p className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-ink-500">
              {PUBLIQWEBB.name}
            </p>
            <span className="flex items-center gap-2 text-ink-700"><Globe className="h-4 w-4 text-brand-600" />{PUBLIQWEBB.website}</span>
            <a href={`mailto:${PUBLIQWEBB.email}`} className="flex items-center gap-2 text-ink-700 hover:text-brand-600">
              <Mail className="h-4 w-4 text-brand-600" />{PUBLIQWEBB.email}
            </a>
            <a href={`tel:${PUBLIQWEBB.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-ink-700 hover:text-brand-600">
              <Phone className="h-4 w-4 text-brand-600" />{PUBLIQWEBB.phone}
            </a>
          </div>
        </div>
      </Modal>
    </LockedContext.Provider>
  );
}

/** Button that opens the contextual premium modal. */
export function LockedButton({
  featureKey = 'generic', label = 'Unlock Feature', className = 'btn-dark',
}: { featureKey?: LockedKey; label?: string; className?: string }) {
  const { open } = useLockedFeature();
  return (
    <button className={className} onClick={() => open(featureKey)}>
      <Lock className="h-4 w-4" />
      {label}
    </button>
  );
}

/** Premium preview card used across /admin/advanced. */
export function AdvancedFeatureCard({
  icon: Icon, title, description, preview, featureKey, cta = 'Unlock Feature',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; description: string; preview: string[];
  featureKey: LockedKey; cta?: string;
}) {
  const { open } = useLockedFeature();
  return (
    <button
      onClick={() => open(featureKey)}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-50 blur-2xl transition group-hover:bg-brand-100" />
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink-950 text-white">
          <Icon className="h-5 w-5" />
        </span>
        <span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          <Lock className="h-3 w-3" /> Locked
        </span>
      </div>

      <h3 className="relative mt-5 text-base font-bold text-ink-900">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-500">{description}</p>

      <ul className="relative mt-4 space-y-1.5">
        {preview.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-ink-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="blur-[0.4px]">{p}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Premium Feature</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}
