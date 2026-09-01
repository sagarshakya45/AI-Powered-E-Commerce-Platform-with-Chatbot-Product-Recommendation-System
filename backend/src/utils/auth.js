import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { stringifyCookie } from 'cookie';
import { prisma } from '@/lib/prisma';


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Hash plain text password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate Access Token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
}

/**
 * Generate Refresh Token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Serialize Cookie Header
 */
export function createCookieHeader(name, value, maxAgeSeconds) {
  if (typeof stringifyCookie === 'function') {
    return stringifyCookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
    });
  }
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

/**
 * Authenticate User from Request Cookies or Authorization Header
 */
export async function authenticateUser(req) {
  const authHeader = req.headers.get('authorization');
  let token = req.cookies.get('accessToken')?.value;

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return { user: null, error: 'Unauthorized: No token provided', status: 401 };
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || !decoded.userId) {
    return { user: null, error: 'Unauthorized: Invalid or expired access token', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  if (!user) {
    return { user: null, error: 'User not found', status: 404 };
  }

  return { user, error: null };
}

/**
 * Helper to ensure Admin user
 */
export async function requireAdmin(req) {
  const { user, error, status } = await authenticateUser(req);
  if (error) return { user: null, error, status };
  if (user.role !== 'ADMIN') {
    return { user: null, error: 'Forbidden: Admin access required', status: 403 };
  }
  return { user, error: null };
}

