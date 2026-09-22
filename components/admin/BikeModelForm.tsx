'use client';

import * as React from 'react';
import { AlertCircle, Save, ImageIcon, Upload } from 'lucide-react';
import { Modal, Field, Select, Spinner } from '@/components/ui';
import { BikeVisual } from '@/components/public/BikeCard';
import { updateBike, addBike, stockStatus } from '@/lib/tamil-motors/bikes';
import { uploadFile } from '@/lib/firebase/storage';
import { slugify } from '@/lib/utils';
import type { Bike, BikeCategory } from '@/types';

const CATEGORIES: BikeCategory[] = ['Commuter', 'Scooter', 'Sports', 'Premium', 'Electric'];

export function BikeModelForm({
  open, onClose, onSaved, editing,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing: Bike | null;
}) {
  const [form, setForm] = React.useState<Partial<Bike>>({});
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    setError('');
    setNotice('');
    setForm(editing ?? {
      brand: '', model: '', variant: '', category: 'Commuter',
      price: 0, engine: '', fuelType: 'Petrol', transmission: '',
      mileage: '', color: '', colors: [], stock: 0, imageUrl: '',
    });
  }, [open, editing]);

  const preview = {
    ...(editing ?? {}),
    ...form,
    id: editing?.id ?? 'preview',
    slug: form.slug ?? slugify(`${form.brand ?? ''} ${form.model ?? ''}`),
    status: stockStatus(Number(form.stock ?? 0)),
  } as Bike;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setNotice('');
    try {
      const url = await uploadFile(`bikes/${Date.now()}-${file.name}`, file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setNotice('Image uploaded to Firebase Storage.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        /bucket|not found|404/i.test(msg)
          ? 'Firebase Storage is not enabled on this project yet. Paste a hosted image URL below instead, or enable Storage in the Firebase console.'
          : `Upload failed: ${msg}`,
      );
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand?.trim() || !form.model?.trim()) {
      setError('Brand and model are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        slug: slugify(`${form.brand} ${form.model}`),
        price: Number(form.price ?? 0),
        stock: Number(form.stock ?? 0),
      };
      if (editing) await updateBike(editing.id, payload);
      else await addBike(payload as Omit<Bike, 'id'>);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this model.');
    } finally {
      setSaving(false);
    }
  }

  const text = (key: keyof Bike, label: string, placeholder = '') => (
    <Field label={label}>
      <input
        className="input"
        value={String(form[key] ?? '')}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </Field>
  );

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <form onSubmit={submit}>
        <div className="border-b border-ink-200 px-6 py-5 sm:px-8">
          <h2 className="text-lg font-black text-ink-900">
            {editing ? `Edit ${editing.brand} ${editing.model}` : 'Add bike model'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Model details drive the public catalog and the New Sale pricing step.
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {text('brand', 'Brand', 'TVS')}
            {text('model', 'Model', 'Raider 125')}
            {text('variant', 'Variant', 'Disc SmartXonnect')}
            <Field label="Category">
              <Select
                ariaLabel="Category"
                value={String(form.category ?? 'Commuter')}
                onChange={(v) => setForm((f) => ({ ...f, category: v as BikeCategory }))}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </Field>
            <Field label="Price (₹)">
              <input type="number" className="input" value={Number(form.price ?? 0)}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))} />
            </Field>
            <Field label="Stock" hint="0 = out of stock, 1–3 = low stock">
              <input type="number" className="input" value={Number(form.stock ?? 0)}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))} />
            </Field>
            {text('engine', 'Engine', '124.8cc')}
            {text('mileage', 'Mileage', '67 kmpl')}
            {text('fuelType', 'Fuel type', 'Petrol')}
            {text('transmission', 'Transmission', '5-Speed Manual')}

            <div className="sm:col-span-2">
              <Field
                label="Image URL"
                hint="Paste a hosted photo URL, or upload one once Firebase Storage is enabled. Leave blank to use the designed gradient card."
              >
                <input
                  className="input"
                  value={String(form.imageUrl ?? '')}
                  placeholder="https://…/raider-125.jpg"
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                />
              </Field>
              <label className="btn-outline mt-3 cursor-pointer text-xs">
                {uploading ? <><Spinner className="h-3.5 w-3.5" /> Uploading…</> : <><Upload className="h-3.5 w-3.5" /> Upload image</>}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
              </label>
            </div>

            {notice ? (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:col-span-2">{notice}</p>
            ) : null}
            {error ? (
              <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            ) : null}
          </div>

          <div>
            <p className="label flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Card preview</p>
            <BikeVisual bike={preview} className="h-56 rounded-2xl" />
            <p className="mt-3 text-xs text-ink-400">
              This is exactly how the model appears on /bikes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink-200 px-6 py-5 sm:px-8">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Spinner className="h-4 w-4 text-white" /> Saving…</> : <><Save className="h-4 w-4" /> {editing ? 'Save changes' : 'Add model'}</>}
          </button>
        </div>
      </form>
    </Modal>
  );
}
