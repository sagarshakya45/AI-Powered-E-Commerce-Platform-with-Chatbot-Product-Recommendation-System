import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateAccessToken, generateRefreshToken, createCookieHeader } from '@/utils/auth';
import { loginSchema } from '@/validators/authValidator';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request payload
    const validationResult = loginSchema.safeParse(body);
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
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Compare Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Create Tokens
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store Refresh Token in DB
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
        statusCode: 200,
        message: 'Login successful',
        data: { user: userProfile },
      },
      { status: 200 }
    );

    // Set HTTP-Only cookies
    response.headers.append(
      'Set-Cookie',
      createCookieHeader('accessToken', accessToken, 15 * 60)
    );
    response.headers.append(
      'Set-Cookie',
      createCookieHeader('refreshToken', refreshToken, 7 * 24 * 60 * 60)
    );

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || 'Internal server error during login',
      },
      { status: 500 }
    );
  }
}
