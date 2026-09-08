import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const store = await prisma.store.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { store },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const body = await req.json();
    const { name, description, logo, banner } = body;

    if (!name || name.trim().length < 2) {
      throw new AppError('Store name must be at least 2 characters', 400);
    }

    const store = await prisma.store.upsert({
      where: { userId: user.id },
      update: { name: name.trim(), description, logo, banner },
      create: {
        userId: user.id,
        name: name.trim(),
        description,
        logo,
        banner,
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { store },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const body = await req.json();
    const { name, description, logo, banner, isVerified } = body;

    const store = await prisma.store.update({
      where: { userId: user.id },
      data: { name, description, logo, banner, isVerified },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { store },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
