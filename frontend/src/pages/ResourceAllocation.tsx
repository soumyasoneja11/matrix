import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBed,
  FaProcedures,
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
import { DEMO_ZONES, DEMO_ROOMS } from '../utils/mockData';

const ResourceAllocation = () => {
  const [zones, setZones] = useState(DEMO_ZONES);
  const [rooms] = useState(DEMO_ROOMS);
  const [showError, setShowError] = useState(true);

  const activeZones = zones.length;
  const trackedRooms = rooms.length;
  const availableNow = rooms.filter((r) => !r.occupied).length;

  const resources = [
    { icon: FaBed, name: 'ICU Beds', available: 8, total: 15, color: 'from-red-500 to-pink-500' },
    { icon: FaProcedures, name: 'Ventilators', available: 12, total: 20, color: 'from-blue-500 to-cyan-500' },
    { icon: FaSyringe, name: 'Emergency Kits', available: 45, total: 50, color: 'from-green-500 to-emerald-500' },
    { icon: FaAmbulance, name: 'Ambulances', available: 3, total: 5, color: 'from-yellow-500 to-orange-500' },
  ];

  const handleCreateZone = (data: { name: string; severityBand: string; description: string }) => {
    const triageMap: Record<string, 'CRITICAL' | 'URGENT' | 'STANDARD'> = {
      RED: 'CRITICAL',
      YELLOW: 'URGENT',
      GREEN: 'STANDARD',
    };
    const newZone = {
      id: zones.length + 1,
      name: data.name,
      severityBand: triageMap[data.severityBand] || 'STANDARD',
      description: data.description,
    };
    setZones([...zones, newZone]);
  };

  const handleAddRoom = (data: { zoneId: string; roomCode: string; capacity: number }) => {
    // In a real app, this would call the backend
    console.log('Room added:', data);
  };

  const severityColors: Record<string, string> = {
    CRITICAL: 'from-red-500 to-pink-500',
    URGENT: 'from-amber-500 to-orange-500',
    STANDARD: 'from-emerald-500 to-green-500',
  };

  const severityBadgeClass: Record<string, string> = {
    CRITICAL: 'bg-gradient-to-r from-red-600 to-red-700 text-white ring-2 ring-red-400/50',
    URGENT: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white ring-2 ring-amber-400/50',
    STANDARD: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white ring-2 ring-emerald-400/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Resource Allocation</h1>
        <p className="text-white/60 mt-2">Real-time resource tracking, zone & room management</p>
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
          className="glass-card p-4 border-red-500/30 bg-red-500/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400 text-lg flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-300">Server error: 403</p>
              <p className="text-xs text-white/50 mt-0.5">
                Capacity data could not be fetched. Some metrics may be stale.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowError(false)}
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
        <ZoneForm onSubmit={handleCreateZone} />
        <RoomForm
          zones={zones.map((z) => ({ id: z.id, name: z.name }))}
          onSubmit={handleAddRoom}
        />
      </div>

      {/* E. Existing Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-lg font-bold mb-4">Care Zones</h2>
        {zones.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-white/50 text-lg">🏥</p>
            <p className="text-white/60 mt-2">
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
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${
                      severityColors[zone.severityBand] || 'from-gray-500 to-gray-600'
                    } flex items-center justify-center shadow-lg`}
                  >
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      severityBadgeClass[zone.severityBand] || ''
                    }`}
                  >
                    {zone.severityBand}
                  </span>
                </div>
                <h3 className="font-bold text-base">{zone.name}</h3>
                <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">
                  {zone.description}
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
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
        <h2 className="text-lg font-bold mb-4">Equipment & Resources</h2>
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
              <h3 className="font-bold text-lg">{resource.name}</h3>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Available</span>
                  <span className="font-bold">
                    {resource.available} / {resource.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
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