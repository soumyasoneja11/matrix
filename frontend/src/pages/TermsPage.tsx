import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Scale, ShieldCheck, Clock, Ban } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

const sections = [
  {
    icon: Scale,
    title: 'Acceptance of Terms',
    content:
      'By accessing and using the VITALPASS ER Triage System, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.',
  },
  {
    icon: ShieldCheck,
    title: 'Authorized Use',
    content:
      'This system is intended for authorized healthcare professionals only. Users must maintain valid credentials and adhere to all institutional policies. Unauthorized access or misuse of patient data is strictly prohibited and may result in disciplinary action and legal penalties.',
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content:
      'VITALPASS provides AI-assisted triage recommendations as a decision-support tool only. Final clinical decisions remain the responsibility of qualified healthcare providers. We are not liable for clinical outcomes resulting from triage recommendations.',
  },
  {
    icon: Clock,
    title: 'Service Availability',
    content:
      'We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance windows will be communicated in advance. Emergency downtime procedures should be in place at all participating facilities.',
  },
  {
    icon: Ban,
    title: 'Prohibited Activities',
    content:
      'Users may not: share login credentials, attempt to reverse-engineer the system, export patient data without authorization, use the system for purposes other than patient triage and care coordination, or interfere with system operations.',
  },
];

const TermsPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-[#247B7B]/10' : 'bg-primary-500/20'}`}>
            <FileText size={22} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
          </div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
            Terms of Service
          </h1>
        </div>
        <p className="theme-text-muted mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className={`mt-4 text-sm leading-relaxed ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
          These Terms of Service govern your use of the VITALPASS ER Triage System.
          Please read them carefully before using the platform.
        </p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isLight ? 'bg-[#247B7B]/10' : 'bg-white/5'}`}>
                <section.icon size={18} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
              </div>
              <div>
                <h2 className={`text-base font-semibold mb-2 ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
                  {section.title}
                </h2>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`text-center text-xs py-4 ${isLight ? 'text-[#b0bfbf]' : 'text-white/30'}`}>
        Questions about these terms? <a href="/contact" className={`underline ${isLight ? 'text-[#247B7B]' : 'text-primary-400'}`}>Contact our support team</a>.
      </div>
    </div>
  );
};

export default TermsPage;
