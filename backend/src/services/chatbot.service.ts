import { prisma } from '@/lib/prisma';
import { getAIProvider, Message } from '@/lib/ai/aiProvider';

export class ChatbotService {
  static async processChat(message: string, history: Message[] = []) {
    // Fetch a subset of active products to ground the AI in reality
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { title: true, price: true, description: true },
      take: 50 // Limit to prevent massive prompt payload
    });

    const storeContext = JSON.stringify(products);
    
    const systemPrompt = `You are a helpful AI shopping assistant. 
You must only recommend products based on this store context: ${storeContext}.
Do not invent prices, products, stock, discounts, or ratings. If a user asks for something not in the context, politely say we do not have it right now.`;

    const aiProvider = getAIProvider();
    
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await aiProvider.chat(messages);
    return response;
  }
}
