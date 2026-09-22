'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';


export default function Page() {
  const d = useDealership();
  const rows = d.finance;

  return (
    <>
      <PageHeader
        title="Finance"
        description="Two-wheeler loan applications, EMI structures and approval status by financier."
        action={<><ExportButtons /></>}
      />

      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search finance…"
        columns={[
          { key: 'customer', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.customerName}</span>, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'loan', header: 'Loan Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.loanAmount)}</span> },
          { key: 'down', header: 'Down Payment', render: (r) => inr(r.downPayment) },
          { key: 'company', header: 'Finance Company', render: (r) => r.financeCompany, search: (r) => r.financeCompany },
          { key: 'emi', header: 'EMI', render: (r) => inr(r.emi) },
          { key: 'tenure', header: 'Tenure', render: (r) => `${r.tenure} months` },
          { key: 'rate', header: 'Interest Rate', render: (r) => `${r.interestRate}%` },
          { key: 'status', header: 'Approval Status', render: (r) => <StatusChip value={r.status} /> },
        ]}
        filters={[
          { label: 'Status', options: ['Not Applied', 'Applied', 'Documents Pending', 'Under Review', 'Approved', 'Rejected', 'Disbursed'], match: (r, v) => r.status === v },
        ]}
      />
    </>
  );
}
