export type Role = 'CUSTOMER' | 'ADMIN' | 'SALESMAN';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  publicId?: string;
  isPrimary: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  productId: string;
  userId: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
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
  category?: Category;
  sellerId?: string | null;
  seller?: Seller;
  storeId?: string | null;
  store?: Store;
  images: ProductImage[];
  reviews?: Review[];
  avgRating?: number;
  reviewCount?: number;
  ratingDistribution?: { 5: number; 4: number; 3: number; 2: number; 1: number };
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product | { id: string; title: string; images?: ProductImage[] };
  sellerId?: string | null;
  seller?: Seller;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  address?: Address;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  couponId?: string | null;
  items: OrderItem[];
  payment?: {
    id: string;
    status: PaymentStatus;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  isActive?: boolean;
  expiresAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponseData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
