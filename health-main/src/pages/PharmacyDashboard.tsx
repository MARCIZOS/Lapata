import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, FileText, AlertTriangle, FolderSync as Sync, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import AddMedicineModal from '../components/AddMedicineModal';
import GenerateReportModal from '../components/GenerateReportModal';

const PharmacyDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests');
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2 hours ago');

  interface PrescriptionRequest {
    id: number;
    patient: string;
    doctor: string;
    medicines: string[];
    status: 'pending' | 'approved' | 'declined';
    time: string;
  }

  const [prescriptionRequests, setPrescriptionRequests] = useState<PrescriptionRequest[]>([
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
  ]);

  const [lowStockMedicines, setLowStockMedicines] = useState([
    { name: 'Paracetamol 500mg', stock: 5, minStock: 20 },
    { name: 'Amoxicillin 250mg', stock: 2, minStock: 15 },
    { name: 'Cetirizine 10mg', stock: 8, minStock: 25 }
  ]);

  const handleRequestAction = async (id: number, action: 'approve' | 'decline') => {
    try {
      // In a real app, this would make an API call to update the request status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Update local state
      setPrescriptionRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === id
            ? { ...request, status: action === 'approve' ? 'approved' : 'declined', time: 'Just now' }
            : request
        )
      );

      // Update medicine stock if approved
      if (action === 'approve') {
        const request = prescriptionRequests.find(r => r.id === id);
        if (request) {
          // Update stock levels for the medicines
          setLowStockMedicines(prevStock =>
            prevStock.map(medicine => {
              if (request.medicines.includes(medicine.name)) {
                const newStock = medicine.stock - 1; // Decrease by 1 unit
                return { ...medicine, stock: newStock };
              }
              return medicine;
            })
          );
        }
      }

      // Show success message (in a real app, use a proper toast/notification system)
      alert(`Prescription request ${action === 'approve' ? 'approved' : 'declined'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} prescription request. Please try again.`);
    }
  };

  const handleAddMedicine = (medicineData: any) => {
    // In a real app, this would make an API call to save the medicine
    console.log('Adding medicine:', medicineData);
    
    // Update local state
    if (medicineData.stock < medicineData.minStock) {
      setLowStockMedicines([...lowStockMedicines, {
        name: medicineData.name,
        stock: parseInt(medicineData.stock),
        minStock: parseInt(medicineData.minStock)
      }]);
    }
  };

  const handleSyncInventory = async () => {
    setIsSyncing(true);
    try {
      // In a real app, this would make an API call to sync inventory
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Mock updated inventory data
      const updatedInventory = [
        { name: 'Paracetamol 500mg', stock: 25, minStock: 20 },
        { name: 'Amoxicillin 250mg', stock: 18, minStock: 15 },
        { name: 'Cetirizine 10mg', stock: 30, minStock: 25 }
      ];
      
      setLowStockMedicines(updatedInventory.filter(med => med.stock < med.minStock));
      setLastSyncTime('Just now');
      
      // Show success message (in a real app, you'd use a proper toast/notification system)
      alert('Inventory synced successfully!');
    } catch (error) {
      console.error('Error syncing inventory:', error);
      alert('Failed to sync inventory. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerateReport = (reportConfig: any) => {
    // In a real app, this would make an API call to generate the report
    console.log('Generating report with config:', reportConfig);

    // Mock report data
    const mockReport = {
      type: reportConfig.type,
      data: {
        sales: reportConfig.type === 'sales' ? {
          total: '₹45,678',
          transactions: 234,
          topMedicines: [
            { name: 'Paracetamol 500mg', sales: '₹12,345' },
            { name: 'Amoxicillin 250mg', sales: '₹8,765' },
          ]
        } : null,
        inventory: reportConfig.type === 'inventory' ? {
          totalItems: 245,
          lowStock: 8,
          value: '₹1,23,456'
        } : null,
        prescriptions: reportConfig.type === 'prescriptions' ? {
          total: 156,
          pending: 12,
          completed: 144
        } : null
      }
    };

    // Mock download
    const blob = new Blob([JSON.stringify(mockReport, null, 2)], { type: reportConfig.format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-${reportConfig.type}-report.${reportConfig.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const quickActions = [
    {
      icon: Package,
      label: 'Add Medicine',
      onClick: () => setIsAddMedicineOpen(true)
    },
    {
      icon: FileText,
      label: 'Generate Report',
      onClick: () => setIsGenerateReportOpen(true)
    },
    {
      icon: Sync,
      label: isSyncing ? 'Syncing...' : 'Sync Inventory',
      onClick: handleSyncInventory
    }
  ];

  return (
    <DashboardLayout title={t('pharmacy.dashboard')} quickActions={quickActions}>
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
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'decline')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
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
                    <button 
                      onClick={handleSyncInventory}
                      disabled={isSyncing}
                      className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      <Sync className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : t('pharmacy.syncInventory')}</span>
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
              <button 
                onClick={() => setIsAddMedicineOpen(true)}
                className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
              >
                <Package className="h-5 w-5 text-teal-600" />
                <span className="font-medium text-gray-900">Add Medicine</span>
              </button>
              <button 
                onClick={() => setIsGenerateReportOpen(true)}
                className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Generate Report</span>
              </button>
              <button 
                onClick={handleSyncInventory}
                disabled={isSyncing}
                className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sync className={`h-5 w-5 text-green-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="font-medium text-gray-900">{isSyncing ? 'Syncing...' : 'Sync Inventory'}</span>
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
                <span className="font-medium">{lastSyncTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        onAdd={handleAddMedicine}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateReportOpen}
        onClose={() => setIsGenerateReportOpen(false)}
        onGenerate={handleGenerateReport}
      />
    </DashboardLayout>
  );
};

export default PharmacyDashboard;