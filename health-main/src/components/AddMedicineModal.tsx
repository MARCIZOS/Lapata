import React, { useState } from 'react';
import { X, Package, Plus } from 'lucide-react';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: MedicineData) => void;
}

interface MedicineData {
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  price: string;
  stock: string;
  expiryDate: string;
  minStock: string;
  description: string;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [medicineData, setMedicineData] = useState<MedicineData>({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    price: '',
    stock: '',
    expiryDate: '',
    minStock: '',
    description: ''
  });

  const categories = [
    'Antibiotics',
    'Painkillers',
    'Antidiabetic',
    'Antihypertensive',
    'Antiallergic',
    'Vitamins',
    'First Aid',
    'Others'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(medicineData);
    setMedicineData({
      name: '',
      genericName: '',
      manufacturer: '',
      category: '',
      price: '',
      stock: '',
      expiryDate: '',
      minStock: '',
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Medicine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Medicine Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name*
              </label>
              <input
                type="text"
                required
                value={medicineData.name}
                onChange={(e) => setMedicineData({ ...medicineData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>

            {/* Generic Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generic Name*
              </label>
              <input
                type="text"
                required
                value={medicineData.genericName}
                onChange={(e) => setMedicineData({ ...medicineData, genericName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., Acetaminophen"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer*
              </label>
              <input
                type="text"
                required
                value={medicineData.manufacturer}
                onChange={(e) => setMedicineData({ ...medicineData, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., ABC Pharmaceuticals"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category*
              </label>
              <select
                required
                value={medicineData.category}
                onChange={(e) => setMedicineData({ ...medicineData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)*
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={medicineData.price}
                onChange={(e) => setMedicineData({ ...medicineData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., 99.99"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Stock*
              </label>
              <input
                type="number"
                required
                min="0"
                value={medicineData.stock}
                onChange={(e) => setMedicineData({ ...medicineData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., 100"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date*
              </label>
              <input
                type="date"
                required
                value={medicineData.expiryDate}
                onChange={(e) => setMedicineData({ ...medicineData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Minimum Stock Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock Level*
              </label>
              <input
                type="number"
                required
                min="0"
                value={medicineData.minStock}
                onChange={(e) => setMedicineData({ ...medicineData, minStock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="e.g., 20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={medicineData.description}
              onChange={(e) => setMedicineData({ ...medicineData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows={3}
              placeholder="Enter any additional information about the medicine..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Medicine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
