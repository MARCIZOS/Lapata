import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import { authService } from './utils/auth';

// Auth Pages
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';

// Dashboard Pages
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

// Patient Pages
import PatientConsultation from './pages/PatientConsultation';
import HealthRecordsPage from './pages/HealthRecordsPage';
import MedicinesPage from './pages/MedicinesPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const user = authService.getCurrentUser();

  // Redirect to appropriate dashboard if already logged in
  const getDefaultRoute = () => {
    if (!user) return '/register';
    
    switch (user.role) {
      case 'citizen': return '/patient';
      case 'doctor': return '/doctor';
      case 'pharmacy': return '/pharmacy';
      default: return '/register';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes - Patient */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/consultation" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <PatientConsultation />
          </ProtectedRoute>
        } />
        <Route path="/patient/records" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <HealthRecordsPage />
          </ProtectedRoute>
        } />
        <Route path="/patient/medicines" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <MedicinesPage />
          </ProtectedRoute>
        } />
        <Route path="/patient/symptoms" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <SymptomCheckerPage />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Doctor */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Pharmacy */}
        <Route path="/pharmacy" element={
          <ProtectedRoute allowedRoles={['pharmacy']}>
            <PharmacyDashboard />
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;