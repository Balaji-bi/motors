'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  ink: 'bg-ink-100 text-ink-700',
};

export function KpiCard({
  label, value, hint, icon: Icon, tone = 'brand', delta,
}: {
  label: string; value: string; hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: keyof typeof TONES;
  delta?: number;
}) {
  return (
    <div className="card p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', TONES[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        {delta !== undefined ? (
          <span className={cn(
            'chip',
            delta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
          )}>
            {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

export function MiniStat({ label, value, tone = 'ink' }: { label: string; value: string | number; tone?: keyof typeof TONES }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      <p className={cn('mt-1 text-lg font-black', tone === 'ink' ? 'text-ink-900' : '')}>{value}</p>
    </div>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pctValue = max ? Math.min(Math.round((value / max) * 100), 130) : 0;
  return (
    <div>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-600">{label}</span>
          <span className="font-black text-ink-900">{pctValue}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-ink-100">
        <div
          className={cn('h-full rounded-full transition-all', pctValue >= 100 ? 'bg-emerald-500' : pctValue >= 60 ? 'bg-brand-600' : 'bg-amber-500')}
          style={{ width: `${Math.min(pctValue, 100)}%` }}
        />
      </div>
    </div>
  );
}
