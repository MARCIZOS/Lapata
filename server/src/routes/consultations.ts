import { Router } from 'express';
import { adminDb } from '../firebaseAdmin.js';

const router = Router();

// Create a new consultation
router.post('/', async (req, res) => {
  try {
    const consultation = {
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection('consultations').add(consultation);
    res.json({ id: docRef.id, ...consultation });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ error: 'Failed to create consultation' });
  }
});

// Get consultations for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const snapshot = await adminDb.collection('consultations')
      .where('patientId', '==', req.params.patientId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const consultations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// Get consultations for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const snapshot = await adminDb.collection('consultations')
      .where('doctorId', '==', req.params.doctorId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const consultations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// Update consultation status
router.patch('/:consultationId', async (req, res) => {
  try {
    const { status } = req.body;
    await adminDb.collection('consultations')
      .doc(req.params.consultationId)
      .update({ status });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ error: 'Failed to update consultation' });
  }
});

export default router;
