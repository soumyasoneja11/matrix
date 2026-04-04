import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import hospitalBg from '../assets/images/hospital.png';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export function LoginPage({ onSwitchToSignUp }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-primary-100/30 to-blue-50" />
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg mb-4">
              <Stethoscope size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary-900 tracking-tight">ER Triage Sprint</h1>
            <p className="text-sm text-gray-500 mt-1">AI-Powered Emergency Triage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <Shield size={16} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Footer features */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Heart size={12} /> HIPAA Compliant</span>
            <span className="flex items-center gap-1"><Shield size={12} /> Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
