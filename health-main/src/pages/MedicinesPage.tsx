import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Package, AlertCircle } from 'lucide-react';
import medicinesData from '../data/medicines.json';

const MedicinesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState(medicinesData);
  const [selectedPharmacy, setSelectedPharmacy] = useState('all');

  const pharmacies = [
    { value: 'all', label: 'All Pharmacies' },
    { value: 'City Medical Store', label: 'City Medical Store (2.3 km)' },
    { value: 'Health Plus Pharmacy', label: 'Health Plus Pharmacy (1.8 km)' },
    { value: 'Care Pharmacy', label: 'Care Pharmacy (3.1 km)' }
  ];

  useEffect(() => {
    let filtered = medicinesData;

    if (searchQuery) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPharmacy !== 'all') {
      filtered = filtered.filter(medicine => medicine.pharmacy === selectedPharmacy);
    }

    setFilteredMedicines(filtered);
  }, [searchQuery, selectedPharmacy]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {t('medicines.title')}
      </h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('medicines.search')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('medicines.nearestPharmacy')}
            </label>
            <select
              value={selectedPharmacy}
              onChange={(e) => setSelectedPharmacy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.value} value={pharmacy.value}>
                  {pharmacy.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No medicines found matching your search.</p>
          </div>
        ) : (
          filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      medicine.availability === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medicine.availability === 'Available' ? t('medicines.available') : t('medicines.outOfStock')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-1">Generic: {medicine.genericName}</p>
                  <p className="text-sm text-gray-500 mb-2">Category: {medicine.category}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{medicine.pharmacy}</span>
                    </div>
                    <span>{medicine.distance}</span>
                    {medicine.stock > 0 && (
                      <span className="text-green-600">Stock: {medicine.stock}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 text-right">
                  <p className="text-2xl font-bold text-teal-600">₹{medicine.price}</p>
                  <button
                    disabled={medicine.availability !== 'Available'}
                    className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      medicine.availability === 'Available'
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {medicine.availability === 'Available' ? 'Order Now' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicinesPage;