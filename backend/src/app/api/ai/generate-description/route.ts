import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/ai.service';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, statusCode: 403, message: 'Forbidden: Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { title, category, features } = body;

    if (!title || !category || !features || !Array.isArray(features)) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Title, category, and features array are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const description = await AIService.generateDescription({ title, category, features });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { description }
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to generate description' },
      { status: 500, headers: corsHeaders }
    );
  }
}
