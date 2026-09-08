import OpenAI from 'openai';
import { requireEnv } from '@/utils/env';
import { AIProvider, Message } from './aiProvider';

export class OpenAIProvider implements AIProvider {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: requireEnv('OPENAI_API_KEY'),
    });
    this.model = 'gpt-4o-mini';
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0]?.message?.content || '';
  }

  async chat(messages: Message[]): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    });
    return response.choices[0]?.message?.content || '';
  }

  async summarize(text: string): Promise<string> {
    const prompt = `Please provide a concise summary of the following customer reviews. Highlight common positives and complaints:\n\n${text}`;
    return this.generateText(prompt);
  }
}
