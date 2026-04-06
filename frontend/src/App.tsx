import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/contexts/AuthContext';
import { useTheme } from './hooks/contexts/ThemeContext';
import { NotificationProvider } from './hooks/contexts/NotificationContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ResourceAllocation from './pages/ResourceAllocation';
import StaffDirectory from './pages/StaffDirectory';
import StaffManagement from './pages/StaffManagement';
import MyWorklist from './pages/MyWorklist';
import Analytics from './pages/Analytics';
import RecycleBin from './pages/RecycleBin';

import PatientHistory from './pages/PatientHistory';
import PatientProfilePage from './pages/PatientProfilePage';

import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${
            isLight ? 'border-[#247B7B]' : 'border-primary-500'
          }`} />
          <p className="theme-text-muted text-sm">Loading VITALPASS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUpPage onSwitchToLogin={() => {}} />} />
        <Route path="*" element={<LoginPage onSwitchToSignUp={() => {}} />} />
      </Routes>
    );
  }

  // ✅ FIX: NotificationProvider wraps ALL authenticated routes.
  // Without this, useNotifications() in Header and TriageBoard had no
  // context to read from — the hook either threw or returned undefined.
  return (

    <NotificationProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/triage" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/resource-allocation" element={<MainLayout><ResourceAllocation /></MainLayout>} />
        <Route path="/staff-directory" element={<MainLayout><StaffDirectory /></MainLayout>} />
        <Route path="/staff-management" element={<MainLayout><StaffManagement /></MainLayout>} />
        <Route path="/my-worklist" element={<MainLayout><MyWorklist /></MainLayout>} />
        <Route path="/patient-history" element={<MainLayout><PatientHistory /></MainLayout>} />
        <Route path="/patient/:id" element={<MainLayout><PatientProfilePage /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
        <Route path="/recycle-bin" element={<MainLayout><RecycleBin /></MainLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>

  );
}

export default App;