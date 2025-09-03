import React from 'react';
import Hero from '../components/Hero';

const LandingPage: React.FC = () => {
  return (
    <div>
      <Hero />
      
      {/* Additional sections can be added here */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Bridging Healthcare Gaps in Rural Communities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is designed specifically for rural areas with limited internet connectivity, 
              ensuring that quality healthcare is accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;