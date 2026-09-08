import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProductSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().uuid('Invalid category ID'),
  isFeatured: z.boolean().optional(),
});

export const chatbotMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000, 'Message content must be 2000 characters or fewer'),
});

export const chatbotRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z.array(chatbotMessageSchema).max(20, 'History is limited to the most recent 20 messages').optional(),
});
