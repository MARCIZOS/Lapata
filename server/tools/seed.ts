import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { adminDb } from '../src/firebaseAdmin.js';

// ---------- helpers ----------
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function loadJson(jsonPath: string) {
  const data = readFileSync(jsonPath, 'utf8');
  return JSON.parse(data);
}

// Get directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function writeBatches<T>(
  items: T[],
  colName: string,
  idFor: (x: T) => string,
  mapFor: (x: T) => any,
) {
  const CHUNK = 400; // Firestore limit is 500; keep margin
  let written = 0;

  for (let i = 0; i < items.length; i += CHUNK) {
    const chunk = items.slice(i, i + CHUNK);
    const batch = adminDb.batch();
    for (const item of chunk) {
      const id = idFor(item);
      const ref = adminDb.collection(colName).doc(id);
      batch.set(ref, mapFor(item), { merge: true }); // idempotent
    }
    await batch.commit();
    written += chunk.length;
    console.log(`  - ${colName}: committed ${written}/${items.length}`);
  }
  return written;
}

// ---------- main ----------
async function main() {
  // Run from server/ directory
  const base = resolve(process.cwd(), '..', 'health-main', 'src', 'data');

  const doctorsPath = join(base, 'doctors.json');
  const medicinesPath = join(base, 'medicines.json');
  const symptomsPath = join(base, 'symptoms.json');

  console.log('Seeding from:', base);

  // Load JSON
  const doctors = loadJson(doctorsPath);     // expect array
  const medicines = loadJson(medicinesPath); // expect array
  const symptomsRaw = loadJson(symptomsPath); // could be { conditions: [...] } or an array
  const symptoms = Array.isArray(symptomsRaw) ? symptomsRaw : (symptomsRaw.conditions || []);

  // ---- DOCTORS ----
  // normalize & choose deterministic IDs so re-runs don’t duplicate
  const doctorsNorm = (doctors as any[]).map(d => {
    const name = String(d.name ?? '').trim();
    const specialty = String(d.specialty ?? '').trim();
    const experience = d.experience ?? ''; // string or number
    const rating = typeof d.rating === 'number' ? d.rating : Number(d.rating ?? 0) || undefined;
    const fee = (typeof d.consultationFee === 'number' ? d.consultationFee
               : typeof d.fee === 'number' ? d.fee : undefined);

    return {
      name,
      specialty: specialty.toLowerCase(), // your UI filters with lowercase specialties
      experience,
      rating,
      consultationFee: fee,
      availability: d.availability ?? [],   // [] ok
      languages: d.languages ?? [],         // [] ok
      image: d.image ?? null,
    };
  });

  await writeBatches(
    doctorsNorm,
    'doctors',
    (d: any) => `${slugify(d.name)}-${slugify(d.specialty)}`,
    (d: any) => d
  );

  // ---- MEDICINES ----
  const medsNorm = (medicines as any[]).map(m => {
    const name = String(m.name ?? '').trim();
    const genericName = String(m.genericName ?? '').trim();
    const category = String(m.category ?? '').trim();
    const price = Number(m.price ?? 0);
    const pharmacy = String(m.pharmacy ?? '').trim();
    const stock = typeof m.stock === 'number' ? m.stock : Number(m.stock ?? 0) || 0;
    const availability = stock > 0 ? 'Available' : 'Out of Stock';
    const distance = m.distance ? String(m.distance) : undefined;

    return {
      name,
      genericName,
      category,
      price,
      pharmacy,
      stock,
      availability,
      distance,
    };
  });

  await writeBatches(
    medsNorm,
    'medicines',
    (m: any) => `${slugify(m.name)}-${slugify(m.genericName || m.category || 'na')}`,
    (m: any) => m
  );

  // ---- SYMPTOMS ----
  const sympNorm = (symptoms as any[]).map(s => {
    const name = String(s.name ?? '').trim();
    return {
      name,
      // normalize common fields present in your JSON
      symptoms: Array.isArray(s.symptoms) ? s.symptoms : [],
      recommendations: Array.isArray(s.recommendations) ? s.recommendations : [],
      urgency: s.urgency ?? 'medium',
      confidence: typeof s.confidence === 'number' ? s.confidence : undefined
    };
  });

  await writeBatches(
    sympNorm,
    'symptoms',
    (s: any) => slugify(s.name),
    (s: any) => s
  );

  console.log('✅ Seeding complete.');
}

main().catch(e => {
  console.error('❌ Seed error:', e);
  process.exit(1);
});
