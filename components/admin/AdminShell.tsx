'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import {
  LayoutDashboard, ShoppingCart, Users, UserCog, Bike, CalendarCheck,
  ClipboardList, BadgeIndianRupee, ShieldCheck, Wallet, Receipt,
  TrendingUp, FileBarChart, Bell, Sparkles, Settings, Menu, X,
  LogOut, ChevronDown, Search, Lock,
} from 'lucide-react';
import { cn, initials } from '@/lib/utils';
import { watchAuth, logOut, resolveRole } from '@/lib/firebase/auth';
import { Spinner } from '@/components/ui';
import type { Role } from '@/types';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; roles?: Role[] };
type NavGroup = { heading: string; items: NavItem[] };

const ALL: Role[] = ['admin', 'manager', 'sales', 'accountant'];
const MGMT: Role[] = ['admin', 'manager'];
const MONEY: Role[] = ['admin', 'manager', 'accountant'];

export const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Overview',
    items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ALL }],
  },
  {
    heading: 'Sales',
    items: [
      { href: '/admin/sales', label: 'All Sales', icon: ShoppingCart, roles: ALL },
      { href: '/admin/sales/new', label: 'New Sale', icon: ClipboardList, roles: ALL },
      { href: '/admin/sales/pending', label: 'Pending Sales', icon: Receipt, roles: ALL },
    ],
  },
  {
    heading: 'Relationships',
    items: [
      { href: '/admin/customers', label: 'Customers', icon: Users, roles: ALL },
      { href: '/admin/employees', label: 'Employees', icon: UserCog, roles: MGMT },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { href: '/admin/inventory', label: 'Bike Inventory', icon: Bike, roles: ALL },
      { href: '/admin/test-drives', label: 'Test Drives', icon: CalendarCheck, roles: ALL },
      { href: '/admin/bookings', label: 'Bookings', icon: ClipboardList, roles: ALL },
    ],
  },
  {
    heading: 'Finance',
    items: [
      { href: '/admin/finance', label: 'Finance', icon: BadgeIndianRupee, roles: MONEY },
      { href: '/admin/insurance', label: 'Insurance', icon: ShieldCheck, roles: MONEY },
      { href: '/admin/payments', label: 'Payments', icon: Wallet, roles: MONEY },
      { href: '/admin/expenses', label: 'Expenses', icon: Receipt, roles: MONEY },
      { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp, roles: MGMT },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { href: '/admin/reports', label: 'Reports', icon: FileBarChart, roles: MONEY },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, roles: ALL },
      { href: '/admin/advanced', label: 'Advanced Features', icon: Sparkles, roles: ALL },
      { href: '/admin/settings', label: 'Settings', icon: Settings, roles: MGMT },
    ],
  },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrator',
  manager: 'Sales Manager',
  sales: 'Sales Executive',
  accountant: 'Accountant',
  customer: 'Customer',
};

/* --------------------------- session context --------------------------- */
type Session = { user: User; role: Role };
const SessionContext = React.createContext<Session | null>(null);
export function useSession() {
  return React.useContext(SessionContext);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = React.useState<Session | null>(null);
  const [checking, setChecking] = React.useState(true);
  const [drawer, setDrawer] = React.useState(false);
  const [menu, setMenu] = React.useState(false);

  React.useEffect(() => {
    return watchAuth(async (user) => {
      if (!user) {
        setSession(null);
        setChecking(false);
        router.replace('/admin/login');
        return;
      }
      const role = await resolveRole(user);
      if (role === 'customer') {
        setSession(null);
        setChecking(false);
        router.replace('/customer/dashboard');
        return;
      }
      setSession({ user, role });
      setChecking(false);
    });
  }, [router]);

  React.useEffect(() => { setDrawer(false); setMenu(false); }, [pathname]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-7 w-7" />
          <p className="text-sm font-semibold text-ink-500">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-6 text-center">
        <div>
          <Lock className="mx-auto h-8 w-8 text-ink-400" />
          <p className="mt-4 text-sm font-semibold text-ink-700">Redirecting you to sign in…</p>
          <Link href="/admin/login" className="btn-primary mt-5">Go to login</Link>
        </div>
      </div>
    );
  }

  const { user, role } = session;
  const groups = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || i.roles.includes(role)) }))
    .filter((g) => g.items.length);

  const displayName = user.displayName || user.email?.split('@')[0] || 'Team member';

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-950 text-white">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600">
          <Bike className="h-4.5 w-4.5" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-black">Tamil Motors</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
            Management
          </span>
        </span>
        <button
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 lg:hidden"
          onClick={() => setDrawer(false)}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                  || (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`)
                      && !(item.href === '/admin/sales' && (pathname === '/admin/sales/new' || pathname === '/admin/sales/pending')));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                        active ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30' : 'text-white/60 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">Powered by</p>
        <p className="mt-1 text-sm font-bold text-white/80">PubliqWebb Tech</p>
      </div>
    </div>
  );

  return (
    <SessionContext.Provider value={session}>
      <div className="min-h-screen bg-ink-50">
        {/* desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

        {/* mobile drawer */}
        {drawer ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-label="Close navigation" />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-fade-up">{sidebar}</div>
          </div>
        ) : null}

        <div className="lg:pl-64">
          {/* topbar */}
          <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-200 text-ink-600 lg:hidden"
                onClick={() => setDrawer(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative hidden min-w-0 flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  className="input max-w-md pl-9"
                  placeholder="Search customers, sales, bikes…"
                  aria-label="Global search"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/admin/notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-600 transition hover:bg-ink-50"
                  aria-label="Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setMenu((v) => !v)}
                    className="flex items-center gap-2.5 rounded-xl border border-ink-200 py-1.5 pl-1.5 pr-2.5 transition hover:bg-ink-50"
                    aria-expanded={menu}
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-xs font-bold text-white">
                      {initials(displayName)}
                    </span>
                    <span className="hidden text-left leading-tight sm:block">
                      <span className="block max-w-[10rem] truncate text-xs font-bold text-ink-900">{displayName}</span>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                        {ROLE_LABEL[role]}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-ink-400" />
                  </button>

                  {menu ? (
                    <div className="absolute right-0 top-full z-50 mt-2 w-60 animate-scale-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xl">
                      <div className="border-b border-ink-100 px-4 py-3">
                        <p className="truncate text-sm font-bold text-ink-900">{displayName}</p>
                        <p className="truncate text-xs text-ink-500">{user.email}</p>
                      </div>
                      <Link href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <Link href="/" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
                        <Bike className="h-4 w-4" /> View public site
                      </Link>
                      <button
                        onClick={async () => { await logOut(); router.replace('/admin/login'); }}
                        className="flex w-full items-center gap-2.5 border-t border-ink-100 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}

/* ----------------------------- page header ----------------------------- */
export function PageHeader({
  title, description, action, badge,
}: { title: string; description?: string; action?: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-black tracking-tight text-ink-900">{title}</h1>
          {badge}
        </div>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-ink-500">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
