import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  LayoutGrid,
  Users,
  UserCog,
  ClipboardList,
  BarChart3,
  Trash2,
  ArrowRight,
  Mic,
  Brain,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import hospitalBg from '../assets/images/hospital.png';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    icon: <Mic size={22} />,
    title: 'Voice-Powered Intake',
    desc: 'Capture patient details hands-free with multilingual speech recognition. Reduce documentation time by up to 60%.',
  },
  {
    icon: <Brain size={22} />,
    title: 'AI Clinical Triage',
    desc: 'Intelligent symptom extraction and urgency classification using clinical NLP models trained on emergency data.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Priority Queuing',
    desc: 'Automatic Kanban-style triage board with real-time CRITICAL / URGENT / STANDARD patient lanes.',
  },
  {
    icon: <Activity size={22} />,
    title: 'Live Analytics',
    desc: 'Track patient flow, triage times, and capacity metrics across zones with real-time dashboards.',
  },
];

const navTabs = [
  { id: 'patient-triage', label: 'Patient Triage', icon: <HeartPulse size={20} />, desc: 'Voice intake & AI triage', gradient: 'from-red-500 to-red-600' },
  { id: 'resource-allocation', label: 'Resource Allocation', icon: <LayoutGrid size={20} />, desc: 'Zones & room capacity', gradient: 'from-blue-500 to-blue-600' },
  { id: 'staff-directory', label: 'Staff Directory', icon: <Users size={20} />, desc: 'Team roster & roles', gradient: 'from-purple-500 to-purple-600' },
  { id: 'staff-management', label: 'Staff Management', icon: <UserCog size={20} />, desc: 'Assignments & scheduling', gradient: 'from-pink-500 to-pink-600' },
  { id: 'my-worklist', label: 'My Worklist', icon: <ClipboardList size={20} />, desc: 'Your active patients', gradient: 'from-primary-500 to-primary-600' },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, desc: 'Metrics & trends', gradient: 'from-amber-500 to-amber-600' },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <Trash2 size={20} />, desc: 'Deleted records', gradient: 'from-forest-500 to-forest-600' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Full-screen hospital background ── */}
      <div className="fixed inset-0 -z-10">
        <img
          src={hospitalBg}
          alt="Hospital"
          className="w-full h-full object-cover"
        />
        {/* Dark forest-green overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/70 to-forest-950/90" />
      </div>

      {/* ── Content - FULL WIDTH CONTAINER ── */}
      <div className="relative z-10 max-w-full mx-auto px-8 py-16 min-h-screen flex flex-col">
        
        {/* ─── Hero Section - CENTERED ─── */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Title - CENTERED */}
            <h1 className="text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 bg-clip-text text-transparent">
                VITALPASS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
              An AI-driven Clinical Command Center that uses voice intelligence to automate ER triage,
              slash documentation time, and prioritize life-saving care in real-time.
              Built for speed. Designed for saving lives.
            </p>

            {/* CTA */}
            <motion.button
              onClick={() => onNavigate('patient-triage')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-base shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all cursor-pointer"
            >
              Start Triage
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* ─── Feature Highlights - 4 BOXES (FULL WIDTH) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
         {features.map((f, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + i * 0.1 }}
    className="rounded-2xl bg-white/8 backdrop-blur-md border border-white/10 hover:bg-white/12 transition-all overflow-hidden"
    style={{ height: '120px' }}
  >
    <div className="p-3 h-full flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-300">
          {f.icon}
        </div>
        <h4 className="text-sm font-bold text-white">{f.title}</h4>
      </div>
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{f.desc}</p>
    </div>
  </motion.div>
))}
        </motion.div>

        {/* ─── Quick Navigation Tabs - FULL WIDTH LEFT TO RIGHT ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full"
        >
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold text-center mb-5">
            Quick Navigation
          </p>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {navTabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.06 }}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tab.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  {tab.icon}
                </div>
                <span className="text-[11px] font-semibold text-white/80 text-center leading-tight">
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}