import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ResourceAllocation from './pages/ResourceAllocation';
import StaffDirectory from './pages/StaffDirectory';
import StaffManagement from './pages/StaffManagement';
import MyWorklist from './pages/MyWorklist';
import Analytics from './pages/Analytics';
import RecycleBin from './pages/RecycleBin';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading VITALPASS...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → show auth pages
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUpPage onSwitchToLogin={() => {}} />} />
        <Route path="*" element={<LoginPage onSwitchToSignUp={() => {}} />} />
      </Routes>
    );
  }

  // Authenticated → show main app
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/triage" element={<Dashboard />} />
        <Route path="/resource-allocation" element={<ResourceAllocation />} />
        <Route path="/staff-directory" element={<StaffDirectory />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/my-worklist" element={<MyWorklist />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/recycle-bin" element={<RecycleBin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;