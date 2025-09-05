import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Pill, 
  Brain, 
  Phone, 
  Clock,
  User,
  Activity,
  Video
} from 'lucide-react';
import VideoConsultation from '../components/VideoConsultation';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';

const PatientDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState<string | null>(null);

  const emergencyNumbers = [
    { name: t('emergency.ambulance'), number: '108', color: 'red' as const },
    { name: t('emergency.police'), number: '100', color: 'blue' as const },
    { name: t('emergency.fire'), number: '101', color: 'orange' as const },
    { name: t('emergency.hospital'), number: '+91 98765 43210', color: 'green' as const }
  ];

  const quickActions = [
    {
      title: t('patient.bookConsultation'),
      icon: Calendar,
      color: 'teal' as const,
      onClick: () => navigate('/patient/consultation')
    },
    {
      title: 'Video Consultation',
      icon: Video,
      color: 'blue' as const,
      onClick: () => {
        setActiveDoctor('Dr. Rajesh Kumar');
        setIsVideoCallActive(true);
      }
    },
    {
      title: t('patient.medicineChecker'),
      icon: Pill,
      color: 'green' as const,
      onClick: () => navigate('/patient/medicines')
    },
    {
      title: t('patient.symptomChecker'),
      icon: Brain,
      color: 'orange' as const,
      onClick: () => navigate('/patient/symptoms')
    }
  ];

  const hamburgerQuickActions = quickActions.map(action => ({
    icon: action.icon,
    label: action.title,
    onClick: action.onClick
  }));

  return (
    <DashboardLayout title={t('patient.dashboard')} quickActions={hamburgerQuickActions}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              title={t('patient.upcomingAppointments')}
              value="2"
              icon={Clock}
              color="teal"
            />
            <DashboardCard
              title={t('patient.recentRecords')}
              value="5"
              icon={FileText}
              color="blue"
            />
            <DashboardCard
              title="Health Score"
              value="85%"
              icon={Activity}
              color="green"
            />
            <DashboardCard
              title="Profile"
              value="Complete"
              icon={User}
              color="orange"
            />
          </div>



          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('patient.quickActions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                >
                  <div className={`p-3 rounded-lg ${
                    action.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                    action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    action.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Consultation booked</p>
                  <p className="text-xs text-gray-500">Dr. Rajesh Kumar - Tomorrow 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lab report uploaded</p>
                  <p className="text-xs text-gray-500">Blood test results - 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Numbers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 text-red-600 mr-2" />
              {t('emergency.title')}
            </h3>
            <div className="space-y-3">
              {emergencyNumbers.map((emergency, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{emergency.name}</span>
                  <a
                    href={`tel:${emergency.number}`}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                      emergency.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                      emergency.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                      emergency.color === 'orange' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                      'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {emergency.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-800">💧 Drink at least 8 glasses of water daily</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">🚶‍♂️ Take a 30-minute walk every day</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">🥗 Include fruits and vegetables in your diet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Consultation Modal */}
      {isVideoCallActive && activeDoctor && (
        <VideoConsultation
          isOpen={isVideoCallActive}
          onClose={() => {
            setIsVideoCallActive(false);
            setActiveDoctor(null);
          }}
          patientName={activeDoctor}
        />
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;