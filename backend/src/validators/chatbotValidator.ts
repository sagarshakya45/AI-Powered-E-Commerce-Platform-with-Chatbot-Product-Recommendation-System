import { z } from 'zod';

export const chatbotMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000, 'Message content must be 2000 characters or fewer'),
});

export const chatbotRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  history: z.array(chatbotMessageSchema).max(20, 'History is limited to the most recent 20 messages').optional(),
});

export type ChatbotMessage = z.infer<typeof chatbotMessageSchema>;
export type ChatbotRequestInput = z.infer<typeof chatbotRequestSchema>;
