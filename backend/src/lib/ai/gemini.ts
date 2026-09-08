import { GoogleGenAI } from '@google/genai';
import { requireEnv } from '@/utils/env';
import { AIProvider, Message } from './aiProvider';

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: requireEnv('GEMINI_API_KEY'),
    });
    this.model = 'gemini-3.6-flash';
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt
    });
    return response.text || '';
  }

  async chat(messages: Message[]): Promise<string> {
    const contents = messages.map((msg) => {
      let role = 'user';
      if (msg.role === 'assistant') role = 'model';
      // Map system messages to user, as Gemini handles system prompts differently 
      // but for basic chat abstraction, merging to user is a simple fallback.
      if (msg.role === 'system') role = 'user';

      return {
        role,
        parts: [{ text: msg.content }]
      };
    });

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents
    });
    return response.text || '';
  }

  async summarize(text: string): Promise<string> {
    const prompt = `Please provide a concise summary of the following customer reviews. Highlight common positives and complaints:\n\n${text}`;
    return this.generateText(prompt);
  }
}
