'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildEmployees } from './demo-data';
import type { Employee } from '@/types';

export async function getEmployees() {
  return readWithFallback<Employee>(TM.employees, buildEmployees());
}

export async function getEmployee(id: string) {
  return (await getEmployees()).find((e) => e.id === id) ?? null;
}

export async function addEmployee(data: Omit<Employee, 'id'>) {
  return createDoc(TM.employees, data);
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  await patchDoc(TM.employees, id, data as Record<string, unknown>);
}

export async function deleteEmployee(id: string) {
  await removeDoc(TM.employees, id);
}
