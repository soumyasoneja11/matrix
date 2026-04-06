import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
  successMessage?: string;
}

const RoomForm: React.FC<RoomFormProps> = ({ zones, onSubmit, successMessage }) => {
  const [form, setForm] = useState<RoomFormData>({
    zoneId: zones.length > 0 ? String(zones[0].id) : '',
    roomCode: '',
    capacity: 1,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.roomCode.trim()) newErrors.roomCode = 'Room code is required';
    if (!form.zoneId) newErrors.zoneId = 'Please select a zone';
    if (!form.capacity || form.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (form.capacity > 20) newErrors.capacity = 'Capacity cannot exceed 20';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setForm({
      zoneId: zones.length > 0 ? String(zones[0].id) : '',
      roomCode: '',
      capacity: 1,
    });
    setErrors({});
  };

  const inputClass = isLight
    ? 'bg-[#f8f6f1] border-[#e0dbd2] text-[#1a2e2e] placeholder-[#b0bfbf]'
    : 'bg-white/5 border-white/10 text-white placeholder-white/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
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
          <h3 className="text-lg font-bold theme-text text-left">Attach Room to Zone</h3>
          <p className="theme-text-subtle text-sm mt-0.5 text-left">Assign rooms to care zones</p>
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
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Zone</label>
                  <select
                    value={form.zoneId}
                    onChange={(e) => { setForm({ ...form, zoneId: e.target.value }); if (errors.zoneId) setErrors({ ...errors, zoneId: '' }); }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer ${inputClass} ${errors.zoneId ? '!border-red-400 ring-1 ring-red-400/30' : ''}`}
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
                  {errors.zoneId && <p className="text-xs text-red-400 mt-1">{errors.zoneId}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Room Code</label>
                  <input
                    type="text"
                    value={form.roomCode}
                    onChange={(e) => { setForm({ ...form, roomCode: e.target.value }); if (errors.roomCode) setErrors({ ...errors, roomCode: '' }); }}
                    placeholder="e.g. AC-5"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass} ${errors.roomCode ? '!border-red-400 ring-1 ring-red-400/30' : ''}`}
                  />
                  {errors.roomCode && <p className="text-xs text-red-400 mt-1">{errors.roomCode}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? 'text-[#3d5555]' : 'text-white/70'}`}>Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.capacity}
                    onChange={(e) => { setForm({ ...form, capacity: parseInt(e.target.value) || 1 }); if (errors.capacity) setErrors({ ...errors, capacity: '' }); }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${inputClass} ${errors.capacity ? '!border-red-400 ring-1 ring-red-400/30' : ''}`}
                  />
                  {errors.capacity && <p className="text-xs text-red-400 mt-1">{errors.capacity}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <span>🚪</span>
                  Add Room
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoomForm;
