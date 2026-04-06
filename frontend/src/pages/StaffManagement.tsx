import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Users,
  Clock,
  Briefcase,
  Phone,
  Mail,
  FileText,
  Stethoscope,
  Shield,
  Calendar,
  X,
} from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

// ─── Role options ───
const roleOptions = [
  { value: '', label: 'Select Role Type' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SURGEON', label: 'Surgeon' },
  { value: 'TECHNICIAN', label: 'Technician' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
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

const designationOptions = [
  { value: '', label: 'Select Designation' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'HEAD', label: 'Head of Department' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'RESIDENT', label: 'Resident' },
];

const shiftOptions = [
  { value: '', label: 'Select Shift' },
  { value: 'MORNING', label: 'Morning (6 AM – 2 PM)' },
  { value: 'AFTERNOON', label: 'Afternoon (2 PM – 10 PM)' },
  { value: 'NIGHT', label: 'Night (10 PM – 6 AM)' },
  { value: 'ROTATING', label: 'Rotating' },
  { value: 'ON_CALL', label: 'On-Call' },
];

interface StaffFormData {
  fullName: string;
  age: string;
  designation: string;
  department: string;
  roleType: string;
  experience: string;
  shiftTiming: string;
  phone: string;
  email: string;
  notes: string;
}

const emptyForm: StaffFormData = {
  fullName: '',
  age: '',
  designation: '',
  department: '',
  roleType: '',
  experience: '',
  shiftTiming: '',
  phone: '',
  email: '',
  notes: '',
};

// ─── Reusable themed input ───
function ThemedInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  icon,
  isLight,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <div className="w-full">
      <label
        className={`block text-sm font-semibold mb-1.5 ${
          isLight ? 'text-gray-700' : 'text-gray-300'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500
            ${icon ? 'pl-10' : ''}
            ${
              isLight
                ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400'
                : 'bg-[#2A2A40] border-gray-600 text-gray-200 placeholder:text-gray-500'
            }
          `}
        />
      </div>
    </div>
  );
}

// ─── Reusable themed select ───
function ThemedSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  icon,
  isLight,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  icon?: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <div className="w-full">
      <label
        className={`block text-sm font-semibold mb-1.5 ${
          isLight ? 'text-gray-700' : 'text-gray-300'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
              isLight ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500
            appearance-none
            ${icon ? 'pl-10' : ''}
            ${
              isLight
                ? 'bg-gray-100 border-gray-300 text-gray-900'
                : 'bg-[#2A2A40] border-gray-600 text-gray-200'
            }
            ${!value ? (isLight ? 'text-gray-400' : 'text-gray-500') : ''}
          `}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isLight ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable themed textarea ───
function ThemedTextarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  icon,
  isLight,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  icon?: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <div className="w-full">
      <label
        className={`block text-sm font-semibold mb-1.5 ${
          isLight ? 'text-gray-700' : 'text-gray-300'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute left-3 top-3 ${
              isLight ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {icon}
          </div>
        )}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500
            ${icon ? 'pl-10' : ''}
            ${
              isLight
                ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400'
                : 'bg-[#2A2A40] border-gray-600 text-gray-200 placeholder:text-gray-500'
            }
          `}
        />
      </div>
    </div>
  );
}

// ─── StaffManagement Component ───
const StaffManagement = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<StaffFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    console.log('Staff Data Submitted:', form);
    setSubmitting(false);
    setForm(emptyForm);
    setShowAddModal(false);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setShowAddModal(false);
  };

  // Stats cards data
  const stats = [
    { label: 'Total Staff', value: '147', icon: <Users size={20} />, color: 'from-primary-500 to-teal-600' },
    { label: 'On Shift', value: '52', icon: <Clock size={20} />, color: 'from-emerald-500 to-green-600' },
    { label: 'Doctors', value: '34', icon: <Stethoscope size={20} />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Nurses', value: '61', icon: <Shield size={20} />, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className={`text-3xl font-bold ${
              isLight ? 'text-[#1a2e2e]' : 'gradient-text'
            }`}
          >
            Staff Management
          </h1>
          <p className="theme-text-muted mt-2">
            Manage staff schedules, roles, and permissions
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary flex items-center gap-2 cursor-pointer"
          id="add-staff-btn"
        >
          <UserPlus size={18} />
          Add Staff
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 glass-card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-muted text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Shift Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isLight ? 'bg-primary-100' : 'bg-primary-500/20'}`}>
              <Calendar size={20} className={isLight ? 'text-primary-600' : 'text-primary-400'} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
                Current Shift
              </h2>
              <p className="theme-text-muted text-sm">Morning shift • 6:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${
          isLight ? 'border-gray-200 bg-gray-50/50' : 'border-white/10 bg-white/[0.02]'
        }`}>
          <Users size={48} className="mx-auto mb-3 theme-text-subtle" />
          <p className={`font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Staff management interface coming soon
          </p>
          <p className="text-sm mt-2 theme-text-subtle">
            Schedule shifts, track attendance, and manage credentials
          </p>
        </div>
      </motion.div>

      {/* ─── Add Staff Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" id="add-staff-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 ${isLight ? 'bg-black/20' : 'bg-black/60'} backdrop-blur-sm`}
              onClick={handleReset}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border ${
                isLight
                  ? 'bg-white border-gray-200/80'
                  : 'bg-[#1E1E2F] border-white/10'
              }`}
            >
              {/* Modal Header */}
              <div
                className={`sticky top-0 z-10 flex items-center justify-between px-7 py-5 border-b ${
                  isLight
                    ? 'bg-white/95 border-gray-100 backdrop-blur-md'
                    : 'bg-[#1E1E2F]/95 border-white/5 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-lg">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-bold ${
                        isLight ? 'text-gray-800' : 'text-gray-100'
                      }`}
                    >
                      Add New Staff Member
                    </h3>
                    <p
                      className={`text-xs ${
                        isLight ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      Fill in the details below to register new staff
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isLight
                      ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                      : 'hover:bg-white/10 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-7 space-y-6">
                {/* Section: Personal Information */}
                <div>
                  <h4
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <Users size={14} />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <ThemedInput
                        label="Full Name"
                        placeholder="Dr. Jane Smith"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        required
                        icon={<Users size={16} />}
                        isLight={isLight}
                      />
                    </div>
                    <ThemedInput
                      label="Age"
                      placeholder="32"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                      type="number"
                      required
                      isLight={isLight}
                    />
                    <ThemedSelect
                      label="Designation"
                      value={form.designation}
                      onChange={(e) =>
                        setForm({ ...form, designation: e.target.value })
                      }
                      options={designationOptions}
                      required
                      icon={<Briefcase size={16} />}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`border-t ${
                    isLight ? 'border-gray-100' : 'border-white/5'
                  }`}
                />

                {/* Section: Professional Details */}
                <div>
                  <h4
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <Briefcase size={14} />
                    Professional Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ThemedSelect
                      label="Role Type"
                      value={form.roleType}
                      onChange={(e) =>
                        setForm({ ...form, roleType: e.target.value })
                      }
                      options={roleOptions}
                      required
                      icon={<Stethoscope size={16} />}
                      isLight={isLight}
                    />
                    <ThemedSelect
                      label="Department"
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      options={departmentOptions}
                      required
                      icon={<Shield size={16} />}
                      isLight={isLight}
                    />
                    <ThemedInput
                      label="Experience (Years)"
                      placeholder="5"
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      type="number"
                      isLight={isLight}
                    />
                    <ThemedSelect
                      label="Shift Timing"
                      value={form.shiftTiming}
                      onChange={(e) =>
                        setForm({ ...form, shiftTiming: e.target.value })
                      }
                      options={shiftOptions}
                      icon={<Clock size={16} />}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`border-t ${
                    isLight ? 'border-gray-100' : 'border-white/5'
                  }`}
                />

                {/* Section: Contact Information */}
                <div>
                  <h4
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <Phone size={14} />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ThemedInput
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      type="tel"
                      required
                      icon={<Phone size={16} />}
                      isLight={isLight}
                    />
                    <ThemedInput
                      label="Email Address"
                      placeholder="jane.smith@hospital.org"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      type="email"
                      required
                      icon={<Mail size={16} />}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className={`border-t ${
                    isLight ? 'border-gray-100' : 'border-white/5'
                  }`}
                />

                {/* Section: Additional Notes */}
                <div>
                  <h4
                    className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isLight ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <FileText size={14} />
                    Additional Details
                  </h4>
                  <ThemedTextarea
                    label="Notes"
                    placeholder="Any additional information about this staff member..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    icon={<FileText size={16} />}
                    isLight={isLight}
                  />
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex items-center justify-end gap-3 pt-4 border-t ${
                    isLight ? 'border-gray-100' : 'border-white/5'
                  }`}
                >
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                      isLight
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-gray-600'
                    }`}
                    id="cancel-staff-btn"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={!submitting ? { scale: 1.02 } : {}}
                    whileTap={!submitting ? { scale: 0.98 } : {}}
                    className={`
                      px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer
                      flex items-center gap-2
                      bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                      hover:from-indigo-700 hover:to-purple-700
                      shadow-lg hover:shadow-xl hover:shadow-indigo-500/25
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    id="submit-staff-btn"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Add Staff Member
                      </>
                    )}
                  </motion.button>
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