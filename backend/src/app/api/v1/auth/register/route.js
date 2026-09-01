import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateAccessToken, generateRefreshToken, createCookieHeader } from '@/utils/auth';
import { registerSchema } from '@/validators/authValidator';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request payload
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
        { status: 400 }
      );
    }

    const { name, email, password, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 409,
          message: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create User (default to CUSTOMER unless explicitly ADMIN)
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Also initialize an empty Cart for the user
    await prisma.cart.create({
      data: { userId: user.id },
    });

    // Also initialize a Wishlist for the user
    await prisma.wishlist.create({
      data: { userId: user.id },
    });

    // Tokens payload
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

    // Create Response & Set HTTP-Only Cookies
    const response = NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: { user },
      },
      { status: 201 }
    );

    // 15 mins for access token, 7 days for refresh token
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
    console.error('Registration Error:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || 'Internal server error during registration',
      },
      { status: 500 }
    );
  }
}
