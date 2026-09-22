/* Generates the repetitive Tamil Motors admin table modules.
   Run once with:  node scripts/gen-admin-pages.mjs  */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();

function emit(route, source) {
  const file = join(ROOT, 'app', 'admin', route, 'page.tsx');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, source, 'utf8');
  console.log('wrote', file);
}

const page = ({ imports = '', title, description, dataKey, columns, filters = '[]', extra = '', kpis = '', action = '' }) => `'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/admin/AdminShell';
import { DataModule, ExportButtons } from '@/components/admin/DataModule';
import { StatusChip } from '@/components/ui';
import { useDealership } from '@/components/admin/useDealership';
import { inr, fmtDate } from '@/lib/utils';
${imports}

export default function Page() {
  const d = useDealership();
  const rows = d.${dataKey};
${extra}
  return (
    <>
      <PageHeader
        title="${title}"
        description="${description}"
        action={<>${action}<ExportButtons /></>}
      />
${kpis}
      <DataModule
        loading={d.loading}
        rows={rows}
        searchPlaceholder="Search ${title.toLowerCase()}…"
        columns={${columns}}
        filters={${filters}}
      />
    </>
  );
}
`;

/* ------------------------------- Sales -------------------------------- */
const saleColumns = `[
          { key: 'code', header: 'Sale ID', render: (r) => <span className="font-semibold text-ink-900">{r.saleCode}</span>, search: (r) => r.saleCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'employee', header: 'Sales Employee', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'date', header: 'Sale Date', render: (r) => fmtDate(r.saleDate) },
          { key: 'price', header: 'Bike Price', render: (r) => inr(r.basePrice) },
          { key: 'discount', header: 'Discount', render: (r) => r.discount ? <span className="text-rose-600">-{inr(r.discount)}</span> : '—' },
          { key: 'finance', header: 'Finance', render: (r) => r.financeCharges ? inr(r.financeCharges) : '—' },
          { key: 'insurance', header: 'Insurance', render: (r) => inr(r.insuranceAmount) },
          { key: 'final', header: 'Final Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.finalAmount)}</span> },
          { key: 'pay', header: 'Payment', render: (r) => <StatusChip value={r.paymentStatus} /> },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.saleStatus} /> },
        ]`;

const saleFilters = `[
          {
            label: 'Status',
            options: ['Enquiry', 'Quotation', 'Booking', 'Payment Pending', 'Confirmed', 'Delivered', 'Cancelled'],
            match: (r, v) => r.saleStatus === v,
          },
          {
            label: 'Payment',
            options: ['paid', 'partial', 'pending'],
            match: (r, v) => r.paymentStatus === v,
          },
        ]`;

emit('sales', page({
  title: 'All Sales',
  description: 'Every sale recorded across the dealership, from first enquiry through to delivery.',
  dataKey: 'sales',
  columns: saleColumns,
  filters: saleFilters,
  action: `<Link href="/admin/sales/new" className="btn-primary">New Sale</Link>`,
}));

emit('sales/pending', page({
  title: 'Pending Sales',
  description: 'Sales still awaiting payment, confirmation or delivery. These need follow-up from the sales team.',
  dataKey: 'sales',
  extra: `  const pending = rows.filter((s) => ['Enquiry', 'Quotation', 'Booking', 'Payment Pending'].includes(s.saleStatus));
`,
  columns: saleColumns.replace('rows', 'pending'),
  filters: saleFilters,
  action: `<Link href="/admin/sales" className="btn-outline">All sales</Link>`,
}).replace('rows={rows}', 'rows={pending}'));

/* ----------------------------- Customers ------------------------------ */
emit('customers', page({
  title: 'Customers',
  description: 'Every lead, enquiry and buyer in the Tamil Motors pipeline.',
  dataKey: 'customers',
  extra: `  const bikeName = (id) => d.bikes.find((b) => b.id === id);
  const empName = (id) => d.employees.find((e) => e.id === id)?.name ?? '—';
`,
  columns: `[
          { key: 'id', header: 'Customer ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.id.slice(0, 10)}</span>, search: (r) => r.id },
          { key: 'name', header: 'Name', render: (r) => <Link href={\`/admin/customers/\${r.id}\`} className="font-semibold text-ink-900 hover:text-brand-600">{r.name}</Link>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'email', header: 'Email', render: (r) => <span className="text-ink-500">{r.email}</span>, search: (r) => r.email },
          { key: 'interested', header: 'Interested Bike', render: (r) => { const b = bikeName(r.interestedBikeId); return b ? \`\${b.brand} \${b.model}\` : '—'; } },
          { key: 'purchased', header: 'Purchased Bike', render: (r) => { const b = bikeName(r.purchasedBikeId); return b ? \`\${b.brand} \${b.model}\` : '—'; } },
          { key: 'employee', header: 'Sales Employee', render: (r) => empName(r.assignedEmployeeId) },
          { key: 'total', header: 'Total Purchase', render: (r) => r.totalPurchase ? <span className="font-bold text-ink-900">{inr(r.totalPurchase)}</span> : '—' },
          { key: 'pay', header: 'Payment', render: (r) => r.paymentStatus ? <StatusChip value={r.paymentStatus} /> : '—' },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]`,
  filters: `[
          { label: 'Status', options: ['lead', 'interested', 'booked', 'customer'], match: (r, v) => r.status === v },
          { label: 'City', options: ['Coimbatore', 'Tiruppur', 'Erode', 'Pollachi', 'Mettupalayam', 'Sulur', 'Karamadai'], match: (r, v) => r.city === v },
        ]`,
}));

/* ----------------------------- Employees ------------------------------ */
emit('employees', page({
  imports: `import { ProgressBar } from '@/components/admin/Kpi';
import { pct } from '@/lib/utils';`,
  title: 'Employees',
  description: 'Sales executives, managers and support staff, with targets and achievement.',
  dataKey: 'employees',
  columns: `[
          { key: 'id', header: 'Employee ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.id}</span>, search: (r) => r.id },
          { key: 'name', header: 'Name', render: (r) => <Link href={\`/admin/employees/\${r.id}\`} className="font-semibold text-ink-900 hover:text-brand-600">{r.name}</Link>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'role', header: 'Role', render: (r) => r.role, search: (r) => r.role },
          { key: 'joined', header: 'Joining Date', render: (r) => fmtDate(r.joiningDate) },
          { key: 'count', header: 'Sales Count', render: (r) => <span className="font-bold text-ink-900">{r.salesCount}</span> },
          { key: 'revenue', header: 'Revenue Generated', render: (r) => inr(r.revenueGenerated) },
          { key: 'target', header: 'Target', render: (r) => inr(r.monthlyTarget) },
          { key: 'achievement', header: 'Achievement', render: (r) => <div className="w-32"><ProgressBar value={r.monthlySales} max={r.monthlyTarget} label={\`\${pct(r.monthlySales, r.monthlyTarget)}%\`} /></div> },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]`,
  filters: `[
          { label: 'Role', options: ['Sales Executive', 'Sales Manager', 'Accountant', 'Service Advisor', 'Admin'], match: (r, v) => r.role === v },
          { label: 'Status', options: ['active', 'inactive'], match: (r, v) => r.status === v },
        ]`,
}));

/* ----------------------------- Inventory ------------------------------ */
emit('inventory', page({
  title: 'Bike Inventory',
  description: 'Physical stock by vehicle, engine and chassis number across every branch.',
  dataKey: 'inventory',
  columns: `[
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
        ]`,
  filters: `[
          { label: 'Status', options: ['Available', 'Reserved', 'Sold', 'In Service', 'Incoming'], match: (r, v) => r.stockStatus === v },
          { label: 'Brand', options: ['TVS', 'Honda', 'Yamaha', 'Royal Enfield', 'Hero', 'Ola', 'Suzuki', 'Bajaj', 'Ather'], match: (r, v) => r.brand === v },
          { label: 'Location', options: ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'], match: (r, v) => r.location === v },
        ]`,
}));

/* ---------------------------- Test drives ----------------------------- */
emit('test-drives', page({
  title: 'Test Drives',
  description: 'Requests from the public website and the showroom floor, with their current status.',
  dataKey: 'testDrives',
  columns: `[
          { key: 'name', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.name}</span>, search: (r) => r.name },
          { key: 'phone', header: 'Phone', render: (r) => r.phone, search: (r) => r.phone },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'time', header: 'Time', render: (r) => r.time },
          { key: 'employee', header: 'Sales Employee', render: (r) => r.employeeName ?? '—', search: (r) => r.employeeName ?? '' },
          { key: 'location', header: 'Location', render: (r) => r.location, search: (r) => r.location },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
          { key: 'notes', header: 'Notes', render: (r) => <span className="text-ink-500">{r.notes || '—'}</span> },
        ]`,
  filters: `[
          { label: 'Status', options: ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], match: (r, v) => r.status === v },
          { label: 'Location', options: ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'], match: (r, v) => r.location === v },
        ]`,
}));

/* ------------------------------ Bookings ------------------------------ */
emit('bookings', page({
  title: 'Bookings',
  description: 'Confirmed bookings with advance amounts, payment position and delivery status.',
  dataKey: 'bookings',
  columns: `[
          { key: 'code', header: 'Booking ID', render: (r) => <span className="font-semibold text-ink-900">{r.bookingCode}</span>, search: (r) => r.bookingCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'amount', header: 'Booking Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.bookingAmount)}</span> },
          { key: 'date', header: 'Booking Date', render: (r) => fmtDate(r.bookingDate) },
          { key: 'employee', header: 'Sales Executive', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'pay', header: 'Payment Status', render: (r) => <StatusChip value={r.paymentStatus} /> },
          { key: 'delivery', header: 'Delivery Status', render: (r) => <StatusChip value={r.deliveryStatus} /> },
        ]`,
  filters: `[
          { label: 'Delivery', options: ['Booked', 'Payment Pending', 'Ready for Delivery', 'Delivered', 'Cancelled'], match: (r, v) => r.deliveryStatus === v },
          { label: 'Payment', options: ['paid', 'partial', 'pending'], match: (r, v) => r.paymentStatus === v },
        ]`,
}));

/* ------------------------------ Finance ------------------------------- */
emit('finance', page({
  title: 'Finance',
  description: 'Two-wheeler loan applications, EMI structures and approval status by financier.',
  dataKey: 'finance',
  columns: `[
          { key: 'customer', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.customerName}</span>, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'loan', header: 'Loan Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.loanAmount)}</span> },
          { key: 'down', header: 'Down Payment', render: (r) => inr(r.downPayment) },
          { key: 'company', header: 'Finance Company', render: (r) => r.financeCompany, search: (r) => r.financeCompany },
          { key: 'emi', header: 'EMI', render: (r) => inr(r.emi) },
          { key: 'tenure', header: 'Tenure', render: (r) => \`\${r.tenure} months\` },
          { key: 'rate', header: 'Interest Rate', render: (r) => \`\${r.interestRate}%\` },
          { key: 'status', header: 'Approval Status', render: (r) => <StatusChip value={r.status} /> },
        ]`,
  filters: `[
          { label: 'Status', options: ['Not Applied', 'Applied', 'Documents Pending', 'Under Review', 'Approved', 'Rejected', 'Disbursed'], match: (r, v) => r.status === v },
        ]`,
}));

/* ----------------------------- Insurance ------------------------------ */
emit('insurance', page({
  imports: `import { AlertTriangle } from 'lucide-react';
import { daysUntil } from '@/lib/utils';`,
  title: 'Insurance',
  description: 'Policies issued against customer vehicles, with renewal and expiry tracking.',
  dataKey: 'insurance',
  extra: `  const expiring = rows.filter((r) => r.status === 'Expiring Soon').length;
  const expired = rows.filter((r) => r.status === 'Expired').length;
`,
  kpis: `      {expiring + expired > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span><strong>{expiring}</strong> policy(ies) expiring within 30 days and <strong>{expired}</strong> already expired. Contact these customers for renewal.</span>
        </div>
      ) : null}
`,
  columns: `[
          { key: 'customer', header: 'Customer', render: (r) => <span className="font-semibold text-ink-900">{r.customerName}</span>, search: (r) => r.customerName },
          { key: 'bike', header: 'Bike', render: (r) => r.bikeName, search: (r) => r.bikeName },
          { key: 'company', header: 'Insurance Company', render: (r) => r.company, search: (r) => r.company },
          { key: 'policy', header: 'Policy Number', render: (r) => <span className="font-mono text-xs">{r.policyNumber}</span>, search: (r) => r.policyNumber },
          { key: 'start', header: 'Policy Start', render: (r) => fmtDate(r.policyStart) },
          { key: 'expiry', header: 'Policy Expiry', render: (r) => <span className="font-semibold">{fmtDate(r.policyExpiry)}</span> },
          { key: 'days', header: 'Days Left', render: (r) => { const n = daysUntil(r.policyExpiry); return n < 0 ? <span className="text-rose-600">{Math.abs(n)}d overdue</span> : <span>{n}d</span>; } },
          { key: 'premium', header: 'Premium', render: (r) => inr(r.premium) },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]`,
  filters: `[
          { label: 'Status', options: ['Active', 'Expiring Soon', 'Expired'], match: (r, v) => r.status === v },
        ]`,
}));

/* ------------------------------ Payments ------------------------------ */
emit('payments', page({
  title: 'Payments',
  description: 'Every payment collected against a sale, by method and status.',
  dataKey: 'payments',
  columns: `[
          { key: 'code', header: 'Payment ID', render: (r) => <span className="font-semibold text-ink-900">{r.paymentCode}</span>, search: (r) => r.paymentCode },
          { key: 'customer', header: 'Customer', render: (r) => r.customerName, search: (r) => r.customerName },
          { key: 'sale', header: 'Sale ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.saleId}</span>, search: (r) => r.saleId },
          { key: 'amount', header: 'Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.amount)}</span> },
          { key: 'method', header: 'Method', render: (r) => r.method, search: (r) => r.method },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'status', header: 'Status', render: (r) => <StatusChip value={r.status} /> },
        ]`,
  filters: `[
          { label: 'Method', options: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance'], match: (r, v) => r.method === v },
          { label: 'Status', options: ['Success', 'Pending', 'Failed'], match: (r, v) => r.status === v },
        ]`,
}));

/* ------------------------------ Expenses ------------------------------ */
emit('expenses', page({
  imports: `import { KpiCard } from '@/components/admin/Kpi';
import { Receipt, TrendingUp, PiggyBank } from 'lucide-react';
import { revenueTotals } from '@/lib/tamil-motors/revenue';`,
  title: 'Expenses',
  description: 'Operating costs by category, and what they leave behind as profit.',
  dataKey: 'expenses',
  extra: `  const totalExpenses = rows.reduce((t, e) => t + e.amount, 0);
  const revenue = revenueTotals(d.sales).total;
  const profit = revenue - totalExpenses;
`,
  kpis: `      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total Expenses" value={inr(totalExpenses)} icon={Receipt} tone="amber" hint={\`\${rows.length} entries\`} />
        <KpiCard label="Net Revenue" value={inr(revenue)} icon={TrendingUp} tone="blue" hint="Confirmed sales" />
        <KpiCard label="Profit Estimate" value={inr(profit)} icon={PiggyBank} tone={profit >= 0 ? 'green' : 'brand'} hint="Revenue less expenses" />
      </div>
`,
  columns: `[
          { key: 'title', header: 'Expense', render: (r) => <span className="font-semibold text-ink-900">{r.title}</span>, search: (r) => r.title },
          { key: 'category', header: 'Category', render: (r) => <span className="chip bg-ink-100 text-ink-600">{r.category}</span>, search: (r) => r.category },
          { key: 'amount', header: 'Amount', render: (r) => <span className="font-bold text-ink-900">{inr(r.amount)}</span> },
          { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
          { key: 'employee', header: 'Employee', render: (r) => r.employeeName, search: (r) => r.employeeName },
          { key: 'description', header: 'Description', render: (r) => <span className="text-ink-500">{r.description}</span>, search: (r) => r.description },
        ]`,
  filters: `[
          { label: 'Category', options: ['Rent', 'Salary', 'Electricity', 'Marketing', 'Maintenance', 'Transport', 'Office', 'Other'], match: (r, v) => r.category === v },
        ]`,
}));

console.log('done');
