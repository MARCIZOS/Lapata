// src/components/ProtectedRoute.tsx  (SAFE REPLACEMENT if needed)
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../utils/auth';

const ProtectedRoute: React.FC<{ allowedRoles: Array<'citizen'|'doctor'|'pharmacy'>; children: React.ReactNode; }> = ({ allowedRoles, children }) => {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const user = authService.getCurrentUser();
      if (user) {
        setOk(allowedRoles.includes(user.role));
        setReady(true);
        clearInterval(t);
      } else if (!user && authService.isAuthenticated() === false) {
        setReady(true); setOk(false); clearInterval(t);
      }
    }, 150);
    return () => clearInterval(t);
  }, [allowedRoles]);

  if (!ready) return null; // or a loader
  if (!ok) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
