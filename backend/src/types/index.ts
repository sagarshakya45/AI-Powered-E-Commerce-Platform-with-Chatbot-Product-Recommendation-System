export interface ApiResponseFormat<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
}
