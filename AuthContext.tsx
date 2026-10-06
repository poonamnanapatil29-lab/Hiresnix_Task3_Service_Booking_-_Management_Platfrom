import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, NotificationItem } from '../types';
import { apiRequest } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  quickLogin: (role: 'customer' | 'provider' | 'admin') => Promise<void>;
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('servisync_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await apiRequest<{ success: boolean; user: User }>('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await apiRequest<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }>('/notifications');
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  const markAllNotificationsRead = async () => {
    if (!token) return;
    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiRequest<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('servisync_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData: any): Promise<User> => {
    const res = await apiRequest<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('servisync_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('servisync_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  const quickLogin = async (role: 'customer' | 'provider' | 'admin') => {
    let email = 'sarah@example.com';
    if (role === 'provider') email = 'elena@cleanpro.com';
    if (role === 'admin') email = 'admin@servisync.com';
    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      quickLogin,
      notifications,
      unreadCount,
      fetchNotifications,
      markAllNotificationsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
