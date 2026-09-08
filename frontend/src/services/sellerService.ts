import apiClient from './apiClient';
import { ApiResponse } from '../types';

export interface SellerProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  isApproved: boolean;
  brand?: string | null;
  sku?: string | null;
  attributes?: Record<string, any> | null;
  views: number;
  salesCount: number;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  images: { id: string; url: string; isPrimary: boolean }[];
  reviews?: { rating: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  userId: string;
  user: { id: string; name: string; email: string };
  addressId: string;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    productId: string;
    product: { id: string; title: string; images?: { url: string; isPrimary: boolean }[] };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
    sellerId?: string;
  }>;
  payment: { id: string; status: string; amount: number };
  createdAt: string;
  updatedAt: string;
}

export interface SellerStore {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerAnalytics {
  totalOrders: number;
  totalUnitsSold: number;
  totalRevenue: number;
  totalViews: number;
  avgRating: number;
  topProducts: Array<{
    id: string;
    title: string;
    views: number;
    salesCount: number;
    avgRating: number;
    reviewCount: number;
    stock: number;
    price: number;
    discountPrice?: number | null;
  }>;
  lowStockProducts: Array<{
    id: string;
    title: string;
    stock: number;
    price: number;
  }>;
  recentOrders: SellerOrder[];
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { id: string; name: string; avatar?: string };
    product: { id: string; title: string };
  }>;
}

export const sellerService = {
  getStore: async (): Promise<{ store: SellerStore } | null> => {
    const response = await apiClient.get<ApiResponse<{ store: SellerStore | null }>>('/seller/store');
    return response.data.data?.store || null;
  },

  createStore: async (data: { name: string; description?: string; logo?: string; banner?: string }): Promise<SellerStore> => {
    const response = await apiClient.post<ApiResponse<{ store: SellerStore }>>('/seller/store', data);
    return response.data.data!.store;
  },

  updateStore: async (data: Partial<SellerStore>): Promise<SellerStore> => {
    const response = await apiClient.put<ApiResponse<{ store: SellerStore }>>('/seller/store', data);
    return response.data.data!.store;
  },

  getProducts: async (): Promise<SellerProduct[]> => {
    const response = await apiClient.get<ApiResponse<{ products: SellerProduct[] }>>('/seller/products');
    return response.data.data!.products;
  },

  getProduct: async (id: string): Promise<SellerProduct> => {
    const response = await apiClient.get<ApiResponse<{ product: SellerProduct }>>(`/seller/products/${id}`);
    return response.data.data!.product;
  },

  createProduct: async (data: Partial<SellerProduct>): Promise<SellerProduct> => {
    const response = await apiClient.post<ApiResponse<{ product: SellerProduct }>>('/seller/products', data);
    return response.data.data!.product;
  },

  updateProduct: async (id: string, data: Partial<SellerProduct>): Promise<SellerProduct> => {
    const response = await apiClient.put<ApiResponse<{ product: SellerProduct }>>(`/seller/products/${id}`, data);
    return response.data.data!.product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/seller/products/${id}`);
  },

  getOrders: async (): Promise<SellerOrder[]> => {
    const response = await apiClient.get<ApiResponse<{ orders: SellerOrder[] }>>('/seller/orders');
    return response.data.data!.orders;
  },

  updateOrderStatus: async (orderItemId: string, status: string): Promise<void> => {
    await apiClient.put('/seller/orders/update', { orderItemId, status });
  },

  getAnalytics: async (): Promise<SellerAnalytics> => {
    const response = await apiClient.get<ApiResponse<SellerAnalytics>>('/seller/analytics');
    return response.data.data;
  },
};

export default sellerService;
