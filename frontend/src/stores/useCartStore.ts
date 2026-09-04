import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import apiClient from '../services/apiClient';
import { useToastStore } from './useToastStore';

export interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
}

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  
  // Guest Cart Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Coupon Actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computed Properties (Client-side display)
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getDiscount: () => number;
  getTotal: () => number;

  // Authenticated Backend Cart Sync Architecture
  syncWithBackend: () => Promise<void>;
  fetchBackendCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product: Product, quantity = 1) => {
        useToastStore.getState().showToast(product, quantity);
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = updatedItems[existingIndex].quantity + quantity;
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: Math.min(product.stock || 99, newQty),
            };
            return { items: updatedItems };
          } else {
            return {
              items: [...state.items, { product, quantity: Math.min(product.stock || 99, quantity) }],
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      increaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stock || 99;
              return { ...item, quantity: Math.min(maxStock, item.quantity + 1) };
            }
            return item;
          }),
        }));
      },

      decreaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product.id === productId) {
                return { ...item, quantity: item.quantity - 1 };
              }
              return item;
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      setQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.product.id !== productId) };
          }
          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const maxStock = item.product.stock || 99;
                return { ...item, quantity: Math.min(maxStock, quantity) };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'WELCOME10') {
          set({
            coupon: {
              code: 'WELCOME10',
              discountType: 'PERCENTAGE',
              discountValue: 10,
            },
          });
          return { success: true, message: '10% Discount Coupon Applied!' };
        } else if (cleanCode === 'SUMMER20') {
          set({
            coupon: {
              code: 'SUMMER20',
              discountType: 'FIXED',
              discountValue: 20,
            },
          });
          return { success: true, message: '$20 Discount Coupon Applied!' };
        } else {
          return { success: false, message: 'Invalid or expired coupon code' };
        }
      },

      removeCoupon: () => set({ coupon: null }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.discountPrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (get().items.length === 0) return 0;
        return subtotal >= 50 ? 0 : 10;
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal === 0) return 0;

        if (coupon.discountType === 'PERCENTAGE') {
          return (subtotal * coupon.discountValue) / 100;
        } else {
          return Math.min(subtotal, coupon.discountValue);
        }
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShipping();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount + shipping);
      },

      syncWithBackend: async () => {
        try {
          const currentItems = get().items;
          if (currentItems.length === 0) return;

          const payload = {
            items: currentItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          };

          await apiClient.post('/cart/sync', payload);
          await get().fetchBackendCart();
        } catch (error) {
          console.warn('Backend cart sync postponed (user unauthenticated or offline)');
        }
      },

      fetchBackendCart: async () => {
        try {
          const response = await apiClient.get('/cart');
          const serverItems = response.data?.data?.cart?.items;
          if (Array.isArray(serverItems)) {
            const formattedItems: CartItem[] = serverItems.map((si: any) => ({
              product: si.product,
              quantity: si.quantity,
            }));
            set({ items: formattedItems });
          }
        } catch (error) {
          // Keep local guest cart if unauthenticated
        }
      },
    }),
    {
      name: 'auramart-guest-cart',
    }
  )
);
