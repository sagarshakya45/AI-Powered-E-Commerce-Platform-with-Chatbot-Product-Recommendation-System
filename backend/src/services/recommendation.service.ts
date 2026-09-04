import { prisma } from '@/lib/prisma';
import { getAIProvider } from '@/lib/ai/aiProvider';

export class RecommendationService {
  static async getRecommendations(userId?: string) {
    // Fallback base algorithm (e.g., popular or featured products)
    const fallbackProducts = await prisma.product.findMany({
      where: { isActive: true },
      take: 5,
      orderBy: { stock: 'desc' }, // simple proxy for popularity
    });

    try {
      const aiProvider = getAIProvider();
      
      const prompt = `Based on standard e-commerce trends, what are 3 popular product categories to recommend? Return only a comma-separated list.`;
      const aiResponse = await aiProvider.generateText(prompt);
      
      return {
        aiInsights: aiResponse,
        products: fallbackProducts
      };
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      // Ensure the system works even if AI is down (fallback)
      return {
        aiInsights: null,
        products: fallbackProducts
      };
    }
  }
}
