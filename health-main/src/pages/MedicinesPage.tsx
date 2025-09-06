import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Package } from 'lucide-react';
import { getMedicines } from '../services/data';

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  pharmacy: string;      // e.g., "City Medical Store"
  distance?: string;     // e.g., "2.3 km" (optional)
  stock?: number;        // e.g., 12 (optional)
  availability?: 'Available' | 'Out of Stock';
};

const MedicinesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState('all');

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from Firestore once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMedicines();
        if (!mounted) return;
        // Coerce types a bit (in case Firestore docs miss optional fields)
        const normalized = (data as any[]).map((m) => ({
          id: String(m.id),
          name: String(m.name ?? ''),
          genericName: String(m.genericName ?? ''),
          category: String(m.category ?? ''),
          price: Number(m.price ?? 0),
          pharmacy: String(m.pharmacy ?? ''),
          distance: m.distance ? String(m.distance) : undefined,
          stock: typeof m.stock === 'number' ? m.stock : undefined,
          availability: (m.availability === 'Available' ? 'Available' :
                        m.availability === 'Out of Stock' ? 'Out of Stock' :
                        (m.stock && m.stock > 0 ? 'Available' : 'Out of Stock')) as Medicine['availability'],
        })) as Medicine[];
        setMedicines(normalized);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load medicines');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Build pharmacy list from data (unique)
  const pharmacies = useMemo(() => {
    const set = new Set<string>();
    medicines.forEach(m => { if (m.pharmacy) set.add(m.pharmacy); });
    const options = Array.from(set).sort().map(name => ({ value: name, label: name }));
    // Add "All Pharmacies" at the top (use i18n key if you have one)
    return [{ value: 'all', label: t('medicines.allPharmacies', 'All Pharmacies') }, ...options];
  }, [medicines, t]);

  // Apply search + pharmacy filter
  const filteredMedicines = useMemo(() => {
    let data = medicines;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }

    if (selectedPharmacy !== 'all') {
      data = data.filter(m => m.pharmacy === selectedPharmacy);
    }

    return data;
  }, [medicines, searchQuery, selectedPharmacy]);

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

      {/* Loading / Error / Results */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('common.loading', 'Loading…')}</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {t('medicines.noResults', 'No medicines found matching your search.')}
              </p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          medicine.availability === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {medicine.availability === 'Available'
                          ? t('medicines.available')
                          : t('medicines.outOfStock')}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-1">
                      {t('medicines.generic', 'Generic')}: {medicine.genericName}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {t('medicines.category', 'Category')}: {medicine.category}
                    </p>

                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{medicine.pharmacy}</span>
                      </div>
                      {medicine.distance && <span>{medicine.distance}</span>}
                      {typeof medicine.stock === 'number' && medicine.stock > 0 && (
                        <span className="text-green-600">
                          {t('medicines.stock', 'Stock')}: {medicine.stock}
                        </span>
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
                      {medicine.availability === 'Available'
                        ? t('medicines.orderNow', 'Order Now')
                        : t('medicines.outOfStock')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;
