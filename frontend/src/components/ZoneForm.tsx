import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface ZoneFormData {
  name: string;
  severityBand: string;
  description: string;
}

interface ZoneFormProps {
  onSubmit: (data: ZoneFormData) => void;
}

const ZoneForm: React.FC<ZoneFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<ZoneFormData>({
    name: '',
    severityBand: 'RED',
    description: '',
  });
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm({ name: '', severityBand: 'RED', description: '' });
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
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-1 theme-text">Create Care Zone</h3>
      <p className="theme-text-subtle text-sm mb-5">Expand your care capacity</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Zone Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Trauma Bay"
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass}`}
          />
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
    </motion.div>
  );
};

export default ZoneForm;
