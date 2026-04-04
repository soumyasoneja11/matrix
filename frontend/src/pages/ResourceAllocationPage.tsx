import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DoorOpen, Gauge, Plus, Box } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InputField, SelectField, TextAreaField } from '../components/ui/InputField';
import { Badge } from '../components/ui/Badge';
import { zoneAPI, roomAPI } from '../services/api';
import type { Zone, Room } from '../types/patient';

export function ResourceAllocationPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Forms
  const [zoneName, setZoneName] = useState('');
  const [zoneSeverity, setZoneSeverity] = useState('');
  const [zoneDesc, setZoneDesc] = useState('');
  const [roomZone, setRoomZone] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomEquipment, setRoomEquipment] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [zRes, rRes] = await Promise.all([zoneAPI.getAll(), roomAPI.getAll()]);
      setZones(zRes.data);
      setRooms(rRes.data);
    } catch { /* API not available */ }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await zoneAPI.create({ name: zoneName, severityBand: zoneSeverity, description: zoneDesc });
      setZoneName(''); setZoneSeverity(''); setZoneDesc('');
      fetchData();
    } catch {}
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await roomAPI.create({ zoneId: Number(roomZone), roomCode, equipment: roomEquipment });
      setRoomZone(''); setRoomCode(''); setRoomEquipment([]);
      fetchData();
    } catch {}
  };

  const equipmentOptions = ['Ventilator', 'Monitor', 'Defibrillator', 'IV Stand', 'Oxygen Supply', 'Suction Machine'];
  const toggleEquipment = (eq: string) => {
    setRoomEquipment((prev) => prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]);
  };

  const activeZones = zones.length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => !r.occupied).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Resource Allocation</h2>
        <p className="text-sm text-gray-500 mt-1">Manage emergency zones, rooms, and capacity in real time</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: <MapPin size={20} />, label: 'Active Zones', value: activeZones, color: 'from-primary-500 to-primary-700' },
          { icon: <DoorOpen size={20} />, label: 'Tracked Rooms', value: totalRooms, color: 'from-blue-500 to-blue-700' },
          { icon: <Gauge size={20} />, label: 'Available Capacity', value: availableRooms, color: 'from-amber-500 to-amber-600' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-lg`}>
                {m.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{m.label}</p>
                <p className="text-2xl font-bold text-gray-800">{m.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Zone */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-primary-600" />
            Create Zone
          </h3>
          <form onSubmit={handleCreateZone} className="space-y-4">
            <InputField label="Zone Name" placeholder="e.g. Resuscitation Bay" value={zoneName} onChange={(e) => setZoneName(e.target.value)} required />
            <SelectField
              label="Severity Band"
              value={zoneSeverity}
              onChange={(e) => setZoneSeverity(e.target.value)}
              options={[
                { value: '', label: 'Select severity' },
                { value: 'CRITICAL', label: 'Critical' },
                { value: 'URGENT', label: 'Urgent' },
                { value: 'STANDARD', label: 'Standard' },
              ]}
              required
            />
            <TextAreaField label="Description" placeholder="Zone description..." value={zoneDesc} onChange={(e) => setZoneDesc(e.target.value)} rows={3} />
            <Button type="submit"><Plus size={15} /> Create Zone</Button>
          </form>
        </Card>

        {/* Add Room */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DoorOpen size={18} className="text-primary-600" />
            Add Room
          </h3>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <SelectField
              label="Zone"
              value={roomZone}
              onChange={(e) => setRoomZone(e.target.value)}
              options={[{ value: '', label: 'Select zone' }, ...zones.map((z) => ({ value: String(z.id), label: z.name }))]}
              required
            />
            <InputField label="Room Code" placeholder="e.g. TR-1" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} required />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Equipment</label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map((eq) => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEquipment(eq)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      roomEquipment.includes(eq)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white/60 text-gray-600 border border-gray-200 hover:bg-primary-50'
                    }`}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit"><Plus size={15} /> Add Room</Button>
          </form>
        </Card>
      </div>

      {/* Capacity Map */}
      {zones.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Box size={18} className="text-primary-600" />
            Capacity Map
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone) => {
              const zoneRooms = rooms.filter((r) => r.zoneId === zone.id);
              return (
                <div key={zone.id} className="rounded-2xl border border-gray-200/60 bg-white/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">{zone.name}</h4>
                    <Badge variant={zone.severityBand === 'CRITICAL' ? 'critical' : zone.severityBand === 'URGENT' ? 'urgent' : 'standard'}>
                      {zone.severityBand}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {zoneRooms.map((room) => (
                      <div key={room.id} className={`text-xs px-2 py-1 rounded-lg ${room.occupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {room.roomCode}
                      </div>
                    ))}
                    {zoneRooms.length === 0 && <p className="text-xs text-gray-400">No rooms</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
