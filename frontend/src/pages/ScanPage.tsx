import React, { useState } from 'react';
import QRScanner from '../components/QRCode/QRScanner';
import { getPatientByQR } from '../services/api';
import type { Patient, QRScanResult } from '../types/patient';

/* ──────────────────────────────────────────────
   Scan Page — clinic-side QR scanner
   ────────────────────────────────────────────── */

const ScanPage: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (result: QRScanResult) => {
    setError(null);
    setLoading(true);
    try {
      const found = await getPatientByQR(result.decodedText);
      setPatient(found);
    } catch {
      setError('Patient not found. Please try scanning again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--scan">
      <header className="page__header">
        <h1>Scan Patient QR</h1>
        <p className="page__subtitle">
          Point the camera at a patient's QR code for instant check-in.
        </p>
      </header>

      <main className="page__content">
        <QRScanner onScan={handleScan} onError={setError} />

        {loading && (
          <div className="scan-loading">
            <div className="spinner" />
            <p>Looking up patient…</p>
          </div>
        )}

        {error && <div className="scan-error">{error}</div>}

        {patient && (
          <div className="scan-result">
            <h3>Patient Found</h3>
            <div className="scan-result__details">
              <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
              <p><strong>DOB:</strong> {patient.dateOfBirth}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Chief Complaint:</strong> {patient.chiefComplaint}</p>
              <p>
                <strong>Triage:</strong>{' '}
                <span className={`triage-badge triage-badge--${patient.triageLevel.toLowerCase()}`}>
                  {patient.triageLevel}
                </span>
              </p>
              <p><strong>Status:</strong> {patient.status}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanPage;
