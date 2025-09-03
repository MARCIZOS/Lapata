import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Stethoscope, Building2 } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';
import RoleDropdown from '../components/RoleDropdown';
import { authService, CitizenData, DoctorData, PharmacyData } from '../utils/auth';

const RegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  
  const [citizenData, setCitizenData] = useState<CitizenData>({
    name: '',
    phone: '',
    age: '',
    gender: '',
    village: '',
    password: ''
  });

  const [doctorData, setDoctorData] = useState<DoctorData>({
    name: '',
    phone: '',
    specialty: '',
    registrationId: '',
    experience: '',
    password: ''
  });

  const [pharmacyData, setPharmacyData] = useState<PharmacyData>({
    storeName: '',
    ownerName: '',
    phone: '',
    licenseNo: '',
    address: '',
    password: ''
  });

  const specialties = [
    { value: 'general', label: t('registration.general') },
    { value: 'pediatrics', label: t('registration.pediatrics') },
    { value: 'gynecology', label: t('registration.gynecology') },
    { value: 'cardiology', label: t('registration.cardiology') },
    { value: 'dermatology', label: t('registration.dermatology') },
    { value: 'orthopedics', label: t('registration.orthopedics') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      switch (role) {
        case 'citizen':
          data = citizenData;
          break;
        case 'doctor':
          data = doctorData;
          break;
        case 'pharmacy':
          data = pharmacyData;
          break;
        default:
          return;
      }

      const user = authService.register(role, data);
      
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'citizen':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'pharmacy':
          navigate('/pharmacy');
          break;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'doctor': return Stethoscope;
      case 'pharmacy': return Building2;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-teal-600 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('registration.title')}
            </h2>
            <p className="text-gray-600">
              {t('registration.subtitle')}
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="flex items-center space-x-3 mb-6">
                <RoleIcon className="h-6 w-6 text-teal-600" />
                <RoleDropdown value={role} onChange={setRole} />
              </div>

              {/* Citizen Fields */}
              {role === 'citizen' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenData.name}
                      onChange={(e) => setCitizenData({ ...citizenData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('common.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={citizenData.phone}
                      onChange={(e) => setCitizenData({ ...citizenData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('common.age')}
                      </label>
                      <input
                        type="number"
                        required
                        value={citizenData.age}
                        onChange={(e) => setCitizenData({ ...citizenData, age: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('common.gender')}
                      </label>
                      <select
                        required
                        value={citizenData.gender}
                        onChange={(e) => setCitizenData({ ...citizenData, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="">{t('common.gender')}</option>
                        <option value="male">{t('common.male')}</option>
                        <option value="female">{t('common.female')}</option>
                        <option value="other">{t('common.other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('registration.village')}
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenData.village}
                      onChange={(e) => setCitizenData({ ...citizenData, village: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('registration.village')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.password')}
                    </label>
                    <input
                      type="password"
                      required
                      value={citizenData.password}
                      onChange={(e) => setCitizenData({ ...citizenData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('common.password')}
                    />
                  </div>
                </>
              )}

              {/* Doctor Fields */}
              {role === 'doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={doctorData.name}
                      onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={doctorData.phone}
                      onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('registration.specialty')}
                    </label>
                    <select
                      required
                      value={doctorData.specialty}
                      onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="">{t('registration.selectSpecialty')}</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.value} value={specialty.value}>
                          {specialty.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('registration.registrationId')}
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorData.registrationId}
                        onChange={(e) => setDoctorData({ ...doctorData, registrationId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="MCI123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('registration.experience')}
                      </label>
                      <input
                        type="number"
                        required
                        value={doctorData.experience}
                        onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.password')}
                    </label>
                    <input
                      type="password"
                      required
                      value={doctorData.password}
                      onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('common.password')}
                    />
                  </div>
                </>
              )}

              {/* Pharmacy Fields */}
              {role === 'pharmacy' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('registration.storeName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={pharmacyData.storeName}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, storeName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="City Medical Store"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('registration.ownerName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={pharmacyData.ownerName}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, ownerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('registration.ownerName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={pharmacyData.phone}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('registration.licenseNo')}
                    </label>
                    <input
                      type="text"
                      required
                      value={pharmacyData.licenseNo}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, licenseNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="PH123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.address')}
                    </label>
                    <textarea
                      required
                      value={pharmacyData.address}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('common.address')}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.password')}
                    </label>
                    <input
                      type="password"
                      required
                      value={pharmacyData.password}
                      onChange={(e) => setPharmacyData({ ...pharmacyData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder={t('common.password')}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <RoleIcon className="h-5 w-5" />
                    <span>{t('auth.register')}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;