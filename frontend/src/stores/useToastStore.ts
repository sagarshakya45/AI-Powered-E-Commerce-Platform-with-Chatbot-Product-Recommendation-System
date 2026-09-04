import { create } from 'zustand';
import { Product } from '../types';

interface ToastData {
  product: Product;
  quantity: number;
}

interface ToastState {
  toast: ToastData | null;
  showToast: (product: Product, quantity?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (product: Product, quantity = 1) => {
    set({ toast: { product, quantity } });
  },
  hideToast: () => {
    set({ toast: null });
  },
}));
