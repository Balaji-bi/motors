'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { Booking, BookingStatus } from '@/types';

export async function getBookings() {
  return readWithFallback<Booking>(TM.bookings, buildDemoDataset().bookings);
}

export async function addBooking(data: Omit<Booking, 'id'>) {
  return createDoc(TM.bookings, data);
}

export async function setBookingStatus(id: string, deliveryStatus: BookingStatus) {
  await patchDoc(TM.bookings, id, { deliveryStatus });
}

export async function deleteBooking(id: string) {
  await removeDoc(TM.bookings, id);
}
