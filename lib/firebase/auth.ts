import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, type User,
} from 'firebase/auth';
import { auth } from './config';
import { TM, getOne, upsertDoc } from './firestore';
import type { AppUser, Role } from '@/types';

export const ADMIN_EMAIL = 'tamilmotors@admin.com';

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function registerCustomer(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await upsertDoc(TM.users, cred.user.uid, {
    uid: cred.user.uid, email: email.trim(), name, role: 'customer',
  });
  return cred.user;
}

export async function logOut() {
  await signOut(auth);
}

export async function resolveRole(user: User): Promise<Role> {
  if (user.email?.toLowerCase() === ADMIN_EMAIL) return 'admin';
  const profile = await getOne<AppUser>(TM.users, user.uid);
  return profile?.role ?? 'customer';
}

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export function friendlyAuthError(code: string) {
  const map: Record<string, string> = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account found for this email.',
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again shortly.',
    'auth/network-request-failed': 'Network problem. Check your connection.',
  };
  return map[code] ?? 'Sign in failed. Please try again.';
}
