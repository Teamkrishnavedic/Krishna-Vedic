import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const { data } = await api.post('/auth/google', { credential });
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (formData: { name: string; email: string; phone: string; password: string }) => {
      const { data } = await api.post('/auth/register', formData);
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
  }, []);

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');
  const isStaff = ['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        isStaff,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
