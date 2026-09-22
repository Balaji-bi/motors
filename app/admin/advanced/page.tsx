'use client';

import {
  BrainCircuit, Users2, MessageCircle, LineChart, Building2,
  HeartHandshake, FolderLock, Sparkles, Lock,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { AdvancedFeatureCard, LockedButton, PUBLIQWEBB } from '@/components/modals/LockedFeature';

const FEATURES = [
  {
    icon: BrainCircuit,
    featureKey: 'ai-sales' as const,
    title: 'AI Sales Intelligence',
    description: 'Analyse sales performance, identify high-demand bikes, predict customer conversion and generate business insights.',
    preview: ['High-demand model detection', 'Conversion probability scoring', 'Automated weekly summary'],
  },
  {
    icon: Users2,
    featureKey: 'ai-followup' as const,
    title: 'AI Customer Follow-Up',
    description: 'The system identifies customers who have not completed their purchase and ranks who your team should call first.',
    preview: ['15 High Priority Follow-ups', '8 Customers likely to convert', '5 Pending Test Drives'],
  },
  {
    icon: MessageCircle,
    featureKey: 'whatsapp' as const,
    title: 'WhatsApp Business Automation',
    description: 'Automatically send test drive confirmations, booking confirmations, payment reminders, delivery notifications and service reminders.',
    preview: ['Test drive & booking confirmations', 'Payment & delivery notifications', 'Insurance and service reminders'],
    cta: `Contact ${PUBLIQWEBB.name}`,
  },
  {
    icon: LineChart,
    featureKey: 'ai-revenue' as const,
    title: 'AI Revenue Forecast',
    description: 'Projected revenue, sales trend, demand prediction and employee performance prediction from your own dealership data.',
    preview: ['Projected Revenue', 'Sales Trend & Demand Prediction', 'Best Selling Models'],
  },
  {
    icon: Building2,
    featureKey: 'multi-branch' as const,
    title: 'Multi-Branch Dealership Management',
    description: 'Manage multiple showrooms, employees, inventory and revenue from one dashboard.',
    preview: ['Coimbatore · Tiruppur', 'Erode · Madurai', 'Branch-wise revenue comparison'],
  },
  {
    icon: HeartHandshake,
    featureKey: 'crm' as const,
    title: 'Complete CRM & Service Management',
    description: 'Keep customers after delivery with service history, reminders, warranty tracking and retention automation.',
    preview: ['Customer service history', 'Service reminders & warranty', 'Automatic follow-ups'],
  },
  {
    icon: FolderLock,
    featureKey: 'documents' as const,
    title: 'Automated Document Management',
    description: 'RC, insurance, invoices, loan documents, customer KYC and delivery paperwork filed automatically against each customer.',
    preview: ['RC · Insurance · Invoice', 'Loan documents & KYC', 'Delivery documents'],
  },
  {
    icon: Sparkles,
    featureKey: 'bi' as const,
    title: 'Business Intelligence Suite',
    description: 'Cross-module dashboards connecting sales, stock, finance and staff performance into a single business picture.',
    preview: ['Profitability per model', 'Stock ageing analysis', 'Custom KPI builder'],
  },
];

export default function AdvancedPage() {
  return (
    <>
      <PageHeader
        title="Advanced Features"
        description="Modules available in the complete Tamil Motors dealership platform built by PubliqWebb Tech."
        badge={<span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200"><Lock className="h-3 w-3" /> Premium</span>}
      />

      <div className="relative mb-7 overflow-hidden rounded-3xl bg-ink-950 p-7 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="chip bg-white/10 text-white ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" /> Complete System
          </span>
          <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
            You are using the demo version of the Tamil Motors management system
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Sales, customers, employees, inventory, bookings, test drives, payments, revenue and reports are
            fully usable today. The modules below extend the platform with automation, AI analytics and
            multi-branch operations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LockedButton featureKey="generic" label={`Contact ${PUBLIQWEBB.name}`} className="btn bg-white text-ink-900 hover:bg-white/90" />
            <LockedButton featureKey="generic" label="Request Full Demo" className="btn border border-white/25 text-white hover:bg-white/10" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((f) => (
          <AdvancedFeatureCard
            key={f.title}
            icon={f.icon}
            title={f.title}
            description={f.description}
            preview={f.preview}
            featureKey={f.featureKey}
            cta={f.cta}
          />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-ink-200 bg-white p-7 text-center">
        <h3 className="text-xl font-black text-ink-900">Ready to unlock the complete platform?</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-500">
          {PUBLIQWEBB.name} builds customised dealership management platforms with sales, inventory,
          employee management, revenue analytics, CRM, AI automation and WhatsApp integration.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${PUBLIQWEBB.email}?subject=Tamil%20Motors%20-%20Complete%20System`} className="btn-primary">
            {PUBLIQWEBB.email}
          </a>
          <a href={`tel:${PUBLIQWEBB.phone.replace(/\s/g, '')}`} className="btn-outline">{PUBLIQWEBB.phone}</a>
          <span className="btn-ghost pointer-events-none">{PUBLIQWEBB.website}</span>
        </div>
      </div>
    </>
  );
}
