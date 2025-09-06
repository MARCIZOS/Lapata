import React, { useState } from 'react';
import { useUserStore } from '../utils/store';
import VideoConsultation from './VideoConsultation';
import { createConsultation } from '../utils/api';

interface ConsultationWrapperProps {
  doctorId?: string;
  patientId?: string;
}

export const ConsultationWrapper: React.FC<ConsultationWrapperProps> = ({ doctorId, patientId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore(state => state.user);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const startConsultation = async () => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      // Create a new consultation
      const response = await createConsultation({
        doctorId: doctorId || user.id,
        patientId: patientId || user.id,
        status: 'pending',
        startedAt: new Date().toISOString()
      });

      if (!response.data.id) {
        throw new Error('Failed to create consultation');
      }

      setConsultationId(response.data.id);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to start consultation:', error);
      alert('Failed to start consultation. Please try again.');
    }
  };

  const endConsultation = () => {
    setIsOpen(false);
    setConsultationId(null);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={startConsultation}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Start Video Consultation
      </button>

      {isOpen && consultationId && (
        <VideoConsultation
          isOpen={isOpen}
          onClose={endConsultation}
          patientName={user.role === 'doctor' ? patientId || '' : user.name}
          consultationId={consultationId}
          participantId={user.id}
          isDoctor={user.role === 'doctor'}
        />
      )}
    </>
  );
};
