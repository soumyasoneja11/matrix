import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Shield, Eye, EyeOff, Play } from 'lucide-react';
import { useAuth } from '../hooks/contexts/AuthContext';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import hospitalBg from '../assets/images/hospital.png';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export function LoginPage({ onSwitchToSignUp }: LoginPageProps) {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cream">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-50/60 via-cream to-primary-50/40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-sm mx-4"
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-forest-100/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 flex items-center justify-center mb-4">
              <Stethoscope size={24} className="text-primary-400" />
            </div>
            <h1 className="text-xl font-bold text-forest-900 tracking-tight">ER Triage Sprint</h1>
            <p className="text-xs text-forest-400 mt-1">AI-Powered Emergency Triage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="absolute right-3 top-9 text-forest-300 hover:text-forest-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2"
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
                'Sign In'
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('admin123');
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer
              bg-forest-50 text-forest-800 border border-forest-200
              hover:bg-forest-100 hover:border-forest-300
              active:scale-[0.98] transition-all duration-200"
          >
            Use Admin Credentials
          </button>

          {/* Demo Mode */}
          <button
            onClick={demoLogin}
            className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer
              bg-primary-50 text-primary-700 border border-primary-200
              hover:bg-primary-100 hover:border-primary-300
              active:scale-[0.98] transition-all duration-200"
          >
            <Play size={14} />
            Enter Demo Mode
          </button>

          <div className="mt-5 text-center">
            <p className="text-sm text-forest-400">
              Don't have an account?{' '}
              <button
                onClick={() => { onSwitchToSignUp ? onSwitchToSignUp() : navigate('/signup'); }}
                className="text-forest-800 font-semibold hover:text-forest-900 transition-colors cursor-pointer underline underline-offset-2"
              >
                Sign Up
              </button>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-[11px] text-forest-300">
            <span className="flex items-center gap-1"><Heart size={11} /> HIPAA Compliant</span>
            <span className="flex items-center gap-1"><Shield size={11} /> Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
