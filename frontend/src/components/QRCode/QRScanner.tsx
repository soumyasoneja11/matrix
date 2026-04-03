import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { QRScanResult } from '../../types/patient';

/* ──────────────────────────────────────────────
   QRScanner – clinic-side camera scanner
   ────────────────────────────────────────────── */

interface QRScannerProps {
  /** Called when a QR code is successfully decoded */
  onScan: (result: QRScanResult) => void;
  /** Called on scanning errors (optional) */
  onError?: (error: string) => void;
}

const SCANNER_REGION_ID = 'qr-scanner-region';

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = async () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode(SCANNER_REGION_ID);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan({ patientId: decodedText, decodedText });
          stopScanner();
        },
        (errorMessage) => {
          /* Ignore frame-level scan failures */
          void errorMessage;
        },
      );
      setIsScanning(true);
    } catch (err: any) {
      onError?.(err?.message ?? 'Camera access denied');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        /* already stopped */
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="qr-scanner">
      <div id={SCANNER_REGION_ID} className="qr-scanner__viewport" />

      <div className="qr-scanner__controls">
        {!isScanning ? (
          <button className="btn btn--primary" onClick={startScanner}>
            📷 Start Scanner
          </button>
        ) : (
          <button className="btn btn--secondary" onClick={stopScanner}>
            ⏹ Stop Scanner
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
