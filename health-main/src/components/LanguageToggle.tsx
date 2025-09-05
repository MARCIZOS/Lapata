import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'EN', label: 'English' },
    { code: 'hi', name: 'हिं', label: 'हिंदी' },
    { code: 'pa', name: 'ਪੰ', label: 'ਪੰਜਾਬੀ' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center">
      <div className="flex space-x-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
              i18n.language === lang.code
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={lang.label}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageToggle;