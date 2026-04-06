import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTheme } from '../../hooks/contexts/ThemeContext';
import { PatientHistoryRecord } from '../../types';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaHospital } from 'react-icons/fa';
import { Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useCallback } from 'react';

interface PatientHistoryHeaderProps {
  patient: PatientHistoryRecord;
  onClose: () => void;
}

const PatientHistoryHeader: React.FC<PatientHistoryHeaderProps> = ({ patient, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const qrRef = useRef<HTMLDivElement>(null);

  const latestVisit = patient.visits[0];
  const totalVisits = patient.visits.length;
  const lastVisitDate = new Date(latestVisit?.date || Date.now());
  const departments = [...new Set(patient.visits.map(v => v.department).filter(Boolean))];

  const qrData = `${window.location.origin}/patient/${patient.id}`;

  const handleDownloadQR = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `patient-${patient.id}-history-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [patient.id]);

  const labelClass = `text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/35'}`;
  const valueClass = `text-sm font-medium ${isLight ? 'text-gray-800' : 'text-white/85'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 ${isLight ? '' : 'border-white/10'}`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className={`text-2xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
                  {patient.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'}`}>
                  ID-{patient.id}
                </span>
              </div>
              <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                {patient.age ? `Age ${patient.age}` : 'Age N/A'}
                {patient.gender ? ` · ${patient.gender}` : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isLight
                ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              ← Back to list
            </button>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            {patient.contactPhone && (
              <div className="flex items-center gap-2">
                <FaPhone size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>{patient.contactPhone}</span>
              </div>
            )}
            {patient.contactEmail && (
              <div className="flex items-center gap-2">
                <FaEnvelope size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-white/70'}`}>{patient.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className={`px-4 py-3 rounded-xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'}`}>
              <p className={labelClass}>Total Visits</p>
              <p className={`text-lg font-bold tabular-nums ${isLight ? 'text-[#247B7B]' : 'text-primary-400'}`}>{totalVisits}</p>
            </div>
            <div className={`px-4 py-3 rounded-xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'}`}>
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt size={9} className={isLight ? 'text-gray-400' : 'text-white/35'} />
                <p className={labelClass}>Last Visit</p>
              </div>
              <p className={valueClass}>
                {lastVisitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-4 py-3 rounded-xl ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'}`}>
              <div className="flex items-center gap-1.5">
                <FaHospital size={9} className={isLight ? 'text-gray-400' : 'text-white/35'} />
                <p className={labelClass}>Departments</p>
              </div>
              <p className={`text-sm font-medium truncate ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
                {departments.length > 0 ? departments.join(', ') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: QR Code */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div
            ref={qrRef}
            className={`p-3 rounded-xl ${isLight ? 'bg-white border border-gray-100 shadow-sm' : 'bg-white rounded-xl'}`}
          >
            <QRCodeCanvas
              value={qrData}
              size={120}
              bgColor="#ffffff"
              fgColor="#1a2e2e"
              level="M"
              includeMargin={false}
            />
          </div>
          <button
            onClick={handleDownloadQR}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isLight
              ? 'bg-[#e8f5f5] text-[#247B7B] hover:bg-[#d5edec] border border-[#247B7B]/20'
              : 'bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 border border-primary-500/20'
            }`}
          >
            <Download size={11} />
            Download QR
          </button>
          <p className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
            <QrCode size={10} />
            Scan for full history
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientHistoryHeader;
