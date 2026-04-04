import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-1">Create Care Zone</h3>
      <p className="text-white/40 text-sm mb-5">Expand your care capacity</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Zone Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Trauma Bay"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Severity Band</label>
          <select
            value={form.severityBand}
            onChange={(e) => setForm({ ...form, severityBand: e.target.value })}
            className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer ${severityColors[form.severityBand] || ''}`}
          >
            <option value="RED" className="bg-slate-900 text-red-400">RED</option>
            <option value="YELLOW" className="bg-slate-900 text-amber-400">YELLOW</option>
            <option value="GREEN" className="bg-slate-900 text-emerald-400">GREEN</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Zone purpose and details..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
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
