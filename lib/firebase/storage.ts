import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/** All Tamil Motors uploads stay under a dedicated prefix. */
const ROOT = 'tamilMotors';

export async function uploadFile(path: string, file: File) {
  const fileRef = ref(storage, `${ROOT}/${path}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function deleteFile(path: string) {
  await deleteObject(ref(storage, `${ROOT}/${path}`));
}
