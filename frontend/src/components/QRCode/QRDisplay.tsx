import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Patient } from '../../types/patient';

/* ──────────────────────────────────────────────
   QRDisplay – show QR code after registration
   ────────────────────────────────────────────── */

interface QRDisplayProps {
  patient: Patient;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ patient }) => {
  return (
    <div className="qr-display">
      <div className="qr-display__card">
        <h3 className="qr-display__title">Registration Successful!</h3>

        <div className="qr-display__code">
          <QRCodeSVG
            value={patient.qrCode || patient.id}
            size={220}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#1a1a2e"
          />
        </div>

        <div className="qr-display__info">
          <p className="qr-display__name">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="qr-display__id">ID: {patient.id}</p>
          <span className={`triage-badge triage-badge--${patient.triageLevel.toLowerCase()}`}>
            {patient.triageLevel}
          </span>
        </div>

        <p className="qr-display__hint">
          Show this QR code at the clinic reception for quick check-in.
        </p>
      </div>
    </div>
  );
};

export default QRDisplay;
