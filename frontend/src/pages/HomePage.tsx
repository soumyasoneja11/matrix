import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  LayoutGrid,
  Users,
  UserCog,
  ClipboardList,
  BarChart3,
  Trash2,
  ArrowRight,
  Activity,
  Stethoscope,
} from 'lucide-react';
import hospitalBg from '../assets/images/hospital.png';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useAuth } from '../hooks/contexts/AuthContext';
import { FileText, IdCard } from 'lucide-react';

const staffNavTabs = [
  { path: '/dashboard', label: 'Dashboard', icon: <HeartPulse size={20} />, gradient: 'from-red-500 to-rose-600' },
  { path: '/resource-allocation', label: 'Resources', icon: <LayoutGrid size={20} />, gradient: 'from-blue-500 to-cyan-600' },
  { path: '/staff-directory', label: 'Staff', icon: <Users size={20} />, gradient: 'from-purple-500 to-violet-600' },
  { path: '/staff-management', label: 'Management', icon: <UserCog size={20} />, gradient: 'from-pink-500 to-fuchsia-600' },
  { path: '/my-worklist', label: 'Worklist', icon: <ClipboardList size={20} />, gradient: 'from-primary-500 to-indigo-600' },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, gradient: 'from-amber-500 to-orange-600' },
  { path: '/recycle-bin', label: 'Recycle Bin', icon: <Trash2 size={20} />, gradient: 'from-gray-500 to-slate-600' },
];

const patientNavTabs = [
  { path: '/patient-history', label: 'My History', icon: <FileText size={20} />, gradient: 'from-teal-500 to-cyan-600' },
  { path: '/patient/me', label: 'My Record', icon: <IdCard size={20} />, gradient: 'from-emerald-500 to-green-600' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isPatient = user?.role === 'PATIENT';
  const navTabs = isPatient ? patientNavTabs : staffNavTabs;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* ── Full-screen background ── */}
      <div className="fixed inset-0 -z-10">
        <img
          src={hospitalBg}
          alt="Hospital"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        {isLight ? (
          <>
            {/* Dark green overlay — heavier center for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2620]/75 via-[#142f28]/60 to-[#0d2620]/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f1a]/50 via-[#142f28]/30 to-[#0a1f1a]/60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/65 to-slate-950/85" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-950/30 via-transparent to-purple-950/20" />
          </>
        )}
      </div>

      {/* ── Hero Content ── */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full max-w-3xl mx-auto px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                isLight
                  ? 'bg-[#247B7B] shadow-[#247B7B]/25'
                  : 'bg-gradient-to-br from-primary-500 to-purple-600 shadow-primary-500/30'
              }`}>
                <Stethoscope size={26} className="text-white" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.1] mb-5 text-white"
              style={isLight ? { textShadow: '0 2px 12px rgba(0,0,0,0.35)' } : undefined}
            >
              Welcome to{' '}
              <span
                className={isLight
                  ? 'bg-gradient-to-r from-[#5ee6c8] to-[#7af0d8] bg-clip-text text-transparent font-extrabold'
                  : 'bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'
                }
                style={isLight ? { WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' } : undefined}
              >
                VitalPass
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-base md:text-lg leading-relaxed max-w-lg mb-10 text-white/85 mx-auto"
              style={isLight ? { textShadow: '0 1px 6px rgba(0,0,0,0.3)' } : undefined}
            >
              A smart emergency healthcare system that enables quick access to
              patient medical records and supports efficient triage during
              critical situations.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              onClick={() => navigate(isPatient ? '/patient-history' : '/triage')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl
                text-white font-semibold text-base
                transition-all duration-300 cursor-pointer ${
                  isLight
                    ? 'bg-[#247B7B] hover:bg-[#1e6868] shadow-lg shadow-[#247B7B]/30 hover:shadow-xl hover:shadow-[#247B7B]/40'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:from-primary-600 hover:to-primary-700'
                }`}
            >
              <Activity size={18} />
              {isPatient ? 'My medical history' : 'Start Triage'}
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="relative z-10 pb-6 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className={`p-3 rounded-2xl shadow-2xl ${
            isLight
              ? 'bg-white/20 backdrop-blur-xl border border-white/25 shadow-black/10'
              : 'backdrop-blur-3xl bg-white/[0.05] border border-white/[0.1]'
          }`}>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {navTabs.map((tab, i) => (
                <motion.button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + i * 0.04 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl
                    transition-all duration-200 cursor-pointer group ${
                      isLight
                        ? 'hover:bg-white/30'
                        : 'hover:bg-white/10'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tab.gradient}
                    flex items-center justify-center text-white shadow-md
                    group-hover:shadow-lg group-hover:scale-110 transition-all duration-200`}
                  >
                    {tab.icon}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight transition-colors duration-200 ${
                    isLight
                      ? 'text-white/80 group-hover:text-white'
                      : 'text-white/70 group-hover:text-white'
                  }`}
                  >
                    {tab.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}