import { create } from 'zustand';
import { getCurrentUserApi, loginUserApi, logoutUserApi, registerUserApi } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getCurrentUserApi();
      if (res?.data?.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await loginUserApi(credentials);
      const user = res.data.user;
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Login failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await registerUserApi(userData);
      const user = res.data.user;
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUserApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },
}));
