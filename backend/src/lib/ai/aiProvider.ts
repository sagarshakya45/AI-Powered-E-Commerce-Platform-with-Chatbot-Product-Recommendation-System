import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  generateText(prompt: string): Promise<string>;
  chat(messages: Message[]): Promise<string>;
  summarize(text: string): Promise<string>;
}

export const getAIProvider = (): AIProvider => {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === 'gemini') {
    return new GeminiProvider();
  }

  // Default or fallback to OpenAI
  return new OpenAIProvider();
};
