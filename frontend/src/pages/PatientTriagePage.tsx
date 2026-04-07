import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Trash2, Ear, Brain, CheckCircle2, Clock, RefreshCw, 
  Mic, MicOff, Activity, Heart, Users, Stethoscope, ChevronRight,
  AlertCircle, Droplet, Thermometer, Wind
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextAreaField, SelectField } from '../components/ui/InputField';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useCloudVoiceRecording } from '../hooks/useCloudVoiceRecording';
import { patientAPI } from '../services/api';
import { Patient } from '../types';
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
  console.log('patients:', patients);
  console.log('urgent:', patients.filter(p => p.priority === 'YELLOW'));
  const [language, setLanguage] = useState('en-US');
  const [patientText, setPatientText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isRecording,
    processing: voiceProcessing,
    error: voiceError,
    startRecording,
    stopRecording,
  } = useCloudVoiceRecording();

  React.useEffect(() => {
    if (voiceError) setError(voiceError);
  }, [voiceError]);

  const handleAnalyze = async () => {
    if (!patientText.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      await patientAPI.triage({ patientDetails: patientText, language });
      onRefresh();
      setPatientText('');
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check your connection and try again.');
      console.error('Triage analysis failed:', err);
    } finally { setAnalyzing(false); }
  };

  const handleClear = () => { setPatientText(''); };

  const toggleMic = async () => {
    setError(null);
    try {
      if (isRecording) {
        const text = await stopRecording();
        if (text) {
          setPatientText((prev) => (prev ? `${prev.trim()} ${text}` : text).trim());
        }
      } else {
        await startRecording();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Voice capture failed';
      setError(msg);
    }
  };

  const criticalPatients = patients.filter((p) => p.priority === 'RED' || p.priority === 'ORANGE');
  const urgentPatients = patients.filter((p) => p.priority === 'YELLOW');
  const standardPatients = patients.filter((p) => p.priority === 'GREEN' || p.priority === 'BLUE');

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-forest-900 to-forest-700 bg-clip-text text-transparent">
            Patient Triage
          </h1>
        </div>
        <p className="text-forest-500 ml-13 pl-0.5 text-sm">
          Voice-powered intake & AI-driven urgency classification
        </p>
      </motion.div>

      {/* Voice + Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Voice Capsule - Enhanced */}
        <div className="lg:col-span-4 flex justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-[320px]"
          >
            <div className="relative bg-gradient-to-br from-forest-800 to-forest-950 rounded-3xl p-1 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-3xl pointer-events-none" />
              <div className="bg-gradient-to-b from-forest-900 to-forest-950 rounded-3xl p-8 flex flex-col items-center">
                {/* Waveform */}
                <div className="flex items-end gap-1.5 h-32 mb-8">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-primary-400 to-primary-300"
                      animate={isRecording ? {
                        height: [8, 40 + Math.random() * 50, 8],
                      } : { height: 8 }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.06,
                      }}
                    />
                  ))}
                </div>

                {/* Mic Button */}
                <motion.button
                  onClick={toggleMic}
                  disabled={voiceProcessing}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl disabled:opacity-60 disabled:pointer-events-none ${
                    isRecording
                      ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50'
                      : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
                  }`}
                >
                  {isRecording && (
                    <>
                      <motion.span
                        className="absolute inset-0 rounded-full bg-red-400/40"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full bg-red-400/20"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                      />
                    </>
                  )}
                  <img src={mikePng} alt="Mic" className="w-10 h-10 object-contain filter brightness-0 invert" />
                </motion.button>

                <p className="text-primary-300 text-sm mt-6 font-medium tracking-wide">
                  {voiceProcessing
                    ? 'Transcribing with AI...'
                    : isRecording
                      ? 'Recording... tap to stop'
                      : 'Tap to record'}
                </p>
                <p className="text-forest-400 text-xs mt-2 text-center">
                  {isRecording
                    ? 'Speak clearly — symptoms, vitals, history'
                    : 'Cloud STT: Hindi, English & Hinglish (Gemini + Whisper fallback)'}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-forest-900/20 blur-xl rounded-full" />
          </motion.div>
        </div>

        {/* Form Panel - Enhanced */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-frosted rounded-3xl p-8 shadow-xl border border-white/40"
          >
            <div className="flex flex-wrap gap-5 mb-6">
              <SelectField
                label="Voice Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={languageOptions}
                className="flex-1 min-w-[180px]"
              />
              <div className="flex-1 bg-primary-50/60 rounded-2xl px-4 py-3 flex items-center gap-3 text-forest-700 text-sm border border-primary-100">
                <Sparkles size={18} className="text-primary-500" />
                <span><strong>AI Tip:</strong> Include age, symptoms, pain level, and duration.</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-forest-800 mb-2 block flex items-center gap-2">
                <Stethoscope size={16} className="text-primary-600" />
                Patient Information
              </label>
              <TextAreaField
                placeholder="Describe patient condition: age, symptoms, vitals, history..."
                value={patientText}
                onChange={(e) => setPatientText(e.target.value)}
                rows={5}
                className="!rounded-2xl !border-forest-200/70 focus:!border-primary-400 !bg-white/80 !text-forest-900"
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-sm flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={analyzing || !patientText.trim()} 
                className="flex-1 !rounded-xl !h-12 !text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <><Sparkles size={16} className="mr-2" /> Analyze & Triage</>
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleClear}
                className="!rounded-xl !h-12 px-6 shadow-sm hover:shadow-md transition-all"
              >
                <Trash2 size={16} className="mr-2" /> Clear
              </Button>
            </div>
          </motion.div>

          {/* Feature Cards - Improved */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <Mic size={20} />, title: 'Voice Capture', desc: 'Hands-free, multilingual intake', gradient: 'from-blue-600 to-blue-700', color: 'blue' },
              { icon: <Brain size={20} />, title: 'AI Extraction', desc: 'Symptoms, vitals, history parsing', gradient: 'from-purple-600 to-purple-700', color: 'purple' },
              { icon: <AlertCircle size={20} />, title: 'Urgency Scoring', desc: 'Critical / Urgent / Standard', gradient: 'from-red-500 to-orange-600', color: 'red' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-md hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-3 shadow-md`}>
                  {f.icon}
                </div>
                <h4 className="font-bold text-forest-900">{f.title}</h4>
                <p className="text-xs text-forest-500 mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Dashboard - Redesigned with better spacing and cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
              <Heart size={24} className="text-primary-600" />
              Live Triage Dashboard
            </h2>
            <p className="text-forest-500 text-sm mt-1">Real-time priority queue — auto-refreshes every 4s</p>
          </div>
          <motion.button
            onClick={onRefresh}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-forest-100 hover:bg-white shadow-sm text-forest-600 text-sm font-medium"
          >
            <RefreshCw size={14} />
            <Clock size={14} />
            <span>{lastUpdated.toLocaleTimeString()}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <KanbanColumn title="CRITICAL" subtitle="Immediate action" color="red" patients={criticalPatients} />
          <KanbanColumn title="URGENT" subtitle="Monitor closely" color="amber" patients={urgentPatients} />
          <KanbanColumn title="STANDARD" subtitle="Safe to wait" color="green" patients={standardPatients} />
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Kanban Column
function KanbanColumn({ title, subtitle, color, patients }: {
  title: string; subtitle: string; color: 'red' | 'amber' | 'green'; patients: Patient[];
}) {
  const config = {
    red: { bg: 'bg-red-50/80', border: 'border-red-200', header: 'text-red-800', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
    amber: { bg: 'bg-amber-50/80', border: 'border-amber-200', header: 'text-amber-800', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
    green: { bg: 'bg-primary-50/80', border: 'border-primary-200', header: 'text-primary-800', dot: 'bg-primary-500', badge: 'bg-primary-100 text-primary-700' },
  };
  const c = config[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl ${c.bg} backdrop-blur-sm border ${c.border} shadow-lg overflow-hidden`}
    >
      <div className="p-5 border-b border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${c.dot} animate-pulse shadow-md`} />
            <h3 className={`font-bold text-lg ${c.header}`}>{title}</h3>
          </div>
          <Badge variant={color === 'red' ? 'critical' : color === 'amber' ? 'urgent' : 'standard'} className="text-xs font-bold px-3 py-1">
            {patients.length}
          </Badge>
        </div>
        <p className="text-xs text-forest-500 mt-2">{subtitle}</p>
      </div>

      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scroll">
        {patients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3 opacity-40">✓</div>
            <p className="text-sm text-forest-400 font-medium">No {title.toLowerCase()} patients</p>
          </div>
        ) : (
          patients.map((p, idx) => <PatientCardEnhanced key={p.id} patient={p} color={color} index={idx} />)
        )}
      </div>
    </motion.div>
  );
}

// Enhanced Patient Card
function PatientCardEnhanced({ patient, color, index }: { patient: Patient; color: string; index: number }) {
  const borderColor = color === 'red' ? 'border-l-red-500' : color === 'amber' ? 'border-l-amber-500' : 'border-l-primary-500';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className={`bg-white/90 rounded-xl p-4 shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-forest-900 line-clamp-1">{patient.name || 'Unnamed Patient'}</h4>
        <Badge variant={color === 'red' ? 'critical' : color === 'amber' ? 'urgent' : 'standard'} className="text-[10px]">
          {patient.priority || patient.triageLevel || 'UNKNOWN'}
        </Badge>
      </div>
      {(patient.age !== undefined && patient.age !== null) && (
        <p className="text-xs text-forest-500 mb-1 flex items-center gap-1">
          <span className="font-medium">Age:</span> {patient.age}
        </p>
      )}
      {patient.chiefComplaint && (
        <p className="text-xs text-forest-600 line-clamp-2 mb-3 leading-relaxed">
          {patient.chiefComplaint}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {patient.zoneName && (
          <Badge variant="info" className="text-[10px] px-2 py-0.5">
            📍 {patient.zoneName}
          </Badge>
        )}
        {patient.roomCode && (
          <Badge variant="default" className="text-[10px] px-2 py-0.5">
            🛏️ {patient.roomCode}
          </Badge>
        )}
        {patient.assignedNurse && (
          <Badge variant="default" className="text-[10px] px-2 py-0.5">
            🩺 {patient.assignedNurse}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}