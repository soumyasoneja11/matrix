import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/contexts/AuthContext';
import { InputField, SelectField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import type { Role } from '../types/staff';

interface SignUpPageProps {
  onSwitchToLogin: () => void;
}

const roleOptions = [
  { value: '', label: 'Select Role' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
];

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'EMERGENCY_DEPARTMENT', label: 'Emergency Department' },
  { value: 'CARDIOLOGY', label: 'Cardiology' },
  { value: 'NEUROLOGY', label: 'Neurology' },
  { value: 'ORTHOPEDICS', label: 'Orthopedics' },
  { value: 'PULMONOLOGY', label: 'Pulmonology' },
  { value: 'GASTROENTEROLOGY', label: 'Gastroenterology' },
  { value: 'SURGERY', label: 'Surgery' },
  { value: 'ALLERGY', label: 'Allergy' },
  { value: 'ENDOCRINOLOGY', label: 'Endocrinology' },
  { value: 'GENERAL_MEDICINE', label: 'General Medicine' },
  { value: 'GYNECOLOGY', label: 'Gynecology' },
  { value: 'ADMINISTRATION', label: 'Administration' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'FRONT_DESK', label: 'Front Desk' },
];

export function SignUpPage({ onSwitchToLogin }: SignUpPageProps) {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: '' as Role | '',
    department: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role || !form.department) {
      setError('Please select a role and department.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role as Role,
        department: form.department,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-primary-100/30 to-blue-50" />
      <div className="absolute top-10 right-20 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg mx-4 my-8"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg mb-3">
              <Stethoscope size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join ER Triage Sprint</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              placeholder="Dr. Jane Doe"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Username"
                placeholder="janedoe"
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                required
              />
              <InputField
                label="Email"
                type="email"
                placeholder="jane@hospital.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Role"
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                options={roleOptions}
                required
              />
              <SelectField
                label="Department"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                options={departmentOptions}
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => { onSwitchToLogin ? onSwitchToLogin() : navigate('/'); }}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
