import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100/30 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-primary-600 font-medium">Loading ER Triage Sprint...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignUp ? (
      <SignUpPage onSwitchToLogin={() => setShowSignUp(false)} />
    ) : (
      <LoginPage onSwitchToSignUp={() => setShowSignUp(true)} />
    );
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
