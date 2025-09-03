import React from 'react';
import { Heart, Users, Globe, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Quality Healthcare',
      description: 'Connecting rural communities with certified medical professionals and quality healthcare services.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Designed specifically for rural areas with limited internet connectivity and infrastructure challenges.'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in multiple local languages to ensure healthcare access for all community members.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and stored securely with offline capabilities for privacy protection.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About HealthConnect</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Bridging the healthcare gap in rural communities through innovative telemedicine solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <feature.icon className="h-10 w-10 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          We believe that quality healthcare should be accessible to everyone, regardless of their geographical location. 
          Our platform leverages technology to bring specialist medical care to rural communities, ensuring that distance 
          is no longer a barrier to receiving proper healthcare services.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;