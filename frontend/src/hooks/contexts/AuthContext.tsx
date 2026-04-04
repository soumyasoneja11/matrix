import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, LoginRequest, SignUpRequest } from '../../types/staff';
import { authAPI } from '../../services/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignUpRequest) => Promise<void>;
  demoLogin: () => void;
  logout: () => void;
  isSupervisor: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'er_triage_user';
const DEMO_KEY = 'er_triage_demo';

const DEMO_USER: AuthUser = {
  id: '0',
  username: 'superadmin',
  fullName: 'Super Administrator',
  email: 'admin@ertriage.com',
  role: 'SUPERVISOR',
  department: 'Operations',
  token: 'demo-token',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demoFlag = localStorage.getItem(DEMO_KEY);
    if (demoFlag === 'true') {
      setUser(DEMO_USER);
      setIsDemo(true);
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await authAPI.login(data);
    const authUser = res.data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setIsDemo(false);
    localStorage.removeItem(DEMO_KEY);
    setUser(authUser);
  };

  const signup = async (data: SignUpRequest) => {
    const res = await authAPI.signup(data);
    const authUser = res.data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setIsDemo(false);
    localStorage.removeItem(DEMO_KEY);
    setUser(authUser);
  };

  const demoLogin = () => {
    localStorage.setItem(DEMO_KEY, 'true');
    localStorage.removeItem(STORAGE_KEY);
    setIsDemo(true);
    setUser(DEMO_USER);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEMO_KEY);
    setIsDemo(false);
    setUser(null);
  };

  const isSupervisor = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, signup, demoLogin, logout, isSupervisor, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
