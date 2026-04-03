import React, { useState } from 'react';
import RegistrationForm from '../components/PatientRegistration/RegistrationForm';
import QRDisplay from '../components/QRCode/QRDisplay';
import type { Patient } from '../types/patient';

/* ──────────────────────────────────────────────
   Register Page — patient self-registration
   ────────────────────────────────────────────── */

const RegisterPage: React.FC = () => {
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  return (
    <div className="page page--register">
      <header className="page__header">
        <h1>Patient Registration</h1>
        <p className="page__subtitle">
          Fill in the details below or use voice input for a faster experience.
        </p>
      </header>

      <main className="page__content">
        {registeredPatient ? (
          <>
            <QRDisplay patient={registeredPatient} />
            <button
              className="btn btn--secondary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setRegisteredPatient(null)}
            >
              Register Another Patient
            </button>
          </>
        ) : (
          <RegistrationForm onSuccess={setRegisteredPatient} />
        )}
      </main>
    </div>
  );
};

export default RegisterPage;
