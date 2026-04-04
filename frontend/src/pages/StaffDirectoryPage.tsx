import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Pencil, Trash2, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { InputField, SelectField } from '../components/ui/InputField';
import { EmptyState } from '../components/ui/EmptyState';
import { staffAPI } from '../services/api';
import type { Staff, Role } from '../types/staff';

const roleFilters: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
];

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  DOCTOR: 'bg-blue-100 text-blue-700 border-blue-200',
  SUPERVISOR: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  NURSE: 'bg-pink-100 text-pink-700 border-pink-200',
  RECEPTIONIST: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function StaffDirectoryPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: '', username: '', email: '', role: '', department: '' });

  const fetchStaff = async () => {
    try {
      const res = await staffAPI.getAll();
      setStaff(res.data);
    } catch {}
  };

  useEffect(() => { fetchStaff(); }, []);

  const filteredStaff = staff.filter((s) => {
    if (filter !== 'ALL' && s.role !== filter) return false;
    if (searchQuery && !s.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const doctorCount = staff.filter((s) => s.role === 'DOCTOR').length;
  const nurseCount = staff.filter((s) => s.role === 'NURSE').length;

  const handleRemove = async (id: number) => {
    try {
      await staffAPI.remove(id);
      fetchStaff();
    } catch {}
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffAPI.create(addForm as Partial<Staff>);
      setShowAddModal(false);
      setAddForm({ fullName: '', username: '', email: '', role: '', department: '' });
      fetchStaff();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hospital staff, doctors, nurses, and support personnel</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{staff.length}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Staff</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{doctorCount}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">{nurseCount}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Nurses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {roleFilters.map((rf) => (
            <button
              key={rf.value}
              onClick={() => setFilter(rf.value)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filter === rf.value
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 border border-gray-200/60'
              }`}
            >
              {rf.value === 'ALL' ? `✨ ${rf.label}` : rf.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/60 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 w-48"
            />
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <UserPlus size={14} /> Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No staff found" description="Try adjusting your filter or search." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover className="relative">
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${member.status === 'ACTIVE' ? 'bg-green-500' : member.status === 'ON_CALL' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {member.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{member.fullName}</h4>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleColors[member.role] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {member.role}
                  </span>
                  <Badge variant="default">{member.department}</Badge>
                  <Badge variant={member.status === 'ACTIVE' ? 'standard' : 'urgent'}>
                    {member.status}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100/60">
                  <Button variant="ghost" size="sm" className="flex-1 !rounded-xl !text-xs">
                    <Pencil size={12} /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 !rounded-xl !text-xs !text-red-500 hover:!bg-red-50/60" onClick={() => handleRemove(member.id)}>
                    <Trash2 size={12} /> Remove
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <InputField label="Full Name" placeholder="Dr. Jane Doe" value={addForm.fullName} onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Username" placeholder="janedoe" value={addForm.username} onChange={(e) => setAddForm({ ...addForm, username: e.target.value })} required />
            <InputField label="Email" type="email" placeholder="jane@hospital.com" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Role" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} options={[{ value: '', label: 'Select Role' }, ...roleFilters.filter(r => r.value !== 'ALL').map(r => ({ value: r.value, label: r.label }))]} required />
            <InputField label="Department" placeholder="Emergency" value={addForm.department} onChange={(e) => setAddForm({ ...addForm, department: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1"><UserPlus size={15} /> Add Staff</Button>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
