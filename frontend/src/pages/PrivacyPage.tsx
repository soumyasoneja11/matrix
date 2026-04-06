import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content:
      'We collect information necessary to provide emergency triage services, including patient demographic data, medical history, triage assessments, and staff interaction logs. All data is collected with appropriate consent and in compliance with healthcare regulations.',
  },
  {
    icon: Lock,
    title: 'How We Protect Your Data',
    content:
      'All patient and staff data is encrypted at rest and in transit using industry-standard AES-256 encryption. Access is restricted through role-based authentication, and all access events are logged for audit purposes.',
  },
  {
    icon: Database,
    title: 'Data Retention',
    content:
      'Patient records are retained in accordance with applicable healthcare regulations and institutional policies. You may request deletion of your personal data subject to legal retention requirements.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data. You may also request a copy of the data we hold about you. Requests can be submitted through the Contact Support page or by emailing our Data Protection Officer.',
  },
  {
    icon: Globe,
    title: 'Third-Party Sharing',
    content:
      'We do not sell or share personal health data with third parties for marketing purposes. Data may be shared with authorized healthcare providers, insurance companies (with consent), or as required by law.',
  },
];

const PrivacyPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-[#247B7B]/10' : 'bg-primary-500/20'}`}>
            <Shield size={22} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
          </div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
            Privacy Policy
          </h1>
        </div>
        <p className="theme-text-muted mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className={`mt-4 text-sm leading-relaxed ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
          At VITALPASS, we are committed to protecting the privacy and security of your personal and
          health information. This policy outlines how we collect, use, store, and protect your data.
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
        If you have questions about this privacy policy, please <a href="/contact" className={`underline ${isLight ? 'text-[#247B7B]' : 'text-primary-400'}`}>contact us</a>.
      </div>
    </div>
  );
};

export default PrivacyPage;
