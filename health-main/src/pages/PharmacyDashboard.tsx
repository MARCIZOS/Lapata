import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, FileText, AlertTriangle, FolderSync as Sync, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';

const PharmacyDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests');

  const prescriptionRequests = [
    {
      id: 1,
      patient: 'Rajesh Kumar',
      doctor: 'Dr. Priya Sharma',
      medicines: ['Paracetamol 500mg', 'Cetirizine 10mg'],
      status: 'pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      patient: 'Sunita Patel',
      doctor: 'Dr. Amit Singh',
      medicines: ['Amoxicillin 250mg', 'Vitamin D3'],
      status: 'approved',
      time: '4 hours ago'
    },
    {
      id: 3,
      patient: 'Mohan Lal',
      doctor: 'Dr. Rajesh Kumar',
      medicines: ['Metformin 500mg'],
      status: 'declined',
      time: '1 day ago'
    }
  ];

  const lowStockMedicines = [
    { name: 'Paracetamol 500mg', stock: 5, minStock: 20 },
    { name: 'Amoxicillin 250mg', stock: 2, minStock: 15 },
    { name: 'Cetirizine 10mg', stock: 8, minStock: 25 }
  ];

  const handleRequestAction = (id: number, action: 'approve' | 'decline') => {
    console.log(`${action} request ${id}`);
    // In real app, this would update the backend
  };

  return (
    <DashboardLayout title={t('pharmacy.dashboard')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard
              title={t('pharmacy.pendingRequests')}
              value="12"
              icon={Clock}
              color="orange"
            />
            <DashboardCard
              title={t('pharmacy.totalMedicines')}
              value="245"
              icon={Package}
              color="teal"
            />
            <DashboardCard
              title={t('pharmacy.lowStock')}
              value="8"
              icon={AlertTriangle}
              color="red"
            />
            <DashboardCard
              title="Revenue Today"
              value="₹12,450"
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === 'requests'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('pharmacy.prescriptionRequests')}
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === 'stock'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('pharmacy.medicineStock')}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Prescription Requests Tab */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {prescriptionRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.patient}</h4>
                          <p className="text-sm text-gray-600">Prescribed by {request.doctor}</p>
                          <p className="text-xs text-gray-500">{request.time}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Medicines:</p>
                        <ul className="text-sm text-gray-600">
                          {request.medicines.map((medicine, index) => (
                            <li key={index}>• {medicine}</li>
                          ))}
                        </ul>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'decline')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Medicine Stock Tab */}
              {activeTab === 'stock' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900">{t('pharmacy.lowStock')}</h4>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors duration-200">
                      <Sync className="h-4 w-4" />
                      <span>{t('pharmacy.syncInventory')}</span>
                    </button>
                  </div>
                  
                  {lowStockMedicines.map((medicine, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                        <p className="text-sm text-gray-600">Min stock: {medicine.minStock}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          medicine.stock < medicine.minStock ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {medicine.stock}
                        </p>
                        <p className="text-xs text-gray-500">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <Package className="h-5 w-5 text-teal-600" />
                <span className="font-medium text-gray-900">Add Medicine</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Generate Report</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                <Sync className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Sync Inventory</span>
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">License:</span>
                <span className="font-medium">PH123456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PharmacyDashboard;