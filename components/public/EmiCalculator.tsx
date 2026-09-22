'use client';

import * as React from 'react';
import { Calculator } from 'lucide-react';
import { inr } from '@/lib/utils';

export function EmiCalculator() {
  const [price, setPrice] = React.useState(130000);
  const [down, setDown] = React.useState(25000);
  const [tenure, setTenure] = React.useState(24);
  const [rate, setRate] = React.useState(11.5);

  const principal = Math.max(price - down, 0);
  const monthlyRate = rate / 12 / 100;
  const emi = principal && monthlyRate
    ? Math.round((principal * monthlyRate * (1 + monthlyRate) ** tenure) / ((1 + monthlyRate) ** tenure - 1))
    : 0;
  const totalPayable = emi * tenure;
  const interest = Math.max(totalPayable - principal, 0);

  const sliders = [
    { label: 'Bike price', value: price, set: setPrice, min: 50000, max: 350000, step: 5000, fmt: inr },
    { label: 'Down payment', value: down, set: setDown, min: 0, max: Math.max(price - 10000, 10000), step: 5000, fmt: inr },
    { label: 'Tenure (months)', value: tenure, set: setTenure, min: 6, max: 60, step: 6, fmt: (v: number) => `${v} months` },
    { label: 'Interest rate (p.a.)', value: rate, set: setRate, min: 7, max: 20, step: 0.5, fmt: (v: number) => `${v}%` },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-ink-200 px-6 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-ink-900">EMI Calculator</h2>
          <p className="text-xs text-ink-500">Indicative demo figures — not a loan offer.</p>
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          {sliders.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between">
                <label htmlFor={s.label} className="text-sm font-semibold text-ink-700">{s.label}</label>
                <span className="text-sm font-black text-ink-900">{s.fmt(s.value)}</span>
              </div>
              <input
                id={s.label}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-brand-600"
              />
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-ink-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Estimated monthly EMI</p>
          <p className="mt-2 text-4xl font-black">{inr(emi)}</p>

          <dl className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
            {[
              ['Loan amount', inr(principal)],
              ['Total interest', inr(interest)],
              ['Total payable', inr(totalPayable)],
              ['Tenure', `${tenure} months`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <dt className="text-white/60">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-white/50">
            Calculated on a reducing-balance basis for demonstration only. Actual EMI, rate and eligibility
            are decided by the financier.
          </p>
        </div>
      </div>
    </div>
  );
}
