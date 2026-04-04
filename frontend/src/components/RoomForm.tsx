import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RoomFormData {
  zoneId: string;
  roomCode: string;
  capacity: number;
}

interface ZoneOption {
  id: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-1">Attach Room to Zone</h3>
      <p className="text-white/40 text-sm mb-5">Assign rooms to care zones</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Zone</label>
          <select
            value={form.zoneId}
            onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
          >
            {zones.length === 0 && (
              <option value="" className="bg-slate-900">No zones available</option>
            )}
            {zones.map((z) => (
              <option key={z.id} value={z.id} className="bg-slate-900">
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Room Code</label>
          <input
            type="text"
            value={form.roomCode}
            onChange={(e) => setForm({ ...form, roomCode: e.target.value })}
            placeholder="e.g. AC-5"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Capacity</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
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
