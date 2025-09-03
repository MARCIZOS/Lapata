import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Phone, Calendar, Clock, Star } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import doctorsData from '../data/doctors.json';

const PatientConsultation: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationMode, setConsultationMode] = useState<'video' | 'audio'>('video');

  const specialties = [
    { value: 'general', label: t('registration.general') },
    { value: 'pediatrics', label: t('registration.pediatrics') },
    { value: 'gynecology', label: t('registration.gynecology') },
    { value: 'cardiology', label: t('registration.cardiology') },
    { value: 'dermatology', label: t('registration.dermatology') },
    { value: 'orthopedics', label: t('registration.orthopedics') }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const filteredDoctors = selectedSpecialty 
    ? doctorsData.filter(doctor => doctor.specialty === selectedSpecialty)
    : [];

  const handleBooking = () => {
    if (selectedDoctor && selectedSlot) {
      alert(`Consultation booked with ${selectedDoctor.name} at ${selectedSlot} in ${consultationMode} mode`);
    }
  };

  return (
    <DashboardLayout title={t('patient.bookConsultation')}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Specialty Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('consultation.selectSpecialty')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specialties.map((specialty) => (
              <button
                key={specialty.value}
                onClick={() => setSelectedSpecialty(specialty.value)}
                className={`p-3 text-center rounded-lg border transition-all duration-200 ${
                  selectedSpecialty === specialty.value
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
                }`}
              >
                {specialty.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Selection */}
        {selectedSpecialty && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('consultation.selectDoctor')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.experience}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                      </div>
                      <p className="text-sm font-medium text-teal-600">₹{doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Slot Selection */}
        {selectedDoctor && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('consultation.selectSlot')}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 text-center rounded-lg border transition-all duration-200 ${
                    selectedSlot === slot
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Consultation Mode & Booking */}
        {selectedDoctor && selectedSlot && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consultation Mode
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setConsultationMode('video')}
                className={`p-4 rounded-lg border flex items-center space-x-3 transition-all duration-200 ${
                  consultationMode === 'video'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-300 hover:border-teal-400'
                }`}
              >
                <Video className="h-6 w-6 text-teal-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('consultation.videoCall')}</p>
                  <p className="text-sm text-gray-600">Full video consultation</p>
                </div>
              </button>

              <button
                onClick={() => setConsultationMode('audio')}
                className={`p-4 rounded-lg border flex items-center space-x-3 transition-all duration-200 ${
                  consultationMode === 'audio'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-300 hover:border-teal-400'
                }`}
              >
                <Phone className="h-6 w-6 text-teal-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('consultation.audioOnly')}</p>
                  <p className="text-sm text-gray-600">Voice consultation only</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>{t('consultation.bookNow')} - ₹{selectedDoctor.consultationFee}</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientConsultation;