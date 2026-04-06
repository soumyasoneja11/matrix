import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface ZoneFormData {
  name: string;
  severityBand: string;
  description: string;
}

interface ZoneFormProps {
  onSubmit: (data: ZoneFormData) => void;
  successMessage?: string;
}

const ZoneForm: React.FC<ZoneFormProps> = ({ onSubmit, successMessage }) => {
  const [form, setForm] = useState<ZoneFormData>({
    name: '',
    severityBand: 'RED',
    description: '',
  });
  const [isOpen, setIsOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Zone name is required';
    if (!form.severityBand) newErrors.severityBand = 'Severity band is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setForm({ name: '', severityBand: 'RED', description: '' });
    setErrors({});
  };

  const severityColors: Record<string, string> = {
    RED: 'text-red-400',
    YELLOW: 'text-amber-400',
    GREEN: 'text-emerald-400',
  };

  const inputClass = isLight
    ? 'bg-[#f8f6f1] border-[#e0dbd2] text-[#1a2e2e] placeholder-[#b0bfbf]'
    : 'bg-white/5 border-white/10 text-white placeholder-white/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 pb-4 cursor-pointer transition-colors ${
          isLight ? 'hover:bg-[#f4f0e8]/50' : 'hover:bg-white/[0.03]'
        }`}
      >
        <div>
          <h3 className="text-lg font-bold theme-text text-left">Create Care Zone</h3>
          <p className="theme-text-subtle text-sm mt-0.5 text-left">Expand your care capacity</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="theme-text-muted" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0">
              {/* Success indicator */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  <span>✅</span> {successMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Zone Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                    placeholder="e.g. Trauma Bay"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass} ${errors.name ? '!border-red-400 ring-1 ring-red-400/30' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Severity Band</label>
                  <select
                    value={form.severityBand}
                    onChange={(e) => setForm({ ...form, severityBand: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer ${inputClass} ${severityColors[form.severityBand] || ''}`}
                  >
                    <option value="RED" className={isLight ? '' : 'bg-slate-900 text-red-400'}>RED</option>
                    <option value="YELLOW" className={isLight ? '' : 'bg-slate-900 text-amber-400'}>YELLOW</option>
                    <option value="GREEN" className={isLight ? '' : 'bg-slate-900 text-emerald-400'}>GREEN</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Zone purpose and details..."
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none ${inputClass}`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <span>🏗️</span>
                  Create Zone
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ZoneForm;
