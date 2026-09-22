'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Bike as BikeIcon, IndianRupee, Wallet, Truck,
  Check, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { useDealership } from '@/components/admin/useDealership';
import { Card, Field, Select, SearchInput, LoadingBlock, Spinner } from '@/components/ui';
import { addSale, computeFinalAmount } from '@/lib/tamil-motors/sales';
import { addCustomer } from '@/lib/tamil-motors/customers';
import { inr, cn } from '@/lib/utils';
import type { Bike, Customer, SaleStatus, PaymentStatus } from '@/types';

const STEPS = [
  { label: 'Customer', icon: User },
  { label: 'Select Bike', icon: BikeIcon },
  { label: 'Pricing', icon: IndianRupee },
  { label: 'Payment', icon: Wallet },
  { label: 'Delivery', icon: Truck },
];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance', 'Partial Payment'];
const SALE_STATUSES: SaleStatus[] = ['Enquiry', 'Quotation', 'Booking', 'Payment Pending', 'Confirmed', 'Delivered'];

export default function NewSalePage() {
  const router = useRouter();
  const d = useDealership();

  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState<'existing' | 'new'>('existing');
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [customerId, setCustomerId] = React.useState('');
  const [newCustomer, setNewCustomer] = React.useState({ name: '', phone: '', email: '', address: '', city: 'Coimbatore' });

  const [bikeSearch, setBikeSearch] = React.useState('');
  const [bikeId, setBikeId] = React.useState('');
  const [color, setColor] = React.useState('');

  const [pricing, setPricing] = React.useState({
    basePrice: 0, accessoriesAmount: 0, discount: 0,
    insuranceAmount: 9000, registrationAmount: 8000,
    financeCharges: 0, otherCharges: 0,
  });

  const [employeeId, setEmployeeId] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState(PAYMENT_METHODS[0]);
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>('paid');
  const [expectedDelivery, setExpectedDelivery] = React.useState(new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10));
  const [saleStatus, setSaleStatus] = React.useState<SaleStatus>('Confirmed');

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [doneCode, setDoneCode] = React.useState('');

  const selectedBike: Bike | undefined = d.bikes.find((b) => b.id === bikeId);
  const selectedCustomer: Customer | undefined = d.customers.find((c) => c.id === customerId);

  React.useEffect(() => {
    if (selectedBike) {
      setPricing((p) => ({ ...p, basePrice: selectedBike.price }));
      setColor((c) => c || selectedBike.colors?.[0] || selectedBike.color);
    }
  }, [selectedBike]);

  React.useEffect(() => {
    if (!employeeId && d.employees.length) {
      setEmployeeId(d.employees.find((e) => e.role.includes('Sales'))?.id ?? d.employees[0].id);
    }
  }, [d.employees, employeeId]);

  const finalAmount = computeFinalAmount(pricing);

  const customerName = mode === 'new' ? newCustomer.name : selectedCustomer?.name ?? '';
  const canContinue = [
    mode === 'new' ? newCustomer.name.trim() !== '' && newCustomer.phone.trim() !== '' : customerId !== '',
    bikeId !== '',
    pricing.basePrice > 0,
    employeeId !== '',
    true,
  ][step];

  async function completeSale() {
    setSaving(true);
    setError('');
    try {
      let finalCustomerId = customerId;
      if (mode === 'new') {
        finalCustomerId = await addCustomer({
          ...newCustomer,
          status: 'customer',
          purchasedBikeId: bikeId,
          assignedEmployeeId: employeeId,
          totalPurchase: finalAmount,
          paymentStatus,
        });
      }
      const employee = d.employees.find((e) => e.id === employeeId);
      const saleCode = `TM-S-${Date.now().toString().slice(-6)}`;
      await addSale({
        saleCode,
        customerId: finalCustomerId,
        customerName,
        bikeId,
        bikeName: selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : '',
        employeeId,
        employeeName: employee?.name ?? '',
        ...pricing,
        finalAmount,
        paymentMethod,
        paymentStatus,
        saleStatus,
        saleDate: new Date().toISOString().slice(0, 10),
        expectedDelivery,
        deliveryStatus: saleStatus === 'Delivered' ? 'Delivered' : 'Scheduled',
      });
      setDoneCode(saleCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the sale.');
      setSaving(false);
    }
  }

  if (d.loading) return (<><PageHeader title="New Sale" description="Loading…" /><LoadingBlock /></>);

  if (doneCode) {
    return (
      <>
        <PageHeader title="New Sale" description="Sale recorded successfully." />
        <Card className="p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-2xl font-black text-ink-900">Sale completed</h2>
          <p className="mt-2 text-sm text-ink-500">
            {doneCode} · {customerName} · {selectedBike?.brand} {selectedBike?.model}
          </p>
          <p className="mt-1 text-2xl font-black text-ink-900">{inr(finalAmount)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => router.push('/admin/sales')} className="btn-primary">View all sales</button>
            <button onClick={() => window.location.reload()} className="btn-outline">Record another sale</button>
          </div>
        </Card>
      </>
    );
  }

  const filteredCustomers = d.customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 8);
  const filteredBikes = d.bikes.filter((b) =>
    `${b.brand} ${b.model} ${b.variant} ${b.category}`.toLowerCase().includes(bikeSearch.toLowerCase())).slice(0, 8);

  return (
    <>
      <PageHeader title="New Sale" description="Record a sale from customer selection through to delivery." />

      {/* Stepper */}
      <div className="mb-6 overflow-x-auto">
        <ol className="flex min-w-max items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
                  i === step ? 'bg-ink-950 text-white' : i < step ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-ink-400 border border-ink-200',
                )}
              >
                <span className={cn('grid h-6 w-6 place-items-center rounded-lg text-xs', i === step ? 'bg-white/15' : i < step ? 'bg-emerald-100' : 'bg-ink-100')}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 ? <span className="h-px w-6 bg-ink-200" /> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          {/* Step 1 — Customer */}
          {step === 0 ? (
            <div>
              <h2 className="text-lg font-bold text-ink-900">Customer</h2>
              <div className="mt-4 flex gap-2">
                {(['existing', 'new'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn('rounded-xl px-4 py-2 text-sm font-semibold transition',
                      mode === m ? 'bg-brand-600 text-white' : 'border border-ink-200 text-ink-600')}
                  >
                    {m === 'existing' ? 'Existing Customer' : 'New Customer'}
                  </button>
                ))}
              </div>

              {mode === 'existing' ? (
                <div className="mt-5">
                  <SearchInput value={customerSearch} onChange={setCustomerSearch} placeholder="Search by name, phone or email…" />
                  <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                    {filteredCustomers.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => setCustomerId(c.id)}
                          className={cn('w-full rounded-xl border px-4 py-3 text-left transition',
                            customerId === c.id ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:bg-ink-50')}
                        >
                          <p className="text-sm font-bold text-ink-900">{c.name}</p>
                          <p className="text-xs text-ink-500">{c.phone} · {c.city}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><input className="input" value={newCustomer.name} onChange={(e) => setNewCustomer((s) => ({ ...s, name: e.target.value }))} placeholder="Arun Kumar" /></Field>
                  <Field label="Phone"><input className="input" value={newCustomer.phone} onChange={(e) => setNewCustomer((s) => ({ ...s, phone: e.target.value }))} placeholder="+91 98765 43210" /></Field>
                  <Field label="Email"><input className="input" value={newCustomer.email} onChange={(e) => setNewCustomer((s) => ({ ...s, email: e.target.value }))} placeholder="you@example.com" /></Field>
                  <Field label="City"><input className="input" value={newCustomer.city} onChange={(e) => setNewCustomer((s) => ({ ...s, city: e.target.value }))} /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Address"><input className="input" value={newCustomer.address} onChange={(e) => setNewCustomer((s) => ({ ...s, address: e.target.value }))} placeholder="12, Gandhipuram" /></Field>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Step 2 — Bike */}
          {step === 1 ? (
            <div>
              <h2 className="text-lg font-bold text-ink-900">Select Bike</h2>
              <div className="mt-4"><SearchInput value={bikeSearch} onChange={setBikeSearch} placeholder="Search model, brand, variant or category…" /></div>
              <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                {filteredBikes.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => setBikeId(b.id)}
                      className={cn('flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                        bikeId === b.id ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:bg-ink-50')}
                    >
                      <span>
                        <span className="block text-sm font-bold text-ink-900">{b.brand} {b.model}</span>
                        <span className="block text-xs text-ink-500">{b.variant} · {b.category} · {b.stock} in stock</span>
                      </span>
                      <span className="text-sm font-black text-ink-900">{inr(b.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {selectedBike ? (
                <div className="mt-4">
                  <Field label="Colour">
                    <Select ariaLabel="Colour" value={color} onChange={setColor}
                      options={(selectedBike.colors ?? [selectedBike.color]).map((c) => ({ value: c, label: c }))} />
                  </Field>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Step 3 — Pricing */}
          {step === 2 ? (
            <div>
              <h2 className="text-lg font-bold text-ink-900">Pricing</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {([
                  ['basePrice', 'Base Price'], ['accessoriesAmount', 'Accessories'], ['discount', 'Discount'],
                  ['insuranceAmount', 'Insurance'], ['registrationAmount', 'Registration'],
                  ['financeCharges', 'Finance Charges'], ['otherCharges', 'Other Charges'],
                ] as const).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      type="number"
                      className="input"
                      value={pricing[key]}
                      onChange={(e) => setPricing((p) => ({ ...p, [key]: Number(e.target.value) || 0 }))}
                    />
                  </Field>
                ))}
              </div>
            </div>
          ) : null}

          {/* Step 4 — Payment */}
          {step === 3 ? (
            <div>
              <h2 className="text-lg font-bold text-ink-900">Payment</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Payment method">
                  <Select ariaLabel="Payment method" value={paymentMethod} onChange={setPaymentMethod}
                    options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))} />
                </Field>
                <Field label="Payment status">
                  <Select ariaLabel="Payment status" value={paymentStatus} onChange={(v) => setPaymentStatus(v as PaymentStatus)}
                    options={[{ value: 'paid', label: 'Paid' }, { value: 'partial', label: 'Partial' }, { value: 'pending', label: 'Pending' }]} />
                </Field>
                <Field label="Sales employee">
                  <Select ariaLabel="Sales employee" value={employeeId} onChange={setEmployeeId}
                    options={d.employees.map((e) => ({ value: e.id, label: `${e.name} — ${e.role}` }))} />
                </Field>
              </div>
            </div>
          ) : null}

          {/* Step 5 — Delivery */}
          {step === 4 ? (
            <div>
              <h2 className="text-lg font-bold text-ink-900">Delivery</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Expected delivery">
                  <input type="date" className="input" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} />
                </Field>
                <Field label="Sale status">
                  <Select ariaLabel="Sale status" value={saleStatus} onChange={(v) => setSaleStatus(v as SaleStatus)}
                    options={SALE_STATUSES.map((s) => ({ value: s, label: s }))} />
                </Field>
              </div>
              {error ? (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
            <button onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className="btn-outline">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canContinue} className="btn-primary">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={completeSale} disabled={saving} className="btn-primary">
                {saving ? <><Spinner className="h-4 w-4 text-white" /> Saving…</> : 'Complete Sale'}
              </button>
            )}
          </div>
        </Card>

        {/* Summary */}
        <Card className="h-fit p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">Sale summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-ink-500">Customer</dt><dd className="text-right font-semibold text-ink-900">{customerName || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-500">Bike</dt><dd className="text-right font-semibold text-ink-900">{selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-500">Colour</dt><dd className="text-right font-semibold text-ink-900">{color || '—'}</dd></div>
          </dl>

          <dl className="mt-5 space-y-2.5 border-t border-ink-100 pt-5 text-sm">
            {([
              ['Base price', pricing.basePrice], ['Accessories', pricing.accessoriesAmount],
              ['Insurance', pricing.insuranceAmount], ['Registration', pricing.registrationAmount],
              ['Finance charges', pricing.financeCharges], ['Other charges', pricing.otherCharges],
            ] as const).map(([k, v]) => (
              <div key={k} className="flex justify-between"><dt className="text-ink-500">{k}</dt><dd className="font-semibold text-ink-800">{inr(v)}</dd></div>
            ))}
            <div className="flex justify-between"><dt className="text-ink-500">Discount</dt><dd className="font-semibold text-rose-600">-{inr(pricing.discount)}</dd></div>
          </dl>

          <div className="mt-5 flex items-end justify-between border-t border-ink-200 pt-5">
            <span className="text-sm font-bold text-ink-500">Final amount</span>
            <span className="text-2xl font-black text-ink-900">{inr(finalAmount)}</span>
          </div>
        </Card>
      </div>
    </>
  );
}
