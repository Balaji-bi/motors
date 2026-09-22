'use client';

import * as React from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { Modal, Field, Select, Spinner } from '@/components/ui';
import { addInventoryItem, updateInventoryItem } from '@/lib/tamil-motors/inventory';
import type { Bike, InventoryItem, StockStatus } from '@/types';

const STOCK: StockStatus[] = ['Available', 'Reserved', 'Sold', 'In Service', 'Incoming'];
const LOCATIONS = ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'];

const blank = {
  bikeId: '', brand: '', model: '', variant: '', color: '',
  vehicleNumber: '', engineNumber: '', chassisNumber: '',
  purchasePrice: 0, sellingPrice: 0,
  stockStatus: 'Available' as StockStatus,
  location: LOCATIONS[0],
};

export function InventoryForm({
  open, onClose, onSaved, bikes, editing,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  bikes: Bike[];
  editing: InventoryItem | null;
}) {
  const [form, setForm] = React.useState(blank);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    setError('');
    if (editing) {
      const { id, createdAt, ...rest } = editing;
      void id; void createdAt;
      setForm({ ...blank, ...rest });
    } else {
      const first = bikes[0];
      setForm(first
        ? {
            ...blank,
            bikeId: first.id, brand: first.brand, model: first.model,
            variant: first.variant, color: first.colors?.[0] ?? first.color,
            purchasePrice: Math.round(first.price * 0.86), sellingPrice: first.price,
          }
        : blank);
    }
  }, [open, editing, bikes]);

  const selectedBike = bikes.find((b) => b.id === form.bikeId);

  function pickBike(bikeId: string) {
    const b = bikes.find((x) => x.id === bikeId);
    if (!b) return;
    setForm((f) => ({
      ...f,
      bikeId,
      brand: b.brand, model: b.model, variant: b.variant,
      color: b.colors?.[0] ?? b.color,
      purchasePrice: f.purchasePrice || Math.round(b.price * 0.86),
      sellingPrice: f.sellingPrice || b.price,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bikeId || !form.vehicleNumber.trim()) {
      setError('Select a model and enter a vehicle number.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) await updateInventoryItem(editing.id, form);
      else await addInventoryItem(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this unit.');
    } finally {
      setSaving(false);
    }
  }

  const text = (key: keyof typeof form, label: string, placeholder = '') => (
    <Field label={label}>
      <input
        className="input"
        value={String(form[key])}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </Field>
  );

  const number = (key: keyof typeof form, label: string) => (
    <Field label={label}>
      <input
        type="number"
        className="input"
        value={Number(form[key])}
        onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }))}
      />
    </Field>
  );

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <form onSubmit={submit}>
        <div className="border-b border-ink-200 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-black text-ink-900">
            {editing ? `Edit unit ${editing.vehicleNumber}` : 'Add bike to inventory'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {editing ? 'Changes are written to tamilMotors_inventory.' : 'Creates a new physical unit in tamilMotors_inventory.'}
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2">
            <Field label="Model">
              <Select
                ariaLabel="Model"
                value={form.bikeId}
                onChange={pickBike}
                options={bikes.map((b) => ({ value: b.id, label: `${b.brand} ${b.model} — ${b.variant}` }))}
              />
            </Field>
          </div>

          <Field label="Colour">
            <Select
              ariaLabel="Colour"
              value={form.color}
              onChange={(v) => setForm((f) => ({ ...f, color: v }))}
              options={(selectedBike?.colors ?? [form.color].filter(Boolean)).map((c) => ({ value: c, label: c }))}
            />
          </Field>
          {text('vehicleNumber', 'Vehicle number', 'TN 37 AB 1234')}
          {text('engineNumber', 'Engine number', 'ENG123456TM')}
          {text('chassisNumber', 'Chassis number', 'CHS1234567TM')}
          {number('purchasePrice', 'Purchase price')}
          {number('sellingPrice', 'Selling price')}

          <Field label="Stock status">
            <Select
              ariaLabel="Stock status"
              value={form.stockStatus}
              onChange={(v) => setForm((f) => ({ ...f, stockStatus: v as StockStatus }))}
              options={STOCK.map((s) => ({ value: s, label: s }))}
            />
          </Field>
          <Field label="Location">
            <Select
              ariaLabel="Location"
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              options={LOCATIONS.map((l) => ({ value: l, label: l }))}
            />
          </Field>

          {error ? (
            <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink-200 px-6 py-5 sm:px-8">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Spinner className="h-4 w-4 text-white" /> Saving…</> : <><Save className="h-4 w-4" /> {editing ? 'Save changes' : 'Add to inventory'}</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}
