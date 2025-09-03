import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface RoleDropdownProps {
  value: string;
  onChange: (role: string) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const roles = [
    { value: 'citizen', label: t('auth.citizen') },
    { value: 'doctor', label: t('auth.doctor') },
    { value: 'pharmacy', label: t('auth.pharmacy') }
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('auth.selectRole')}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent appearance-none bg-white"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default RoleDropdown;