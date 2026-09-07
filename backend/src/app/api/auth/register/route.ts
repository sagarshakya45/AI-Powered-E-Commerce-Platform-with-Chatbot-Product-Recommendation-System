import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateAccessToken, generateRefreshToken, createCookieHeader } from '@/utils/auth';
import { registerSchema } from '@/validators/authValidator';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);
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

    const { name, email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 409,
          message: 'Email address is already registered',
        },
        { status: 409, headers: corsHeaders }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Account created successfully',
        data: { user: userProfile },
      },
      { status: 201, headers: corsHeaders }
    );

    response.headers.append(
      'Set-Cookie',
      createCookieHeader('accessToken', accessToken, 15 * 60)
    );
    response.headers.append(
      'Set-Cookie',
      createCookieHeader('refreshToken', refreshToken, 7 * 24 * 60 * 60)
    );

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || 'Internal server error during registration',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
