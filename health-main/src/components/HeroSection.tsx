import React from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  Pill,
  Brain,
  Layers,
  Users,
  Store,
  Wheat,
  KeyRound,
  User,
  Calendar,
  Video,
  FileText,
  HeartPulse,
} from 'lucide-react';

const HeroSection: React.FC = () => {
  type Lang = 'en' | 'hi' | 'pa';
  const [lang, setLang] = React.useState<Lang>('en');

  const translations: Record<
    Lang,
    {
      title: string;
      subtitle: string;
      getStarted: string;
      register: string;
      rakwali: string;
      features: string;
      outcomes: string;
      stakeholders: string;
      expectedOutcomesTitle: string;
      expectedOutcomesDesc: string;
      stakeholdersTitle: string;
      stakeholdersDesc: string;
      featuresTitle: string;
      featuresDesc: string;
      outcomesList: { title: string; desc: string }[];
      stakeholdersList: { title: string; desc: string; bullets: string[] }[];
      featuresList: string[];
    }
  > = {
    en: {
      title: 'Telemedicine Access for Rural Healthcare in Nabha',
      subtitle: 'Connecting 173 villages to accessible, affordable, and timely medical care.',
      getStarted: 'Get Started',
      register: 'Register',
      rakwali: 'Rakhwali',
      features: 'Features',
      outcomes: 'Outcomes',
      stakeholders: 'Stakeholders',
      expectedOutcomesTitle: 'Expected Outcomes',
      expectedOutcomesDesc:
        'Transforming rural healthcare accessibility through innovative telemedicine solutions.',
      stakeholdersTitle: 'Stakeholders & Beneficiaries',
      stakeholdersDesc: 'Empowering rural communities through accessible healthcare technology.',
      featuresTitle: 'MVP Features - Hackathon Demo Scope',
      featuresDesc:
        'Core telemedicine capabilities designed specifically for rural healthcare accessibility and offline functionality.',
      outcomesList: [
        { title: 'Multilingual Telemedicine App', desc: 'Accessible in English, Punjabi, and Hindi for inclusive care.' },
        { title: 'Real-time Pharmacy Updates', desc: 'Live medicine availability and updates for rural pharmacies.' },
        { title: 'AI-powered Triage', desc: 'Smart symptom checker and triage for faster care.' },
        { title: 'Scalable Framework', desc: 'Designed for easy expansion to more villages and clinics.' },
      ],
      stakeholdersList: [
        {
          title: 'Rural Patients',
          desc: 'Improved access to doctors, timely consultations, and digital records.',
          bullets: ['No travel required', 'Language support', 'Affordable care'],
        },
        {
          title: 'Local Pharmacies',
          desc: 'Real-time inventory, digital prescriptions, and streamlined operations.',
          bullets: ['Live medicine updates', 'Easy prescription management', 'Community trust'],
        },
        {
          title: 'Farmers & Daily-wage Earners',
          desc: 'Healthcare access without loss of wages or productivity.',
          bullets: ['Remote consultations', 'Flexible scheduling', 'Reduced downtime'],
        },
      ],
      featuresList: [
        'OTP Authentication',
        'Patient & Doctor Profiles',
        'Appointment Booking',
        'Video Consultation',
        'Digital Prescriptions',
        'AI Symptom Checker',
      ],
    },
    hi: {
      title: 'नाभा में ग्रामीण स्वास्थ्य सेवा के लिए टेलीमेडिसिन पहुँच',
      subtitle: '173 गाँवों को सुलभ, किफायती और समय पर चिकित्सा सेवा से जोड़ना।',
      getStarted: 'शुरू करें',
      register: 'रजिस्टर करें',
      rakwali: 'रखवाली',
      features: 'विशेषताएँ',
      outcomes: 'परिणाम',
      stakeholders: 'हितधारक',
      expectedOutcomesTitle: 'अपेक्षित परिणाम',
      expectedOutcomesDesc: 'नवोन्मेषी टेलीमेडिसिन समाधानों के माध्यम से ग्रामीण स्वास्थ्य सेवा की पहुँच में सुधार।',
      stakeholdersTitle: 'हितधारक और लाभार्थी',
      stakeholdersDesc: 'सुगम स्वास्थ्य तकनीक के माध्यम से ग्रामीण समुदायों को सशक्त बनाना।',
      featuresTitle: 'एमवीपी विशेषताएँ - हैकाथॉन डेमो दायरा',
      featuresDesc: 'ऑफ़लाइन कार्यक्षमता और ग्रामीण स्वास्थ्य सेवा की पहुँच के लिए डिज़ाइन की गई मुख्य टेलीमेडिसिन क्षमताएँ।',
      outcomesList: [
        { title: 'बहुभाषी टेलीमेडिसिन ऐप', desc: 'समावेशी देखभाल के लिए अंग्रेज़ी, पंजाबी और हिंदी में उपलब्ध।' },
        { title: 'रियल-टाइम फ़ार्मेसी अपडेट', desc: 'ग्रामीण फ़ार्मेसियों के लिए दवाइयों की उपलब्धता और ताज़ा जानकारी।' },
        { title: 'एआई-संचालित ट्रायज', desc: 'तेज़ उपचार के लिए स्मार्ट लक्षण चेकर और ट्रायज।' },
        { title: 'विस्तार योग्य ढाँचा', desc: 'अधिक गाँवों और क्लीनिकों में आसानी से विस्तार के लिए डिज़ाइन।' },
      ],
      stakeholdersList: [
        {
          title: 'ग्रामीण रोगी',
          desc: 'डॉक्टरों तक बेहतर पहुँच, समय पर परामर्श और डिजिटल रिकॉर्ड।',
          bullets: ['यात्रा की आवश्यकता नहीं', 'भाषा समर्थन', 'किफायती देखभाल'],
        },
        {
          title: 'स्थानीय फ़ार्मेसियाँ',
          desc: 'रियल-टाइम स्टॉक, डिजिटल प्रिस्क्रिप्शन और सरल संचालन।',
          bullets: ['लाइव दवा अपडेट', 'आसान प्रिस्क्रिप्शन प्रबंधन', 'समुदाय का भरोसा'],
        },
        {
          title: 'किसान और दैनिक मज़दूर',
          desc: 'आय या उत्पादकता के नुकसान के बिना स्वास्थ्य सेवा तक पहुँच।',
          bullets: ['दूरस्थ परामर्श', 'लचीला समय निर्धारण', 'कम समय की बर्बादी'],
        },
      ],
      featuresList: [
        'ओटीपी प्रमाणीकरण',
        'रोगी और डॉक्टर प्रोफ़ाइल',
        'अपॉइंटमेंट बुकिंग',
        'वीडियो परामर्श',
        'डिजिटल प्रिस्क्रिप्शन',
        'एआई लक्षण चेकर',
      ],
    },
    pa: {
      title: 'ਨਾਭਾ ਵਿੱਚ ਪਿੰਡਾਂ ਲਈ ਟੈਲੀਮੈਡੀਸਿਨ ਸੇਵਾ',
      subtitle: '173 ਪਿੰਡਾਂ ਨੂੰ ਸਸਤੀ, ਸਮੇਂ-ਸਿਰ ਅਤੇ ਪਹੁੰਚਯੋਗ ਡਾਕਟਰੀ ਸੇਵਾ ਨਾਲ ਜੋੜਨਾ।',
      getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
      register: 'ਰਜਿਸਟਰ ਕਰੋ',
      rakwali: 'ਰਖਵਾਲੀ',
      features: 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      outcomes: 'ਨਤੀਜੇ',
      stakeholders: 'ਹਿੱਸੇਦਾਰ',
      expectedOutcomesTitle: 'ਉਮੀਦਵਾਰ ਨਤੀਜੇ',
      expectedOutcomesDesc: 'ਨਵੇਂ ਟੈਲੀਮੈਡੀਸਿਨ ਹੱਲਾਂ ਰਾਹੀਂ ਪਿੰਡਾਂ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣਾ।',
      stakeholdersTitle: 'ਹਿੱਸੇਦਾਰ ਅਤੇ ਲਾਭਪਾਤਰੀ',
      stakeholdersDesc: 'ਸੁਗਮ ਸਿਹਤ ਤਕਨਾਲੋਜੀ ਰਾਹੀਂ ਪਿੰਡਾਂ ਦੀ ਭਾਈਚਾਰੇ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ।',
      featuresTitle: 'ਐਮ.ਵੀ.ਪੀ. ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ - ਹੈਕਾਥਾਨ ਡੈਮੋ ਦਾਇਰਾ',
      featuresDesc: 'ਪਿੰਡਾਂ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਅਤੇ ਆਫਲਾਈਨ ਕਾਰਗੁਜ਼ਾਰੀ ਲਈ ਬਣਾਈਆਂ ਮੁੱਖ ਟੈਲੀਮੈਡੀਸਿਨ ਖੂਬੀਆਂ।',
      outcomesList: [
        { title: 'ਬਹੁਭਾਸ਼ੀ ਟੈਲੀਮੈਡੀਸਿਨ ਐਪ', desc: 'ਅੰਗਰੇਜ਼ੀ, ਪੰਜਾਬੀ ਅਤੇ ਹਿੰਦੀ ਵਿੱਚ ਉਪਲਬਧ।' },
        { title: 'ਰਿਅਲ-ਟਾਈਮ ਫਾਰਮੇਸੀ ਅਪਡੇਟਸ', desc: 'ਪਿੰਡਾਂ ਦੀਆਂ ਫਾਰਮੇਸੀਆਂ ਲਈ ਦਵਾਈਆਂ ਦੀ ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ।' },
        { title: 'ਏਆਈ ਸੰਚਾਲਿਤ ਟ੍ਰਾਇਅਜ', desc: 'ਤੇਜ਼ ਇਲਾਜ ਲਈ ਸਮਾਰਟ ਲੱਛਣ ਚੈੱਕਰ ਅਤੇ ਟ੍ਰਾਇਅਜ।' },
        { title: 'ਵਿਸਤਾਰਯੋਗ ਢਾਂਚਾ', desc: 'ਵਧੇਰੇ ਪਿੰਡਾਂ ਅਤੇ ਕਲੀਨਿਕਾਂ ਵਿੱਚ ਆਸਾਨੀ ਨਾਲ ਵਿਸਤਾਰ ਲਈ ਡਿਜ਼ਾਇਨ।' },
      ],
      stakeholdersList: [
        {
          title: 'ਪਿੰਡਾਂ ਦੇ ਮਰੀਜ਼',
          desc: 'ਡਾਕਟਰਾਂ ਤੱਕ ਵਧੀਆ ਪਹੁੰਚ, ਸਮੇਂ-ਸਿਰ ਪਰਾਮਰਸ਼ ਅਤੇ ਡਿਜ਼ੀਟਲ ਰਿਕਾਰਡ।',
          bullets: ['ਯਾਤਰਾ ਦੀ ਲੋੜ ਨਹੀਂ', 'ਭਾਸ਼ਾ ਸਹਾਇਤਾ', 'ਸਸਤੀ ਸੇਵਾ'],
        },
        {
          title: 'ਸਥਾਨਕ ਫਾਰਮੇਸੀਆਂ',
          desc: 'ਰਿਅਲ-ਟਾਈਮ ਸਟਾਕ, ਡਿਜ਼ੀਟਲ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਅਤੇ ਸਰਲ ਕਾਰਜ।',
          bullets: ['ਲਾਈਵ ਦਵਾਈਆਂ ਅਪਡੇਟ', 'ਸੌਖਾ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਪ੍ਰਬੰਧਨ', 'ਭਰੋਸੇਯੋਗਤਾ'],
        },
        {
          title: 'ਕਿਸਾਨ ਅਤੇ ਰੋਜ਼ਾਨਾ ਮਜ਼ਦੂਰ',
          desc: 'ਆਮਦਨ ਜਾਂ ਉਤਪਾਦਕਤਾ ਦੇ ਨੁਕਸਾਨ ਤੋਂ ਬਿਨਾਂ ਸਿਹਤ ਸੇਵਾ ਦੀ ਪਹੁੰਚ।',
          bullets: ['ਦੂਰਸਥ ਪਰਾਮਰਸ਼', 'ਲਚਕੀਲਾ ਸਮਾਂ', 'ਘੱਟ ਸਮੇਂ ਦੀ ਬਰਬਾਦੀ'],
        },
      ],
      featuresList: [
        'ਓਟੀਪੀ ਪ੍ਰਮਾਣਿਕਤਾ',
        'ਮਰੀਜ਼ ਅਤੇ ਡਾਕਟਰ ਪ੍ਰੋਫ਼ਾਈਲ',
        'ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ',
        'ਵੀਡੀਓ ਪਰਾਮਰਸ਼',
        'ਡਿਜ਼ੀਟਲ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ',
        'ਏਆਈ ਲੱਛਣ ਚੈੱਕਰ',
      ],
    },
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 via-teal-200 to-green-200 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold" style={{ color: '#0d9488' }}>{t.rakwali}</div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-[#0d9488] hover:text-[#0d9488] font-medium">{t.features}</a>
          <a href="#outcomes" className="text-[#0d9488] hover:text-[#0d9488] font-medium">{t.outcomes}</a>
          <a href="#stakeholders" className="text-[#0d9488] hover:text-[#0d9488] font-medium">{t.stakeholders}</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/register">
            <button className="bg-white text-[#0d9488] border border-[#0d9488] px-4 py-2 rounded-lg font-semibold hover:bg-[#0d9488] hover:text-white transition">
              {t.register}
            </button>
          </Link>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none"
            value={lang}
            onChange={e => setLang(e.target.value as Lang)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
          </select>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="flex-1 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">{t.subtitle}</p>
          <Link to="/register">
            <button className="ml-4 bg-white text-[#0d9488] border border-[#0d9488] px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-[#0d9488] hover:text-white transition">
              {t.getStarted}
            </button>
          </Link>
        </div>
        <div className="w-80 h-80 bg-blue-100 rounded-xl overflow-hidden shadow-lg">
  <img
    src="/photos/image.png"
    alt="Doctor consulting rural patients"
    className="w-full h-full object-cover"
  />
</div>

      </div>

 {/* Features Section */}
      <section id="features" className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0d9488' }}>{t.featuresTitle}</h2>
          <p className="text-lg text-gray-600 mb-8">{t.featuresDesc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {t.featuresList.map((title, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                {[<KeyRound className="h-8 w-8 text-blue-500" />, <User className="h-8 w-8 text-green-500" />, <Calendar className="h-8 w-8 text-purple-500" />, <Video className="h-8 w-8 text-orange-500" />, <FileText className="h-8 w-8 text-teal-500" />, <HeartPulse className="h-8 w-8 text-pink-500" />][idx]}
                <h3 className="mt-4 font-semibold text-lg text-gray-800">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Outcomes Section */}
      <section id="outcomes" className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0d9488' }}>{t.expectedOutcomesTitle}</h2>
          <p className="text-lg text-gray-600 mb-8">{t.expectedOutcomesDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.outcomesList.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                {[<Languages className="h-8 w-8 text-blue-500" />, <Pill className="h-8 w-8 text-green-500" />, <Brain className="h-8 w-8 text-orange-500" />, <Layers className="h-8 w-8 text-purple-500" />][idx]}
                <h3 className="mt-4 font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section id="stakeholders" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0d9488' }}>{t.stakeholdersTitle}</h2>
          <p className="text-lg text-gray-600 mb-8">{t.stakeholdersDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.stakeholdersList.map((item, idx) => (
              <div key={idx} className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center text-center">
                {[<Users className="h-12 w-12 text-blue-400" />, <Store className="h-12 w-12 text-green-400" />, <Wheat className="h-12 w-12 text-yellow-400" />][idx]}
                <h3 className="mt-4 font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
                <ul className="mt-4 text-left list-disc list-inside text-gray-700 text-sm">
                  {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      
    </div>
  );
};

export default HeroSection;
