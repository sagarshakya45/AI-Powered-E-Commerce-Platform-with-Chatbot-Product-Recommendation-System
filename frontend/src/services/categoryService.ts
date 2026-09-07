import apiClient from './apiClient';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories');
    return response.data.data?.categories || [];
  },
};

export default categoryService;
