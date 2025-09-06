import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { adminDb } from './firebaseAdmin.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true, // Allow all origins in development
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Doctor endpoints
app.get('/api/doctors', async (req, res) => {
  try {
    const snapshot = await adminDb.collection('doctors').get();
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Medicine endpoints
app.get('/api/medicines', async (req, res) => {
  try {
    const snapshot = await adminDb.collection('medicines').get();
    const medicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Consultation endpoints
app.post('/api/consultations', async (req, res) => {
  try {
    const consultation = req.body;
    const docRef = await adminDb.collection('consultations').add({
      ...consultation,
      createdAt: new Date().toISOString()
    });
    res.json({ id: docRef.id });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket handling for video consultations
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('send-signal', ({ userToSignal, signal, callerID }) => {
    io.to(userToSignal).emit('user-joined', { signal, callerID });
  });

  socket.on('return-signal', ({ signal, callerID }) => {
    io.to(callerID).emit('receiving-returned-signal', { signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
