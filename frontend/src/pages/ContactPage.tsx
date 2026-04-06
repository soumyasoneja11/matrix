import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
          Contact Support
        </h1>
        <p className="theme-text-muted mt-2">
          Have a question or need assistance? Reach out to our support team.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-4"
        >
          {[
            { icon: Mail, label: 'Email', value: 'support@vitalpass.com', href: 'mailto:support@vitalpass.com' },
            { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
            { icon: MapPin, label: 'Address', value: '123 Medical Center Dr, Healthcare City, HC 12345', href: '#' },
          ].map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className={`glass-card p-4 flex items-start gap-3 block transition-all hover:scale-[1.02] ${
                isLight ? 'hover:shadow-md' : 'hover:bg-white/[0.08]'
              }`}
            >
              <div className={`p-2 rounded-xl ${isLight ? 'bg-[#247B7B]/10' : 'bg-primary-500/20'}`}>
                <item.icon size={18} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
                  {item.label}
                </p>
                <p className={`text-sm mt-0.5 ${isLight ? 'text-[#1a2e2e]' : 'text-white/80'}`}>
                  {item.value}
                </p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={18} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
              <h2 className={`text-lg font-semibold ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
                Send us a message
              </h2>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-center py-12 rounded-xl ${isLight ? 'bg-emerald-50' : 'bg-emerald-500/10'}`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Send size={24} className="text-emerald-500" />
                </div>
                <p className={`font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  Message sent successfully!
                </p>
                <p className="text-sm theme-text-muted mt-1">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl theme-bg-input border focus:outline-none focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@hospital.com"
                      className="w-full px-4 py-2.5 rounded-xl theme-bg-input border focus:outline-none focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 rounded-xl theme-bg-input border focus:outline-none focus:border-primary-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/60'}`}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-2.5 rounded-xl theme-bg-input border focus:outline-none focus:border-primary-500 transition-all text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2 w-full justify-center"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
