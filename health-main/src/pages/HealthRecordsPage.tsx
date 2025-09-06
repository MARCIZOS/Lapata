import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload, Download, FolderSync as Sync, Wifi, WifiOff, FileText, Calendar, Trash2
} from 'lucide-react';
import { auth } from '../firebase';
import { healthStorage, HealthRecord } from '../utils/storage';
// If you added this helper as shown before, import it. Else, remove and use the fallback in handleDelete.
import { deleteRecordServer } from '../utils/storage';

const HealthRecordsPage: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);

  // keep text fields in one object, and the actual file separately
  const [newRecord, setNewRecord] = useState<{
    title: string;
    type: HealthRecord['type'];
    description: string;
  }>({
    title: '',
    type: 'prescription',
    description: '',
  });
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const lastSyncTime = healthStorage.getFromLocal('lastSync');
    setLastSync(lastSyncTime || null);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // initial load
    loadRecords();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecords = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setRecords([]);
        return;
      }
      const healthRecords = await healthStorage.getHealthRecords(uid);
      // optional: sort newest first
      healthRecords.sort((a: any, b: any) => (b.createdAt ?? b.date ?? '').localeCompare(a.createdAt ?? a.date ?? ''));
      setRecords(healthRecords);
    } catch (error) {
      console.error('Failed to load records:', error);
    }
  };

  const handleUpload = async () => {
    if (!newRecord.title || !newRecord.description) return;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert(t('auth.loginFirst', 'Please log in first.'));
      return;
    }

    // Build the record; Firestore will assign id
    const record: HealthRecord = {
      title: newRecord.title,
      date: new Date().toISOString(),
      type: newRecord.type,
      description: newRecord.description,
      synced: false,
    };

    try {
      await healthStorage.saveHealthRecord(uid, record, newFile ?? undefined);
      await loadRecords();
      setUploadModal(false);
      setNewRecord({ title: '', type: 'prescription', description: '' });
      setNewFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to save record:', error);
      alert(t('records.uploadFailed', 'Failed to upload record.'));
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      alert(t('records.cannotSyncOffline', 'Cannot sync while offline'));
      return;
    }
    // For Firestore-backed data, treat sync as "refresh from server"
    await loadRecords();
    const syncTime = new Date().toISOString();
    setLastSync(syncTime);
    healthStorage.saveToLocal('lastSync', syncTime);
    alert(t('records.synced', 'Records synced successfully!'));
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      // preferred: delete via server to remove Cloudinary asset + Firestore doc
      if (typeof deleteRecordServer === 'function') {
        await deleteRecordServer(id);
      } else {
        // fallback: delete only Firestore doc
        await healthStorage.deleteHealthRecord(id);
      }
      await loadRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert(t('records.deleteFailed', 'Failed to delete record.'));
    }
  };

  const recordTypes = [
    { value: 'prescription', label: 'Prescription' },
    { value: 'lab_report', label: 'Lab Report' },
    { value: 'medical_history', label: 'Medical History' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          {t('records.title')}
        </h1>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={() => setUploadModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Upload className="h-4 w-4" />
            <span>{t('records.upload')}</span>
          </button>

          <button
            onClick={handleSync}
            disabled={!isOnline}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
              isOnline
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Sync className="h-4 w-4" />
            <span>{t('records.sync')}</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? t('records.online', 'Online') : t('records.offline')}
            </span>
          </div>
          {lastSync && (
            <p className="text-sm text-gray-500">
              {t('records.lastSync')}: {new Date(lastSync).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {t('records.empty', 'No health records found. Upload your first record to get started.')}
            </p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                    {!record.synced && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        {t('records.notSynced', 'Not Synced')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{record.description}</p>
                  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                      {record.type.replace('_', ' ')}
                    </span>

                    {/* Download / View if fileUrl exists */}
                    {record.fileUrl && (
                      <a
                        href={record.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-teal-700 hover:text-teal-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('records.viewOrDownload', 'View / Download')}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleDelete(record.id!)}
                    className="text-red-600 hover:text-red-700 p-2 transition-colors duration-200"
                    title={t('records.delete', 'Delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('records.upload')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('records.titleLabel', 'Record Title')}
                </label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder={t('records.titlePh', 'e.g., Blood Test Report')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('records.typeLabel', 'Record Type')}
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as HealthRecord['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {recordTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('records.descLabel', 'Description')}
                </label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder={t('records.descPh', 'Describe the record...')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('records.fileLabel', 'File (Optional)')}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewFile(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => { setUploadModal(false); setNewFile(null); }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {t('records.upload')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecordsPage;
