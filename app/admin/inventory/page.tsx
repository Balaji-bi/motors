'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.inventory;

  return (
    <>
      <PageHeader
        title="Bike Inventory"
        description="Physical stock by vehicle, engine and chassis number across every branch."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search bike inventory…"
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
          { key: 'status', header: 'Stock Status', render: (r) => <StatusChip value={r.stockStatus} /> },
          { key: 'location', header: 'Location', render: (r) => r.location, search: (r) => r.location },
        ]}
        filters={[
          { label: 'Status', options: ['Available', 'Reserved', 'Sold', 'In Service', 'Incoming'], match: (r, v) => r.stockStatus === v },
          { label: 'Brand', options: ['TVS', 'Honda', 'Yamaha', 'Royal Enfield', 'Hero', 'Ola', 'Suzuki', 'Bajaj', 'Ather'], match: (r, v) => r.brand === v },
          { label: 'Location', options: ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'], match: (r, v) => r.location === v },
        ]}
      />
    </>
  );
}
