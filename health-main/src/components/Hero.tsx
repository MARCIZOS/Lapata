import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Video, Pill, FileText, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Video, text: 'Video Consultations', color: 'text-blue-600' },
    { icon: FileText, text: 'Digital Records', color: 'text-green-600' },
    { icon: Pill, text: 'Medicine Tracking', color: 'text-purple-600' },
    { icon: Brain, text: 'AI Symptom Checker', color: 'text-orange-600' }
  ];

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-4xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/consultation"
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {t('hero.bookConsultation')}
            </Link>
            <Link
              to="/medicines"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              {t('hero.checkMedicines')}
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <feature.icon className={`h-8 w-8 ${feature.color} mx-auto mb-2`} />
                <p className="text-sm font-medium text-gray-700">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;