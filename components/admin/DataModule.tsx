'use client';

import * as React from 'react';
import { Download, Printer, FileSpreadsheet } from 'lucide-react';
import { SearchInput, Select, StatusChip, TableShell, Thead, Tbody, Tr, Td, EmptyState, LoadingBlock } from '@/components/ui';
import { useLockedFeature } from '@/components/modals/LockedFeature';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** value used for free-text search */
  search?: (row: T) => string;
};

export type FilterDef<T> = {
  label: string;
  options: string[];
  match: (row: T, value: string) => boolean;
};

/** Export buttons are a premium module in the demo — they open the upsell modal. */
export function ExportButtons() {
  const { open } = useLockedFeature();
  return (
    <>
      <button className="btn-outline" onClick={() => open('export')}>
        <Download className="h-4 w-4" /> Export PDF
      </button>
      <button className="btn-outline" onClick={() => open('export')}>
        <FileSpreadsheet className="h-4 w-4" /> Export Excel
      </button>
      <button className="btn-ghost" onClick={() => open('export')}>
        <Printer className="h-4 w-4" /> Print
      </button>
    </>
  );
}

export function DataModule<T extends { id: string }>({
  rows, columns, filters = [], searchPlaceholder = 'Search…',
  loading = false, emptyTitle = 'Nothing here yet', emptyMessage = 'Records will appear here once they are added.',
  onRowClick, footer,
}: {
  rows: T[];
  columns: Column<T>[];
  filters?: FilterDef<T>[];
  searchPlaceholder?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  footer?: React.ReactNode;
}) {
  const [search, setSearch] = React.useState('');
  const [active, setActive] = React.useState<Record<string, string>>({});
  const [page, setPage] = React.useState(1);
  const perPage = 15;

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !q || columns.some((c) => (c.search?.(row) ?? '').toLowerCase().includes(q));
      const matchesFilters = filters.every((f) => {
        const value = active[f.label];
        return !value || value === 'All' || f.match(row, value);
      });
      return matchesSearch && matchesFilters;
    });
  }, [rows, columns, filters, search, active]);

  React.useEffect(() => { setPage(1); }, [search, active]);

  const pages = Math.max(Math.ceil(filtered.length / perPage), 1);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <LoadingBlock />;

  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-2xl border border-ink-200 bg-white p-4 lg:grid-cols-[1fr_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder} />
        {filters.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
            {filters.map((f) => (
              <Select
                key={f.label}
                ariaLabel={f.label}
                className="lg:w-44"
                value={active[f.label] ?? 'All'}
                onChange={(v) => setActive((s) => ({ ...s, [f.label]: v }))}
                options={['All', ...f.options].map((o) => ({
                  value: o,
                  label: o === 'All' ? `All ${f.label.toLowerCase()}` : o,
                }))}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-500">
        <span>
          Showing <strong className="text-ink-900">{visible.length}</strong> of {filtered.length} record(s)
        </span>
        {footer}
      </div>

      {filtered.length ? (
        <>
          <TableShell>
            <Thead cols={columns.map((c) => c.header)} />
            <Tbody>
              {visible.map((row) => (
                <Tr key={row.id} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {columns.map((c) => <Td key={c.key}>{c.render(row)}</Td>)}
                </Tr>
              ))}
            </Tbody>
          </TableShell>

          {pages > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <button className="btn-outline py-2 text-xs" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span className="text-xs font-semibold text-ink-500">Page {page} of {pages}</span>
              <button className="btn-outline py-2 text-xs" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="card"><EmptyState title={emptyTitle} message={emptyMessage} /></div>
      )}
    </div>
  );
}

export { StatusChip };
