import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Phone, Wifi, WifiOff, Clock, Star } from 'lucide-react';
import doctorsData from '../data/doctors.json';

const ConsultationPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [consultationMode, setConsultationMode] = useState<'video' | 'audio'>('video');
  const [lowBandwidth, setLowBandwidth] = useState(false);

  const specialties = [
    { value: 'general', label: 'General Medicine' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'gynecology', label: 'Gynecology' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' }
  ];

  const filteredDoctors = selectedSpecialty 
    ? doctorsData.filter(doctor => doctor.specialty === selectedSpecialty)
    : [];

  const handleBookConsultation = () => {
    if (selectedDoctor) {
      alert(`Booking consultation with ${selectedDoctor.name} in ${consultationMode} mode${lowBandwidth ? ' (Low bandwidth)' : ''}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {t('consultation.title')}
      </h1>

      {/* Specialty Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t('consultation.selectSpecialty')}
        </h2>
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('consultation.selectDoctor')}
          </h2>
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
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.experience}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                    </div>
                    <p className="text-sm font-medium text-teal-600">₹{doctor.consultationFee}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    doctor.availability === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.availability}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consultation Mode Selection */}
      {selectedDoctor && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Consultation Mode
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              id="lowBandwidth"
              checked={lowBandwidth}
              onChange={(e) => setLowBandwidth(e.target.checked)}
              className="rounded text-teal-600"
            />
            <label htmlFor="lowBandwidth" className="flex items-center text-sm text-gray-700">
              {lowBandwidth ? <WifiOff className="h-4 w-4 mr-1" /> : <Wifi className="h-4 w-4 mr-1" />}
              {t('consultation.lowBandwidth')}
            </label>
          </div>

          <button
            onClick={handleBookConsultation}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('consultation.bookNow')} - ₹{selectedDoctor.consultationFee}
          </button>
        </div>
      )}

      {/* Consultation UI Placeholder */}
      {selectedDoctor && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Consultation with {selectedDoctor.name}
          </h2>
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
            <div className="text-center text-white">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Video consultation will start here</p>
              <p className="text-xs opacity-50">WebRTC/Zoom integration required</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200">
              <Phone className="h-6 w-6" />
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200">
              <Video className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;