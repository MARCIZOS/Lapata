import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, connectFirestoreEmulator } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data
const medicines = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/medicines.json'), 'utf8')
);

async function seedData() {
  // Initialize Firebase
  const app = initializeApp({
    projectId: 'demo-heal-grid'
  });

  const db = getFirestore(app);
  
  // Connect to emulator
  connectFirestoreEmulator(db, 'localhost', 9199);

  console.log('Seeding medicines...');
  const medicinesRef = collection(db, 'medicines');
  
  for (const medicine of medicines) {
    try {
      await addDoc(medicinesRef, {
        name: medicine.name,
        genericName: medicine.genericName,
        category: medicine.category,
        price: medicine.price,
        availability: medicine.availability,
        pharmacy: medicine.pharmacy,
        distance: medicine.distance,
        stock: medicine.stock
      });
      console.log(`Added medicine: ${medicine.name}`);
    } catch (error) {
      console.error(`Error adding medicine ${medicine.name}:`, error);
    }
  }

  console.log('Seeding completed!');
}

seedData().catch(console.error);
