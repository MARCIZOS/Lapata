import { create } from 'zustand';
import { User } from './auth';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

interface ConsultationStore {
  activeConsultation: {
    id: string;
    doctorId: string;
    patientId: string;
    status: 'pending' | 'active' | 'completed';
  } | null;
  setActiveConsultation: (consultation: any | null) => void;
}

export const useConsultationStore = create<ConsultationStore>((set) => ({
  activeConsultation: null,
  setActiveConsultation: (consultation) => set({ activeConsultation: consultation }),
}));
