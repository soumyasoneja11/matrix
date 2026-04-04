import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, LoginRequest, SignUpRequest } from '../types/staff';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  isSupervisor: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'er_triage_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    setUser(authUser);
  };

  const signup = async (data: SignUpRequest) => {
    const res = await authAPI.signup(data);
    const authUser = res.data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isSupervisor = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const isDoctor = user?.role === 'DOCTOR';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isSupervisor, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
