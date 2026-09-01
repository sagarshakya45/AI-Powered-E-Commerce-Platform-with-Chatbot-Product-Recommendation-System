import { api } from './api';

export const registerUserApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutUserApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
