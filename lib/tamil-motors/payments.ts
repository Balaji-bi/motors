'use client';

import { TM, createDoc, patchDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { Payment, Expense, FinanceApplication, InsuranceRecord, Notification, FollowUp } from '@/types';

const demo = () => buildDemoDataset();

export async function getPayments() {
  return readWithFallback<Payment>(TM.payments, demo().payments);
}

export async function getExpenses() {
  return readWithFallback<Expense>(TM.expenses, demo().expenses);
}

export async function getFinanceApplications() {
  return readWithFallback<FinanceApplication>(TM.finance, demo().finance);
}

export async function getInsuranceRecords() {
  return readWithFallback<InsuranceRecord>(TM.insurance, demo().insurance);
}

export async function getNotifications() {
  return readWithFallback<Notification>(TM.notifications, demo().notifications);
}

export async function getFollowUps() {
  return readWithFallback<FollowUp>(TM.followups, demo().followups);
}

export async function addPayment(data: Omit<Payment, 'id'>) {
  return createDoc(TM.payments, data);
}

export async function addExpense(data: Omit<Expense, 'id'>) {
  return createDoc(TM.expenses, data);
}

export async function markNotificationRead(id: string) {
  await patchDoc(TM.notifications, id, { read: true });
}
