import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDoctors = () => api.get('/doctors');
export const getMedicines = () => api.get('/medicines');
export const getSymptoms = () => api.get('/symptoms');

export const createConsultation = (data: any) => api.post('/consultations', data);
export const getPatientConsultations = (patientId: string) => api.get(`/consultations/patient/${patientId}`);
export const getDoctorConsultations = (doctorId: string) => api.get(`/consultations/doctor/${doctorId}`);

export default api;
