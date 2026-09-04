import { NextRequest, NextResponse } from 'next/server';
import { ChatbotService } from '@/services/chatbot.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await ChatbotService.processChat(message, history || []);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { reply: response }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Chatbot failed' },
      { status: 500 }
    );
  }
}
