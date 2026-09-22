'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { TestDrive, TestDriveStatus } from '@/types';

export async function getTestDrives() {
  return readWithFallback<TestDrive>(TM.testDrives, buildDemoDataset().testDrives);
}

/** Public test-drive form writes straight into `tamilMotors_testDrives`. */
export async function requestTestDrive(data: {
  name: string; phone: string; email: string;
  bikeName: string; bikeId?: string;
  date: string; time: string; location: string;
}) {
  const id = await createDoc(TM.testDrives, { ...data, status: 'Requested', notes: '' });
  await createDoc(TM.notifications, {
    type: 'Test Drive Request',
    title: 'New test drive request',
    message: `Test drive requested by ${data.name} for ${data.bikeName}.`,
    read: false,
    date: new Date().toISOString().slice(0, 10),
  });
  return id;
}

export async function setTestDriveStatus(id: string, status: TestDriveStatus) {
  await patchDoc(TM.testDrives, id, { status });
}

export async function deleteTestDrive(id: string) {
  await removeDoc(TM.testDrives, id);
}
