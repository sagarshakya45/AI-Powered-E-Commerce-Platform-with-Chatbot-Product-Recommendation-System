import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: any[] }>) => {
    const customMessage =
      error.response?.data?.message ||
      (error.response?.data?.errors?.[0]?.message ?? error.message) ||
      'An unexpected network error occurred';
    error.message = customMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
