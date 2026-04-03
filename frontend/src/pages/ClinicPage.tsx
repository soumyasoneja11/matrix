import React from 'react';
import ClinicDashboard from '../components/Dashboard/ClinicDashboard';

/* ──────────────────────────────────────────────
   Clinic Page — wraps the dashboard
   ────────────────────────────────────────────── */

const ClinicPage: React.FC = () => {
  return (
    <div className="page page--clinic">
      <header className="page__header">
        <h1>Clinic Dashboard</h1>
        <p className="page__subtitle">
          Real-time view of all registered patients. Status updates are pushed via WebSocket.
        </p>
      </header>

      <main className="page__content">
        <ClinicDashboard />
      </main>
    </div>
  );
};

export default ClinicPage;
