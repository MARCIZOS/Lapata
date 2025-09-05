import React, { useState } from 'react';
import { X, FileText, Activity, Heart, Weight, Thermometer, Calendar } from 'lucide-react';

interface PatientRecord {
  id: string;
  date: string;
  type: string;
  details: string;
  doctorName: string;
  vitals?: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
  };
}

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  medicalHistory: string[];
  allergies: string[];
  records: PatientRecord[];
}

interface PatientRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
}

const PatientRecordsModal: React.FC<PatientRecordsModalProps> = ({ isOpen, onClose, patientId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'vitals'>('overview');

  // Mock patient data - in a real app, this would come from an API
  const patientData: PatientData = {
    id: patientId || '1',
    name: 'Rajesh Kumar',
    age: 35,
    gender: 'Male',
    phone: '+91 98765 43210',
    medicalHistory: [
      'Type 2 Diabetes (diagnosed 2020)',
      'Hypertension',
      'Asthma'
    ],
    allergies: [
      'Penicillin',
      'Pollen'
    ],
    records: [
      {
        id: '1',
        date: '2025-09-01',
        type: 'Consultation',
        details: 'Regular checkup for diabetes management. Blood sugar levels stable.',
        doctorName: 'Dr. Amit Singh',
        vitals: {
          bloodPressure: '120/80',
          temperature: '98.6°F',
          heartRate: '72 bpm',
          weight: '75 kg'
        }
      },
      {
        id: '2',
        date: '2025-08-15',
        type: 'Lab Report',
        details: 'HbA1c: 6.5%, Blood glucose: 110 mg/dL',
        doctorName: 'Dr. Priya Sharma',
        vitals: {
          bloodPressure: '118/78',
          temperature: '98.4°F',
          heartRate: '70 bpm',
          weight: '75 kg'
        }
      }
    ]
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{patientData.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-medium">{patientData.age} years</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Gender</p>
          <p className="font-medium">{patientData.gender}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{patientData.phone}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
        <ul className="list-disc list-inside space-y-1">
          {patientData.medicalHistory.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
        <ul className="list-disc list-inside space-y-1">
          {patientData.allergies.map((allergy, index) => (
            <li key={index} className="text-gray-600">{allergy}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-4">
      {patientData.records.map((record) => (
        <div key={record.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{record.type}</h4>
              <p className="text-sm text-gray-500">{record.date}</p>
            </div>
            <span className="text-sm text-gray-500">{record.doctorName}</span>
          </div>
          <p className="text-gray-600 text-sm">{record.details}</p>
          {record.vitals && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Vitals:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">BP: {record.vitals.bloodPressure}</p>
                <p className="text-gray-600">Temp: {record.vitals.temperature}</p>
                <p className="text-gray-600">HR: {record.vitals.heartRate}</p>
                <p className="text-gray-600">Weight: {record.vitals.weight}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderVitals = () => (
    <div className="space-y-6">
      {patientData.records.slice(0, 1).map((record) => (
        record.vitals && (
          <div key={record.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-xl font-semibold text-blue-600">{record.vitals.bloodPressure}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-xl font-semibold text-green-600">{record.vitals.heartRate}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="text-xl font-semibold text-orange-600">{record.vitals.temperature}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Weight className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-xl font-semibold text-purple-600">{record.vitals.weight}</p>
                </div>
              </div>
            </div>
          </div>
        )
      ))}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          Vitals History
        </h4>
        <div className="space-y-4">
          {patientData.records.map((record) => (
            record.vitals && (
              <div key={record.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">{record.date}</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span>BP: {record.vitals.bloodPressure}</span>
                  <span>HR: {record.vitals.heartRate}</span>
                  <span>Temp: {record.vitals.temperature}</span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Patient Records
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'records'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'vitals'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vitals
            </button>
          </nav>
        </div>

        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'records' && renderRecords()}
          {activeTab === 'vitals' && renderVitals()}
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsModal;
