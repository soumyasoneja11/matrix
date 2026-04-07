import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Users,
  Clock,
  Stethoscope,
  Shield,
  Calendar,
  X,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { Staff } from '../types';
import { staffAPI } from '../services/api';

const roleOptions = [
  { value: '', label: 'Select Role Type' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
];

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'EMERGENCY_DEPARTMENT', label: 'Emergency Department' },
  { value: 'CARDIOLOGY', label: 'Cardiology' },
  { value: 'NEUROLOGY', label: 'Neurology' },
  { value: 'ORTHOPEDICS', label: 'Orthopedics' },
  { value: 'PULMONOLOGY', label: 'Pulmonology' },
  { value: 'SURGERY', label: 'Surgery' },
  { value: 'GENERAL_MEDICINE', label: 'General Medicine' },
  { value: 'ADMINISTRATION', label: 'Administration' },
  { value: 'FRONT_DESK', label: 'Front Desk' },
];

interface StaffFormData {
  fullName: string;
  username: string;
  email: string;
  role: string;
  department: string;
  specialization: string;
}

const emptyForm: StaffFormData = {
  fullName: '',
  username: '',
  email: '',
  role: '',
  department: '',
  specialization: '',
};

const StaffManagement = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffAPI.getAll();
      setStaff(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch staff from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const totalStaff = staff.length;
  const onShift = staff.filter((s) => s.status === 'ACTIVE' || s.status === 'online').length;
  const doctors = staff.filter((s) => s.role === 'DOCTOR').length;
  const nurses = staff.filter((s) => s.role === 'NURSE').length;

  const stats = [
    { label: 'Total Staff', value: String(totalStaff), icon: <Users size={20} />, color: 'from-primary-500 to-teal-600' },
    { label: 'On Shift', value: String(onShift), icon: <Clock size={20} />, color: 'from-emerald-500 to-green-600' },
    { label: 'Doctors', value: String(doctors), icon: <Stethoscope size={20} />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Nurses', value: String(nurses), icon: <Shield size={20} />, color: 'from-pink-500 to-rose-600' },
  ];

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (roleFilter !== 'ALL' && member.role !== roleFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        member.fullName.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.username.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q)
      );
    });
  }, [staff, roleFilter, query]);

  const openAdd = () => {
    setIsEdit(false);
    setEditingStaffId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (member: Staff) => {
    setIsEdit(true);
    setEditingStaffId(member.id);
    setForm({
      fullName: member.fullName,
      username: member.username,
      email: member.email,
      role: member.role,
      department: member.department,
      specialization: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingStaffId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.email || !form.role || !form.department) return;
    try {
      setSubmitting(true);
      if (isEdit && editingStaffId) {
        await staffAPI.update(editingStaffId, {
          fullName: form.fullName.trim(),
          role: form.role,
          department: form.department,
        });
      } else {
        await staffAPI.create({
          fullName: form.fullName.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          role: form.role,
          department: form.department,
        });
      }
      await fetchStaff();
      closeModal();
    } catch (err: any) {
      setError(err?.message || 'Failed to save staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await staffAPI.remove(id);
      await fetchStaff();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete staff member');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Staff Management</h1>
          <p className="theme-text-muted mt-2">Manage staff schedules, roles, and permissions</p>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary flex items-center gap-2 cursor-pointer">
          <UserPlus size={18} />
          Add Staff
        </motion.button>
      </motion.div>

      {error && (
        <div className={`glass-card p-3 flex items-center gap-2 ${isLight ? 'border-red-200 bg-red-50 text-red-700' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
          <AlertTriangle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5 glass-card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-muted text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, username, email..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border outline-none ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'}`}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'DOCTOR', 'NURSE', 'ADMIN', 'SUPERVISOR', 'RECEPTIONIST'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${roleFilter === role ? 'bg-linear-to-r from-primary-600 to-primary-700 text-white' : 'bg-white/10 text-gray-300'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2 rounded-xl ${isLight ? 'bg-primary-100' : 'bg-primary-500/20'}`}>
            <Calendar size={20} className={isLight ? 'text-primary-600' : 'text-primary-400'} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>Current Shift</h2>
            <p className="theme-text-muted text-sm">Live staff roster from backend database</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 theme-text-muted">Loading staff...</div>
        ) : filteredStaff.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${isLight ? 'border-gray-200 bg-gray-50/50' : 'border-white/10 bg-white/[0.02]'}`}>
            <Users size={44} className="mx-auto mb-2 theme-text-subtle" />
            <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>No staff found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className={`rounded-2xl border p-4 ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-semibold ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>{member.fullName}</h3>
                    <p className="theme-text-muted text-xs">{member.username}</p>
                    <p className="theme-text-muted text-xs">{member.email}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {member.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs theme-text-muted">
                  <span>{member.role}</span>
                  <span>{member.department}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(member)} className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="flex-1 px-3 py-2 rounded-xl text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 flex items-center justify-center gap-1">
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 ${isLight ? 'bg-black/20' : 'bg-black/60'} backdrop-blur-sm`} onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border ${isLight ? 'bg-white border-gray-200/80' : 'bg-[#1E1E2F] border-white/10'}`}>
              <div className={`sticky top-0 z-10 flex items-center justify-between px-7 py-5 border-b ${isLight ? 'bg-white/95 border-gray-100 backdrop-blur-md' : 'bg-[#1E1E2F]/95 border-white/5 backdrop-blur-md'}`}>
                <h3 className={`text-lg font-bold ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>{isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                <button onClick={closeModal} className={`p-2 rounded-xl ${isLight ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-gray-500'}`}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-7 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full Name" className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'}`} />
                  <input required disabled={isEdit} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'} ${isEdit ? 'opacity-60' : ''}`} />
                  <input required type="email" disabled={isEdit} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'} ${isEdit ? 'opacity-60' : ''}`} />
                  <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'}`}>
                    {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <select required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'}`}>
                    {departmentOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Specialization (optional)" className={`w-full px-4 py-2.5 rounded-xl border ${isLight ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#2A2A40] border-gray-600 text-gray-200'}`} />
                </div>
                <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-gray-100' : 'border-white/5'}`}>
                  <button type="button" onClick={closeModal} className={`px-6 py-2.5 rounded-xl font-semibold ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-white/5 text-gray-300 border border-gray-600'}`}>Cancel</button>
                  <button type="submit" disabled={submitting} className="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50">
                    {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Staff Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffManagement;
