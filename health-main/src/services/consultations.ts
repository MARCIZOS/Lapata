import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export type ConsultationMode = 'video' | 'audio';

export async function bookConsultation(payload: {
  patientId: string;
  doctorId: string;
  slotLabel: string;        // e.g. "09:30 AM"
  mode: ConsultationMode;   // 'video' | 'audio'
  status?: 'booked' | 'completed' | 'cancelled';
}) {
  // You can expand with date/ISO slot if you want later
  return addDoc(collection(db, 'consultations'), {
    ...payload,
    status: payload.status ?? 'booked',
    createdAt: serverTimestamp(),
  });
}
