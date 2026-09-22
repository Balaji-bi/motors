'use client';

import * as React from 'react';
import { X, Search, Loader2, Inbox, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------- Card ----------------------------- */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('card', className)}>{children}</div>;
}

export function CardHeader({
  title, subtitle, action, icon: Icon,
}: {
  title: string; subtitle?: string; action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
      <div className="flex items-center gap-3">
        {Icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-4.5 w-4.5" />
          </span>
        ) : null}
        <div>
          <h3 className="text-sm font-bold text-ink-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ---------------------------- Status ---------------------------- */
const TONE: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  blue: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  gray: 'bg-ink-100 text-ink-600 ring-1 ring-ink-200',
};

export type Tone = keyof typeof TONE;

const STATUS_TONE: Record<string, Tone> = {
  // sales / bookings / delivery
  Delivered: 'green', Confirmed: 'green', 'Ready for Delivery': 'blue', Booked: 'blue',
  Booking: 'blue', Quotation: 'violet', Enquiry: 'gray', 'Payment Pending': 'amber',
  Cancelled: 'red', 'No Show': 'red',
  // test drives
  Requested: 'amber', Completed: 'green',
  // payments
  paid: 'green', partial: 'amber', pending: 'amber', Success: 'green', Pending: 'amber', Failed: 'red',
  // finance
  Approved: 'green', Disbursed: 'green', 'Under Review': 'blue', Applied: 'blue',
  'Documents Pending': 'amber', Rejected: 'red', 'Not Applied': 'gray',
  // insurance
  Active: 'green', 'Expiring Soon': 'amber', Expired: 'red',
  // stock
  Available: 'green', available: 'green', Reserved: 'violet', Sold: 'gray',
  'In Service': 'blue', Incoming: 'blue', low_stock: 'amber', out_of_stock: 'red',
  // customers / employees
  customer: 'green', booked: 'blue', interested: 'violet', lead: 'gray',
  active: 'green', inactive: 'gray',
  // priority
  High: 'red', Medium: 'amber', Low: 'gray',
};

const STATUS_LABEL: Record<string, string> = {
  paid: 'Paid', partial: 'Partial', pending: 'Pending',
  available: 'Available', low_stock: 'Low Stock', out_of_stock: 'Out of Stock',
  customer: 'Customer', booked: 'Booked', interested: 'Interested', lead: 'Lead',
  active: 'Active', inactive: 'Inactive',
};

export function StatusChip({ value, className }: { value: string; className?: string }) {
  const tone = STATUS_TONE[value] ?? 'gray';
  return (
    <span className={cn('chip', TONE[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[value] ?? value}
    </span>
  );
}

export function Badge({ children, tone = 'gray', className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return <span className={cn('chip', TONE[tone], className)}>{children}</span>;
}

/* ---------------------------- Inputs ---------------------------- */
export function Field({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function SearchInput({
  value, onChange, placeholder = 'Search…', className,
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        className="input pl-9"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}

export function Select({
  value, onChange, options, className, ariaLabel,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; className?: string; ariaLabel?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        aria-label={ariaLabel}
        className="input appearance-none pr-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
}

/* ---------------------------- Modal ----------------------------- */
export function Modal({
  open, onClose, children, size = 'md',
}: { open: boolean; onClose: () => void; children: React.ReactNode; size?: 'md' | 'lg' }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} aria-label="Close dialog" />
      <div className={cn(
        'relative w-full animate-scale-in overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl',
        size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        'max-h-[92vh] overflow-y-auto',
      )}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
          aria-label="Close"
        >
          <X className="h-4.5 w-4.5" />
        </button>
        {children}
      </div>
    </div>
  );
}

/* --------------------------- Feedback --------------------------- */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-brand-600', className)} />;
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-sm text-ink-500">
      <Spinner /> {label}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-400">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
    </div>
  );
}

/* ---------------------------- Table ----------------------------- */
export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">{children}</table>
      </div>
    </div>
  );
}

export function Thead({ cols }: { cols: string[] }) {
  return (
    <thead className="bg-ink-50/80">
      <tr>{cols.map((c) => <th key={c} className="th">{c}</th>)}</tr>
    </thead>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      className={cn('transition hover:bg-ink-50/70', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('td', className)}>{children}</td>;
}
