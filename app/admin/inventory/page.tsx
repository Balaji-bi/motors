'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, Bike as BikeIcon, PackageCheck, PackageX, Bookmark } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { InlineStatus } from '@/components/admin/InlineStatus';
import { InventoryForm } from '@/components/admin/InventoryForm';
import { BikeModelForm } from '@/components/admin/BikeModelForm';
import { KpiCard } from '@/components/admin/Kpi';
import { useDealership } from '@/components/admin/useDealership';
import { StatusChip } from '@/components/ui';
import { setStockStatus, deleteInventoryItem } from '@/lib/tamil-motors/inventory';
import { updateBike, deleteBike } from '@/lib/tamil-motors/bikes';
import { inr, cn } from '@/lib/utils';
import type { Bike, InventoryItem, StockStatus } from '@/types';

const STOCK: readonly StockStatus[] = ['Available', 'Reserved', 'Sold', 'In Service', 'Incoming'];
const LOCATIONS = ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'];

export default function InventoryPage() {
  const d = useDealership();
  const [view, setView] = React.useState<'units' | 'models'>('units');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<InventoryItem | null>(null);
  const [modelOpen, setModelOpen] = React.useState(false);
  const [editingModel, setEditingModel] = React.useState<Bike | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const rows = d.inventory;
  const available = rows.filter((i) => i.stockStatus === 'Available').length;
  const reserved = rows.filter((i) => i.stockStatus === 'Reserved').length;
  const sold = rows.filter((i) => i.stockStatus === 'Sold').length;
  const brands = Array.from(new Set(rows.map((r) => r.brand))).sort();

  function openNew() { setEditing(null); setFormOpen(true); }
  function openEdit(row: InventoryItem) { setEditing(row); setFormOpen(true); }

  async function quickSet(row: InventoryItem, status: StockStatus) {
    setBusy(row.id);
    try {
      await setStockStatus(row.id, status);
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not update stock status.');
    } finally {
      setBusy(null);
    }
  }

  async function remove(row: InventoryItem) {
    if (!window.confirm(`Remove unit ${row.vehicleNumber} (${row.brand} ${row.model}) from inventory?`)) return;
    setBusy(row.id);
    try {
      await deleteInventoryItem(row.id);
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete this unit.');
    } finally {
      setBusy(null);
    }
  }

  async function adjustStock(bike: Bike, delta: number) {
    const next = Math.max(bike.stock + delta, 0);
    setBusy(bike.id);
    try {
      await updateBike(bike.id, { stock: next });
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not update stock.');
    } finally {
      setBusy(null);
    }
  }

  async function removeModel(bike: Bike) {
    if (!window.confirm(`Delete the ${bike.brand} ${bike.model} model? It will disappear from the public catalog.`)) return;
    setBusy(bike.id);
    try {
      await deleteBike(bike.id);
      d.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete this model.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Bike Inventory"
        description="Physical stock by vehicle, engine and chassis number. Add units, edit details and move stock — every change writes to Firestore."
        action={
          <>
            {view === 'units' ? (
              <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add Bike</button>
            ) : (
              <button onClick={() => { setEditingModel(null); setModelOpen(true); }} className="btn-primary">
                <Plus className="h-4 w-4" /> Add Model
              </button>
            )}
            <ExportButtons />
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {([['units', 'Physical Units'], ['models', 'Bike Models']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={cn('rounded-full px-4 py-2 text-sm font-semibold transition',
              view === key ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:text-ink-900')}
          >
            {label}
            <span className="ml-2 text-xs opacity-60">{key === 'units' ? rows.length : d.bikes.length}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Units" value={String(rows.length)} icon={BikeIcon} tone="ink" />
        <KpiCard label="Available" value={String(available)} icon={PackageCheck} tone="green" />
        <KpiCard label="Reserved" value={String(reserved)} icon={Bookmark} tone="violet" />
        <KpiCard label="Sold" value={String(sold)} icon={PackageX} tone="amber" />
      </div>

      {view === 'models' ? (
        <DataModule<Bike>
          loading={d.loading}
          rows={d.bikes}
          searchPlaceholder="Search brand, model, variant or category…"
          columns={[
            { key: 'brand', header: 'Brand', render: (r) => r.brand, search: (r) => r.brand },
            { key: 'model', header: 'Model', render: (r) => <span className="font-semibold text-ink-900">{r.model}</span>, search: (r) => r.model },
            { key: 'variant', header: 'Variant', render: (r) => r.variant, search: (r) => r.variant },
            { key: 'category', header: 'Category', render: (r) => <span className="chip bg-ink-100 text-ink-600">{r.category}</span>, search: (r) => r.category },
            { key: 'price', header: 'Price', render: (r) => <span className="font-bold text-ink-900">{inr(r.price)}</span> },
            { key: 'engine', header: 'Engine', render: (r) => r.engine },
            { key: 'mileage', header: 'Mileage', render: (r) => r.mileage },
            {
              key: 'stock',
              header: 'Stock',
              render: (r) => (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => adjustStock(r, -1)} disabled={busy === r.id || r.stock === 0}
                    className="grid h-6 w-6 place-items-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                    aria-label={`Decrease stock for ${r.model}`}>−</button>
                  <span className="w-7 text-center text-sm font-bold text-ink-900">{r.stock}</span>
                  <button onClick={() => adjustStock(r, 1)} disabled={busy === r.id}
                    className="grid h-6 w-6 place-items-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-100 disabled:opacity-40"
                    aria-label={`Increase stock for ${r.model}`}>+</button>
                </div>
              ),
            },
            { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
            {
              key: 'image',
              header: 'Image',
              render: (r) => r.imageUrl
                ? <span className="chip bg-emerald-50 text-emerald-700">Photo set</span>
                : <span className="chip bg-ink-100 text-ink-500">Gradient card</span>,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (r) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setEditingModel(r); setModelOpen(true); }}
                    className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
                    aria-label={`Edit ${r.model}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeModel(r)} disabled={busy === r.id}
                    className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    aria-label={`Delete ${r.model}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          filters={[
            { label: 'Category', options: ['Commuter', 'Scooter', 'Sports', 'Premium', 'Electric'], match: (r, v) => r.category === v },
            { label: 'Brand', options: Array.from(new Set(d.bikes.map((b) => b.brand))).sort(), match: (r, v) => r.brand === v },
            { label: 'Status', options: ['available', 'low_stock', 'out_of_stock'], match: (r, v) => r.status === v },
          ]}
        />
      ) : (
      <DataModule<InventoryItem>
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search model, vehicle, engine or chassis number…"
        columns={[
          { key: 'id', header: 'Bike ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.id}</span>, search: (r) => r.id },
          { key: 'brand', header: 'Brand', render: (r) => r.brand, search: (r) => r.brand },
          { key: 'model', header: 'Model', render: (r) => <span className="font-semibold text-ink-900">{r.model}</span>, search: (r) => r.model },
          { key: 'variant', header: 'Variant', render: (r) => r.variant, search: (r) => r.variant },
          { key: 'color', header: 'Color', render: (r) => r.color, search: (r) => r.color },
          { key: 'vehicle', header: 'Vehicle Number', render: (r) => <span className="font-mono text-xs">{r.vehicleNumber}</span>, search: (r) => r.vehicleNumber },
          { key: 'engine', header: 'Engine Number', render: (r) => <span className="font-mono text-xs text-ink-500">{r.engineNumber}</span>, search: (r) => r.engineNumber },
          { key: 'chassis', header: 'Chassis Number', render: (r) => <span className="font-mono text-xs text-ink-500">{r.chassisNumber}</span>, search: (r) => r.chassisNumber },
          { key: 'purchase', header: 'Purchase Price', render: (r) => inr(r.purchasePrice) },
          { key: 'selling', header: 'Selling Price', render: (r) => <span className="font-bold text-ink-900">{inr(r.sellingPrice)}</span> },
          {
            key: 'status',
            header: 'Stock Status',
            render: (r) => (
              <InlineStatus<StockStatus>
                ariaLabel={`Stock status for ${r.vehicleNumber}`}
                value={r.stockStatus}
                options={STOCK}
                onSave={async (next) => { await setStockStatus(r.id, next); }}
              />
            ),
          },
          { key: 'chip', header: 'Current', render: (r) => <StatusChip value={r.stockStatus} /> },
          { key: 'location', header: 'Location', render: (r) => r.location, search: (r) => r.location },
          {
            key: 'actions',
            header: 'Actions',
            render: (r) => (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => quickSet(r, 'Reserved')}
                  disabled={busy === r.id || r.stockStatus === 'Reserved'}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-40"
                >
                  Reserve
                </button>
                <button
                  onClick={() => quickSet(r, 'Sold')}
                  disabled={busy === r.id || r.stockStatus === 'Sold'}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-40"
                >
                  Mark Sold
                </button>
                <button
                  onClick={() => openEdit(r)}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
                  aria-label={`Edit ${r.vehicleNumber}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(r)}
                  disabled={busy === r.id}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  aria-label={`Delete ${r.vehicleNumber}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        filters={[
          { label: 'Status', options: [...STOCK], match: (r, v) => r.stockStatus === v },
          { label: 'Brand', options: brands, match: (r, v) => r.brand === v },
          { label: 'Location', options: LOCATIONS, match: (r, v) => r.location === v },
        ]}
      />
      )}

      <InventoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={d.refresh}
        bikes={d.bikes}
        editing={editing}
      />

      <BikeModelForm
        open={modelOpen}
        onClose={() => setModelOpen(false)}
        onSaved={d.refresh}
        editing={editingModel}
      />
    </>
  );
}
