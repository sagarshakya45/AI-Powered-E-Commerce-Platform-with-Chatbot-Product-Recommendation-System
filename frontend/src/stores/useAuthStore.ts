import { create } from 'zustand';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import { LoginFormData, RegisterFormData } from '../utils/validators';
import { useCartStore } from './useCartStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (data: LoginFormData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(data);
      if (res.success) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        useCartStore.getState().syncWithBackend();
      }
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (data: RegisterFormData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(data);
      if (res.success) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        useCartStore.getState().syncWithBackend();
      }
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await authService.getCurrentUser();
      if (res.success && res.data.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        useCartStore.getState().syncWithBackend();
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
