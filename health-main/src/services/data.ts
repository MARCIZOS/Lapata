import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getDoctors() {
  const snap = await getDocs(collection(db, 'doctors'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function getMedicines() {
  try {
    console.log('Fetching medicines from Firestore...');
    const snap = await getDocs(collection(db, 'medicines'));
    console.log(`Found ${snap.docs.length} medicines`);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching medicines:', error);
    if (import.meta.env.DEV) {
      // In development, if no data exists, return sample data
      console.log('Using sample data in development mode');
      return (await import('../data/medicines.json')).default;
    }
    throw error;
  }
}
export async function getSymptoms() {
  const snap = await getDocs(collection(db, 'symptoms'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
