import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import symptomsData from '../data/symptoms.json';

const SymptomCheckerPage: React.FC = () => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Sore throat', 'Runny nose', 'Stomach pain', 'Loss of appetite',
    'Muscle aches', 'Shortness of breath'
  ];

  const handleSymptomCheck = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI response based on entered symptoms
    const enteredSymptoms = symptoms.toLowerCase().split(',').map(s => s.trim());
    const matchedConditions = symptomsData.conditions
      .map(condition => {
        const matchScore = condition.symptoms.filter(symptom =>
          enteredSymptoms.some(entered => entered.includes(symptom.toLowerCase()) || symptom.toLowerCase().includes(entered))
        ).length;
        
        return {
          ...condition,
          confidence: Math.max(30, Math.min(95, condition.confidence - (condition.symptoms.length - matchScore) * 10))
        };
      })
      .filter(condition => condition.confidence > 30)
      .sort((a, b) => b.confidence - a.confidence);

    setResults(matchedConditions);
    setLoading(false);
  };

  const addSymptom = (symptom: string) => {
    if (symptoms) {
      setSymptoms(prev => prev + ', ' + symptom);
    } else {
      setSymptoms(symptom);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 text-teal-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('symptoms.title')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe your symptoms and get AI-powered insights about possible conditions.
        </p>
      </div>

      {/* Symptom Input */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t('symptoms.enterSymptoms')}
        </h2>
        
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          placeholder="e.g., headache, fever, fatigue, muscle aches..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
        />

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
              >
                + {symptom}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSymptomCheck}
          disabled={!symptoms.trim() || loading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing symptoms...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>{t('CheckSymptoms')}</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('symptoms.possibleConditions')}
          </h2>

          <div className="space-y-4">
            {results.map((condition) => {
              const UrgencyIcon = getUrgencyIcon(condition.urgency);
              return (
                <div key={condition.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{condition.name}</h3>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${getUrgencyColor(condition.urgency)}`}>
                        <UrgencyIcon className="h-3 w-3 inline mr-1" />
                        {condition.urgency.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-teal-600">{condition.confidence}%</span>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Matching Symptoms:</h4>
                    <div className="flex flex-wrap gap-1">
                      {condition.symptoms.map((symptom: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {condition.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-teal-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('symptoms.disclaimer')}. Please consult with a qualified healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomCheckerPage;