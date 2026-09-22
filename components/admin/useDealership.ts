'use client';

import * as React from 'react';
import { getBikes } from '@/lib/tamil-motors/bikes';
import { getCustomers } from '@/lib/tamil-motors/customers';
import { getEmployees } from '@/lib/tamil-motors/employees';
import { getSales } from '@/lib/tamil-motors/sales';
import { getInventory } from '@/lib/tamil-motors/inventory';
import { getBookings } from '@/lib/tamil-motors/bookings';
import { getTestDrives } from '@/lib/tamil-motors/testDrives';
import {
  getPayments, getExpenses, getFinanceApplications,
  getInsuranceRecords, getNotifications, getFollowUps,
} from '@/lib/tamil-motors/payments';
import type {
  Bike, Booking, Customer, Employee, Expense, FinanceApplication,
  FollowUp, InsuranceRecord, InventoryItem, Notification, Payment, Sale, TestDrive,
} from '@/types';

export type Dealership = {
  bikes: Bike[]; customers: Customer[]; employees: Employee[]; sales: Sale[];
  inventory: InventoryItem[]; bookings: Booking[]; testDrives: TestDrive[];
  payments: Payment[]; expenses: Expense[]; finance: FinanceApplication[];
  insurance: InsuranceRecord[]; notifications: Notification[]; followups: FollowUp[];
};

const EMPTY: Dealership = {
  bikes: [], customers: [], employees: [], sales: [], inventory: [], bookings: [],
  testDrives: [], payments: [], expenses: [], finance: [], insurance: [],
  notifications: [], followups: [],
};

/** Loads every Tamil Motors collection once for the admin modules. */
export function useDealership() {
  const [data, setData] = React.useState<Dealership>(EMPTY);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const [
        bikes, customers, employees, sales, inventory, bookings,
        testDrives, payments, expenses, finance, insurance, notifications, followups,
      ] = await Promise.all([
        getBikes(), getCustomers(), getEmployees(), getSales(), getInventory(), getBookings(),
        getTestDrives(), getPayments(), getExpenses(), getFinanceApplications(),
        getInsuranceRecords(), getNotifications(), getFollowUps(),
      ]);
      if (cancelled) return;
      setData({
        bikes, customers, employees, sales, inventory, bookings, testDrives,
        payments, expenses, finance, insurance, notifications, followups,
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading };
}
