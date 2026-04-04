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

const navTabs = [
  { path: '/dashboard', label: 'Dashboard', icon: <HeartPulse size={20} />, gradient: 'from-red-500 to-rose-600' },
  { path: '/resource-allocation', label: 'Resources', icon: <LayoutGrid size={20} />, gradient: 'from-blue-500 to-cyan-600' },
  { path: '/staff-directory', label: 'Staff', icon: <Users size={20} />, gradient: 'from-purple-500 to-violet-600' },
  { path: '/staff-management', label: 'Management', icon: <UserCog size={20} />, gradient: 'from-pink-500 to-fuchsia-600' },
  { path: '/my-worklist', label: 'Worklist', icon: <ClipboardList size={20} />, gradient: 'from-primary-500 to-indigo-600' },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, gradient: 'from-amber-500 to-orange-600' },
  { path: '/recycle-bin', label: 'Recycle Bin', icon: <Trash2 size={20} />, gradient: 'from-gray-500 to-slate-600' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* ── Full-screen hospital background ── */}
      <div className="fixed inset-0 -z-10">
        <img
          src={hospitalBg}
          alt="Hospital"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/65 to-slate-950/85" />
        {/* Subtle color accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-950/30 via-transparent to-purple-950/20" />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-2xl"
        >
          {/* ── Glassmorphism Card ── */}
          <div className="relative backdrop-blur-3xl bg-white/[0.06] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden">
            {/* Inner glow accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="px-8 py-12 md:px-12 md:py-16 text-center">
              {/* Logo / Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Stethoscope size={28} className="text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  VitalPass
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg mx-auto mb-10"
              >
                VitalPass is a smart emergency healthcare system that enables
                quick access to patient medical records and supports efficient
                triage during critical situations.
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => navigate('/triage')}
                whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                  bg-gradient-to-r from-primary-500 to-primary-600
                  text-white font-semibold text-base
                  shadow-xl shadow-primary-500/25
                  hover:from-primary-600 hover:to-primary-700
                  transition-all duration-300 cursor-pointer"
              >
                <Activity size={18} />
                Start Triage
                <ArrowRight size={16} />
              </motion.button>
            </div>

            {/* Bottom shine */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative z-10 pb-6 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-3xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-3 shadow-2xl">
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {navTabs.map((tab, i) => (
                <motion.button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl
                    hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tab.gradient}
                    flex items-center justify-center text-white shadow-md
                    group-hover:shadow-lg group-hover:scale-110 transition-all duration-200`}
                  >
                    {tab.icon}
                  </div>
                  <span className="text-[11px] font-medium text-white/70 group-hover:text-white
                    text-center leading-tight transition-colors duration-200"
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