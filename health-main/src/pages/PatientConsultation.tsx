import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Phone, Calendar, Star } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
// ⛔️ remove: import doctorsData from '../data/doctors.json';
import { getDoctors } from '../services/data';
import { bookConsultation, ConsultationMode } from '../services/consultations';
import { auth } from '../firebase';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience?: string | number;       // we’ll display as text
  rating?: number;
  consultationFee?: number;           // Firestore may store 'consultationFee' or 'fee'
  fee?: number;
  image?: string;
};

const PatientConsultation: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('video');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    { value: 'general', label: t('registration.general') },
    { value: 'pediatrics', label: t('registration.pediatrics') },
    { value: 'gynecology', label: t('registration.gynecology') },
    { value: 'cardiology', label: t('registration.cardiology') },
    { value: 'dermatology', label: t('registration.dermatology') },
    { value: 'orthopedics', label: t('registration.orthopedics') }
  ];

  const timeSlots = [
    '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','02:00 PM','02:30 PM',
    '03:00 PM','03:30 PM','04:00 PM','04:30 PM'
  ];

  // Fetch doctors once from Firestore
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getDoctors();
        if (!mounted) return;

        // normalize fields so UI never breaks
        const normalized = (list as any[]).map((d) => ({
          id: String(d.id),
          name: String(d.name ?? ''),
          specialty: String(d.specialty ?? ''),
          experience: d.experience ?? '',               // could be "10 years" or number
          rating: typeof d.rating === 'number' ? d.rating : (Number(d.rating) || undefined),
          consultationFee: typeof d.consultationFee === 'number' ? d.consultationFee
                           : typeof d.fee === 'number' ? d.fee
                           : undefined,
          image: d.image ? String(d.image) : undefined,
        })) as Doctor[];

        setDoctors(normalized);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) return [];
    const key = selectedSpecialty.toLowerCase();
    return doctors.filter(d => (d.specialty || '').toLowerCase() === key);
  }, [doctors, selectedSpecialty]);

  const handleBooking = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert(t('auth.loginFirst', 'Please log in first.'));
      return;
    }
    if (!selectedDoctor || !selectedSlot) return;

    await bookConsultation({
      patientId: uid,
      doctorId: selectedDoctor.id,
      slotLabel: selectedSlot,
      mode: consultationMode,
      status: 'booked',
    });

    alert(
      `${t('consultation.booked', 'Consultation booked with')} ${selectedDoctor.name} ${t('consultation.at','at')} ${selectedSlot} (${consultationMode})`
    );
    // Reset selections
    setSelectedSlot('');
    setSelectedDoctor(null);
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
                onClick={() => {
                  setSelectedSpecialty(specialty.value);
                  setSelectedDoctor(null);
                  setSelectedSlot('');
                }}
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

        {/* Loading / Error states for doctors */}
        {selectedSpecialty && loading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600">{t('common.loading','Loading…')}</p>
          </div>
        )}
        {selectedSpecialty && error && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Doctor Selection */}
        {selectedSpecialty && !loading && !error && (
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
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setSelectedSlot('');
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      {doctor.experience && (
                        <p className="text-sm text-gray-600">{String(doctor.experience)}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {typeof doctor.rating === 'number' ? doctor.rating.toFixed(1) : '—'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-teal-600">
                        ₹{doctor.consultationFee ?? doctor.fee ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredDoctors.length === 0 && (
                <p className="text-gray-600">{t('consultation.noDoctors','No doctors for this specialty right now.')}</p>
              )}
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
              {t('consultation.mode','Consultation Mode')}
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
                  <p className="text-sm text-gray-600">{t('consultation.videoDesc','Full video consultation')}</p>
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
                  <p className="text-sm text-gray-600">{t('consultation.audioDesc','Voice consultation only')}</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>
                {t('consultation.bookNow')} - ₹{selectedDoctor.consultationFee ?? selectedDoctor.fee ?? 0}
              </span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientConsultation;
