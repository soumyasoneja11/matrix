import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Sparkles,
  Trash2,
  Ear,
  Brain,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextAreaField, SelectField } from '../components/ui/InputField';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { patientAPI } from '../services/api';
import type { Patient } from '../types/patient';
import mikePng from '../assets/images/mike.png';

const languageOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-IN', label: 'English (India)' },
  { value: 'hi-IN', label: 'Hindi (India) - हिंदी' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
];

interface PatientTriagePageProps {
  patients: Patient[];
  lastUpdated: Date;
  onRefresh: () => void;
}

export function PatientTriagePage({ patients, lastUpdated, onRefresh }: PatientTriagePageProps) {
  const [language, setLanguage] = useState('en-US');
  const [patientText, setPatientText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const { isListening, startListening, stopListening, transcript, resetTranscript } =
    useVoiceRecognition({ language });

  // Sync transcript
  React.useEffect(() => {
    if (transcript) setPatientText(transcript);
  }, [transcript]);

  const handleAnalyze = async () => {
    if (!patientText.trim()) return;
    setAnalyzing(true);
    try {
      await patientAPI.triage({ patientDetails: patientText, language });
      onRefresh();
      setPatientText('');
      resetTranscript();
    } catch {
      // handle error
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setPatientText('');
    resetTranscript();
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const criticalPatients = patients.filter((p) => p.triageLevel === 'CRITICAL');
  const urgentPatients = patients.filter((p) => p.triageLevel === 'URGENT');
  const standardPatients = patients.filter((p) => p.triageLevel === 'STANDARD');

  return (
    <div className="space-y-8">
      {/* ── Hero: Voice Input Section ─── */}
      <Card className="overflow-hidden" padding="none">
        <div className="p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Voice Intelligence for Emergency Care</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time patient intake powered by clinical AI</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Input + Controls */}
            <div className="lg:col-span-2 space-y-5">
              <SelectField
                label="🎙 Voice Input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={languageOptions}
              />

              {/* Mic Button */}
              <div className="flex justify-center py-4">
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isListening
                      ? 'bg-linear-to-br from-red-400 to-red-600 animate-pulse-glow'
                      : 'bg-linear-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700'
                  } shadow-xl`}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
                  )}
                  <img src={mikePng} alt="Microphone" className="w-8 h-8 object-contain filter brightness-0 invert" />
                </motion.button>
              </div>

              {/* Pro tip */}
              <div className="bg-primary-50/60 rounded-2xl px-4 py-3 text-xs text-primary-700 flex items-center gap-2">
                <span>💡</span>
                <span><strong>Pro Tip:</strong> Include age, key symptoms, pain level, and duration for best AI triage accuracy.</span>
              </div>

              {/* Patient Info */}
              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  📋 Patient Information
                </label>
                <TextAreaField
                  placeholder="Record or type patient details..."
                  value={patientText}
                  onChange={(e) => setPatientText(e.target.value)}
                  rows={5}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleAnalyze} disabled={analyzing || !patientText.trim()} className="flex-1">
                  {analyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Analyze & Triage
                    </>
                  )}
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                  <Trash2 size={15} />
                  Clear
                </Button>
              </div>
            </div>

            {/* RIGHT: Capsule Visualizer */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-44 h-80 rounded-[4rem] bg-linear-to-b from-primary-800/90 to-primary-950/95 backdrop-blur-xl border border-primary-700/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent rounded-[4rem]" />

                {/* Waveform bars */}
                <div className="flex items-end gap-1 h-24 relative z-10">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 rounded-full bg-linear-to-t from-primary-400 to-primary-300"
                      animate={isListening ? {
                        height: [8, 30 + Math.random() * 40, 8],
                      } : { height: 8 }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>

                <p className="text-primary-300/60 text-xs mt-6 font-medium relative z-10">
                  {isListening ? 'Listening...' : 'Ready'}
                </p>

                {/* Glow effect when active */}
                {isListening && (
                  <div className="absolute inset-0 rounded-[4rem] bg-primary-500/10 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards row */}
        <div className="border-t border-gray-100/60 bg-white/30 px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Ear size={20} />, title: 'Listen and record', desc: 'Capture spoken patient details clearly from staff and attendants.' },
              { icon: <Brain size={20} />, title: 'Extract symptoms', desc: 'Convert raw speech into structured symptoms, vitals, and history.' },
              { icon: <CheckCircle2 size={20} />, title: 'Set triage priority', desc: 'Generate first-urgency guidance for immediate emergency action.' },
            ].map((f, i) => (
              <Card key={i} variant="solid" padding="sm" hover className="rounded-2xl! bg-white/50! border-0! shadow-none! hover:bg-white/80!">
                <div className="flex items-start gap-3 p-2">
                  <div className="text-primary-600 mt-0.5">{f.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{f.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Live Triage Dashboard (Kanban) ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🏥 Live Triage Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Real-time patient priority queue — auto-refreshes every 4 seconds
            </p>
          </div>
          <button onClick={onRefresh} className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary-600 transition-colors cursor-pointer">
            <RefreshCw size={13} />
            <Clock size={13} />
            LAST UPDATED: {lastUpdated.toLocaleTimeString()}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Critical Column */}
          <KanbanColumn
            title="CRITICAL"
            subtitle="Immediate action required"
            color="red"
            patients={criticalPatients}
          />

          {/* Urgent Column */}
          <KanbanColumn
            title="URGENT"
            subtitle="Monitor closely"
            color="amber"
            patients={urgentPatients}
          />

          {/* Standard Column */}
          <KanbanColumn
            title="STANDARD"
            subtitle="Safe to wait"
            color="green"
            patients={standardPatients}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Column ──────────────────────── */
function KanbanColumn({
  title,
  subtitle,
  color,
  patients,
}: {
  title: string;
  subtitle: string;
  color: 'red' | 'amber' | 'green';
  patients: Patient[];
}) {
  const colorMap = {
    red: {
      dot: 'bg-red-500',
      badge: 'bg-red-100 text-red-700',
      bg: 'bg-red-50/40',
      border: 'border-red-200/40',
    },
    amber: {
      dot: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-700',
      bg: 'bg-amber-50/40',
      border: 'border-amber-200/40',
    },
    green: {
      dot: 'bg-green-500',
      badge: 'bg-green-100 text-green-700',
      bg: 'bg-green-50/40',
      border: 'border-green-200/40',
    },
  };

  const c = colorMap[color];

  return (
    <div className={`rounded-3xl ${c.bg} border ${c.border} p-4 min-h-[300px]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
          <span className="text-xs font-bold tracking-wider text-gray-700">{title}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
          {patients.length}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 mb-3">{subtitle}</p>

      <div className="space-y-3">
        {patients.length === 0 ? (
          <EmptyState
            icon={color === 'red' ? '✅' : color === 'amber' ? '👍' : '🗂️'}
            title={`No ${title.toLowerCase()} patients`}
          />
        ) : (
          patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} color={color} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Patient Card ──────────────────────────── */
function PatientCard({ patient, color }: { patient: Patient; color: string }) {
  const badgeVariant = color === 'red' ? 'critical' : color === 'amber' ? 'urgent' : 'standard';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/60 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-800">{patient.name || 'Unknown'}</h4>
        <Badge variant={badgeVariant}>{patient.triageLevel}</Badge>
      </div>

      {patient.age && (
        <p className="text-xs text-gray-500 mb-1">Age: {patient.age}</p>
      )}

      {patient.chiefComplaint && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{patient.chiefComplaint}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2">
        {patient.zoneName && <Badge variant="info">{patient.zoneName}</Badge>}
        {patient.roomCode && <Badge variant="default">{patient.roomCode}</Badge>}
        {patient.assignedNurse && <Badge variant="default">🩺 {patient.assignedNurse}</Badge>}
      </div>
    </motion.div>
  );
}
