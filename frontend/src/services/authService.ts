import { api } from './api';
import { LoginFormData, RegisterFormData } from '../utils/validators';
import { ApiResponse, User } from '../types';

export const authService = {
  async register(data: RegisterFormData): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  async login(data: LoginFormData): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
