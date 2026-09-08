import { NextRequest, NextResponse } from 'next/server';
import { ChatbotService } from '@/services/chatbot.service';
import { chatbotRequestSchema } from '@/validators/index';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { checkAIRateLimit, getClientIp } from '@/utils/rateLimiter';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  if (!checkAIRateLimit(getClientIp(req))) {
    return NextResponse.json(
      { success: false, statusCode: 429, message: 'Too many requests. Please try again later.' },
      { status: 429, headers: corsHeaders }
    );
  }

  try {
    const body = await req.json();

    const validationResult = chatbotRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: 'Validation error',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const { message, history } = validationResult.data;

    const cappedHistory = history ? history.slice(-20) : [];

    const response = await ChatbotService.processChat(message, cappedHistory);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { reply: response }
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Chatbot failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
