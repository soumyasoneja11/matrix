import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface RoomFormData {
  zoneId: string;
  roomCode: string;
  capacity: number;
}

interface ZoneOption {
  id: string;
  name: string;
}

interface RoomFormProps {
  zones: ZoneOption[];
  onSubmit: (data: RoomFormData) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ zones, onSubmit }) => {
  const [form, setForm] = useState<RoomFormData>({
    zoneId: zones.length > 0 ? String(zones[0].id) : '',
    roomCode: '',
    capacity: 1,
  });
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomCode.trim() || !form.zoneId) return;
    onSubmit(form);
    setForm({
      zoneId: zones.length > 0 ? String(zones[0].id) : '',
      roomCode: '',
      capacity: 1,
    });
  };

  const inputClass = isLight
    ? 'bg-[#f8f6f1] border-[#e0dbd2] text-[#1a2e2e] placeholder-[#b0bfbf]'
    : 'bg-white/5 border-white/10 text-white placeholder-white/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-1 theme-text">Attach Room to Zone</h3>
      <p className="theme-text-subtle text-sm mb-5">Assign rooms to care zones</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Zone</label>
          <select
            value={form.zoneId}
            onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer ${inputClass}`}
          >
            {zones.length === 0 && (
              <option value="" className={isLight ? '' : 'bg-slate-900'}>No zones available</option>
            )}
            {zones.map((z) => (
              <option key={z.id} value={z.id} className={isLight ? '' : 'bg-slate-900'}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Room Code</label>
          <input
            type="text"
            value={form.roomCode}
            onChange={(e) => setForm({ ...form, roomCode: e.target.value })}
            placeholder="e.g. AC-5"
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Capacity</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass}`}
          />
        </div>

        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          Add Room
        </button>
      </form>
    </motion.div>
  );
};

export default RoomForm;
