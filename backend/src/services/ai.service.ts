import { getAIProvider } from '@/lib/ai/aiProvider';
import { prisma } from '@/lib/prisma';

export class AIService {
  static async summarizeReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true, comment: true }
    });

    if (reviews.length === 0) {
      return "No reviews available to summarize.";
    }

    const reviewText = reviews.map(r => `Rating: ${r.rating}/5 - ${r.comment}`).join('\n');
    
    const aiProvider = getAIProvider();
    const summary = await aiProvider.summarize(reviewText);
    
    return summary;
  }

  static async generateDescription(data: { title: string; category: string; features: string[] }) {
    const prompt = `
Generate a product description for an e-commerce store.
Product: ${data.title}
Category: ${data.category}
Features: ${data.features.join(', ')}

Please provide:
- Short description (1-2 sentences)
- Detailed description
- Highlights (bullet points)
- SEO meta description
    `;
    
    const aiProvider = getAIProvider();
    const generated = await aiProvider.generateText(prompt);
    
    return generated;
  }
}
