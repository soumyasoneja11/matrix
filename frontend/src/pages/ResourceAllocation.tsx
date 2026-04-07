import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBed,
  FaLungs,
  FaSyringe,
  FaAmbulance,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import AnalyticsCard from '../components/AnalyticsCard';
import ZoneForm from '../components/ZoneForm';
import RoomForm from '../components/RoomForm';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { Room, TriageLevel, Zone } from '../types';
import { resourceAPI } from '../services/api';

const ResourceAllocation = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [zoneSuccess, setZoneSuccess] = useState('');
  const [roomSuccess, setRoomSuccess] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const activeZones = zones.length;
  const trackedRooms = rooms.length;
  const availableNow = rooms.filter((r) => !r.occupied).length;

  const resources = useMemo(() => [
    { icon: FaBed, name: 'Tracked Rooms', available: availableNow, total: Math.max(trackedRooms, 1), color: 'from-red-500 to-pink-500' },
    { icon: FaLungs, name: 'Available Rooms', available: availableNow, total: Math.max(trackedRooms, 1), color: 'from-blue-500 to-cyan-500' },
    { icon: FaSyringe, name: 'Occupied Rooms', available: trackedRooms - availableNow, total: Math.max(trackedRooms, 1), color: 'from-green-500 to-emerald-500' },
    { icon: FaAmbulance, name: 'Care Zones', available: activeZones, total: Math.max(activeZones, 1), color: 'from-yellow-500 to-orange-500' },
  ], [activeZones, trackedRooms, availableNow]);

  const mapSeverityToBand = (severity: string): Zone['severityBand'] => {
    const normalized = severity.toUpperCase();
    if (normalized === 'RED') return TriageLevel.CRITICAL;
    if (normalized === 'YELLOW') return TriageLevel.URGENT;
    return TriageLevel.STANDARD;
  };

  const reloadResources = async () => {
    try {
      const [liveZones, liveRooms] = await Promise.all([
        resourceAPI.getZones(),
        resourceAPI.getRooms(),
      ]);
      setZones(liveZones);
      setRooms(liveRooms);
      setShowError(false);
      setErrorMessage('');
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(err?.message || 'Unable to sync resource capacity from backend.');
    }
  };

  useEffect(() => {
    reloadResources();
  }, []);

  const handleCreateZone = async (data: { name: string; severityBand: string; description: string }) => {
    try {
      const createdZone = await resourceAPI.createZone({
        name: data.name,
        severityBand: mapSeverityToBand(data.severityBand),
        description: data.description,
      });
      setZones((prev) => [...prev, createdZone]);
      setZoneSuccess(`Zone "${data.name}" created successfully!`);
      setShowError(false);
      setTimeout(() => setZoneSuccess(''), 4000);
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(err?.message || 'Unable to create zone. Please retry.');
    }
  };

  const handleAddRoom = async (data: { zoneId: string; roomCode: string; capacity: number }) => {
    const targetZone = zones.find((z) => z.id === data.zoneId);
    if (!targetZone) return;
    try {
      await resourceAPI.createRoom(data);
      await reloadResources();
      setRoomSuccess(`Room "${data.roomCode}" added to ${targetZone.name}!`);
      setTimeout(() => setRoomSuccess(''), 4000);
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(err?.message || 'Unable to create room. Please retry.');
    }
  };

  const severityColors: Record<string, string> = {
    CRITICAL: 'from-red-500 to-pink-500',
    URGENT: 'from-amber-500 to-orange-500',
    STANDARD: 'from-emerald-500 to-green-500',
  };

  const severityBadgeClass: Record<string, string> = {
    CRITICAL: isLight
      ? 'bg-red-50 text-red-700 border border-red-200'
      : 'bg-gradient-to-r from-red-600 to-red-700 text-white ring-2 ring-red-400/50',
    URGENT: isLight
      ? 'bg-amber-50 text-amber-700 border border-amber-200'
      : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white ring-2 ring-amber-400/50',
    STANDARD: isLight
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white ring-2 ring-emerald-400/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Resource Allocation</h1>
        <p className="theme-text-muted mt-2">Real-time resource tracking, zone & room management</p>
      </motion.div>

      {/* A. Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard
          icon={FaMapMarkerAlt}
          label="Active Zones"
          value={activeZones}
          gradient="from-indigo-500 to-purple-500"
          delay={0}
        />
        <AnalyticsCard
          icon={FaDoorOpen}
          label="Tracked Rooms"
          value={trackedRooms}
          gradient="from-blue-500 to-cyan-500"
          delay={0.05}
        />
        <AnalyticsCard
          icon={FaCheckCircle}
          label="Available Now"
          value={availableNow}
          gradient="from-green-500 to-emerald-500"
          delay={0.1}
        />
      </div>

      {/* B. Error Banner */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 flex items-center justify-between ${isLight
              ? 'border-red-200 bg-red-50'
              : 'border-red-500/30 bg-red-500/10'
            }`}
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className={`text-lg flex-shrink-0 ${isLight ? 'text-red-500' : 'text-red-400'}`} />
            <div>
              <p className={`text-sm font-semibold ${isLight ? 'text-red-700' : 'text-red-300'}`}>Server error: 403</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-red-500/70' : 'text-white/50'}`}>
                {errorMessage || 'Capacity data could not be fetched. Some metrics may be stale.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={reloadResources}
              className="btn-primary text-sm flex items-center gap-2 py-2"
            >
              <FaSyncAlt />
              Refresh Capacity
            </button>
          </div>
        </motion.div>
      )}

      {/* C & D. Zone & Room Forms — Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZoneForm onSubmit={handleCreateZone} successMessage={zoneSuccess} />
        <RoomForm
          zones={zones.map((z) => ({ id: z.id, name: z.name }))}
          onSubmit={handleAddRoom}
          successMessage={roomSuccess}
        />
      </div>

      {/* E. Existing Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-bold mb-4 theme-text">Care Zones</h2>
        {zones.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="theme-text-muted text-lg">🏥</p>
            <p className="theme-text-muted mt-2">
              No zones configured yet. Create the first one from the left panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {zones.map((zone, idx) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="glass-card p-5 hover-lift"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${severityColors[zone.severityBand] || 'from-gray-500 to-gray-600'
                      } flex items-center justify-center shadow-lg`}
                  >
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${severityBadgeClass[zone.severityBand] || ''
                      }`}
                  >
                    {zone.severityBand}
                  </span>
                </div>
                <h3 className="font-bold text-base theme-text">{zone.name}</h3>
                <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                  {zone.description}
                </p>
                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${isLight ? 'border-[#e8e2d9] text-[#94a3a3]' : 'border-white/10 text-white/40'
                  }`}>
                  <span>
                    {rooms.filter((r) => r.zoneId === zone.id).length} rooms
                  </span>
                  <span>
                    {rooms.filter((r) => r.zoneId === zone.id && r.occupied).length} occupied
                  </span>
                </div>
              </motion.div>
            ))}

          </div>
        )}
      </motion.div>

      {/* Existing Resource Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-bold mb-4 theme-text">Equipment & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + idx * 0.05 }}
              className="glass-card p-6 hover-lift"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <resource.icon className="text-white text-xl" />
              </div>
              <h3 className="font-bold text-lg theme-text">{resource.name}</h3>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="theme-text-muted">Available</span>
                  <span className="font-bold theme-text">
                    {resource.available} / {resource.total}
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-[#f0ece4]' : 'bg-white/10'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(resource.available / resource.total) * 100}%`,
                    }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.6 }}
                    className={`h-full bg-gradient-to-r ${resource.color} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ResourceAllocation;