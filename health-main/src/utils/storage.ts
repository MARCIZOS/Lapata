// src/utils/storage.ts  (Cloudinary + Firestore version)
import { db } from '../firebase';
import { addDoc, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

// Upload any file (image/pdf) via unsigned upload preset.
// Using /auto/upload lets Cloudinary pick the correct resource_type (image/video/raw).
async function uploadToCloudinary(file: Blob, uid: string, title: string) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', `records/${uid}`);
  form.append('context', `patientId=${uid}|title=${title}`);

  const resp = await fetch(url, { method: 'POST', body: form });
  if (!resp.ok) throw new Error('Cloudinary upload failed');
  const json = await resp.json();
  // IMPORTANT: return url + public_id for deletion later
  return { secureUrl: json.secure_url as string, publicId: json.public_id as string };
}

export interface HealthRecord {
  id?: string;
  title: string;
  date: string;
  type: 'prescription' | 'lab_report' | 'medical_history' | 'other';
  description: string;
  file?: string;
  fileUrl?: string;
  synced: boolean;
  patientId?: string;
}

class HealthStorage {
  private static instance: HealthStorage;
  static getInstance(): HealthStorage {
    if (!HealthStorage.instance) HealthStorage.instance = new HealthStorage();
    return HealthStorage.instance;
  }

  async saveHealthRecord(uid: string, record: HealthRecord, fileBlob?: Blob): Promise<void> {
    try {
      if (!fileBlob) {
        throw new Error('No file provided for health record');
      }
      const { secureUrl, publicId } = await uploadToCloudinary(fileBlob, uid, record.title);
      await addDoc(collection(db, 'records'), {
        ...record,
        patientId: uid,
        fileUrl: secureUrl,
        cloudinaryPublicId: publicId,
        synced: true,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save health record:', error);
      throw error;
    }
  }

  async getHealthRecords(uid: string): Promise<HealthRecord[]> {
    try {
      const q = query(collection(db, 'records'), where('patientId', '==', uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title,
          date: data.date,
          type: data.type,
          description: data.description,
          fileUrl: data.fileUrl,
          synced: data.synced,
          patientId: data.patientId
        } as HealthRecord;
      });
    } catch (error) {
      console.error('Failed to get health records:', error);
      throw error;
    }
  }

  async deleteHealthRecord(id: string): Promise<void> {
    try {
      // Deletes the Firestore metadata. (Optional) add a server function to also delete the Cloudinary asset.
      await deleteDoc(doc(db, 'records', id));
    } catch (error) {
      console.error('Failed to delete health record:', error);
      throw error;
    }
  }

  // compatibility helpers
  saveToLocal(key: string, data: any): void { localStorage.setItem(key, JSON.stringify(data)); }
  getFromLocal(key: string): any { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; }
  isOnline(): boolean { return navigator.onLine; }
}


export async function deleteRecordServer(id: string) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const { auth } = await import('../firebase');
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${base}/api/records/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Delete failed');
}

export const healthStorage = HealthStorage.getInstance();
