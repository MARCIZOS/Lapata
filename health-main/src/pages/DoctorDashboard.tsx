import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  FileText, 
  Users, 
  Clock,
  Video,
  Clipboard,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';

const DoctorDashboard: React.FC = () => {
  const { t } = useTranslation();

  const todaysAppointments = [
    { time: '09:00 AM', patient: 'Rajesh Kumar', type: 'Video', status: 'upcoming' },
    { time: '10:30 AM', patient: 'Priya Sharma', type: 'Audio', status: 'upcoming' },
    { time: '02:00 PM', patient: 'Amit Singh', type: 'Video', status: 'completed' },
    { time: '03:30 PM', patient: 'Sunita Patel', type: 'Video', status: 'upcoming' }
  ];

  const recentPrescriptions = [
    { patient: 'Rajesh Kumar', medicine: 'Paracetamol 500mg', date: 'Today' },
    { patient: 'Priya Sharma', medicine: 'Amoxicillin 250mg', date: 'Yesterday' },
    { patient: 'Amit Singh', medicine: 'Cetirizine 10mg', date: '2 days ago' }
  ];

  return (
    <DashboardLayout title={t('doctor.dashboard')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              title={t('doctor.totalPatients')}
              value="156"
              icon={Users}
              color="teal"
            />
            <DashboardCard
              title={t('doctor.appointmentsToday')}
              value="8"
              icon={Calendar}
              color="blue"
            />
            <DashboardCard
              title={t('doctor.pendingReports')}
              value="3"
              icon={FileText}
              color="orange"
            />
            <DashboardCard
              title="Rating"
              value="4.8"
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-teal-600 mr-2" />
              {t('doctor.todaysAppointments')}
            </h3>
            <div className="space-y-3">
              {todaysAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.type}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">General Consultation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'upcoming' && (
                      <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200">
                        <Video className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clipboard className="h-5 w-5 text-blue-600 mr-2" />
              {t('doctor.prescriptions')}
            </h3>
            <div className="space-y-3">
              {recentPrescriptions.map((prescription, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{prescription.patient}</p>
                    <p className="text-sm text-gray-600">{prescription.medicine}</p>
                  </div>
                  <span className="text-xs text-gray-500">{prescription.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200">
                <Video className="h-5 w-5 text-teal-600" />
                <span className="font-medium text-gray-900">{t('doctor.videoConsult')}</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">{t('doctor.patientRecords')}</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">{t('doctor.availability')}</span>
              </button>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Morning Shift</span>
                <span className="font-medium">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Evening Shift</span>
                <span className="font-medium">5:00 PM - 8:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Hours</span>
                <span className="font-medium text-teal-600">7 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;