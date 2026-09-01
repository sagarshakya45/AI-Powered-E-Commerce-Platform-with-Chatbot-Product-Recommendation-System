import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';

export function authenticate(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  let token = req.cookies.get('accessToken')?.value;

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    throw new AppError('Unauthorized: Access token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string; email: string; role: string };
    return decoded;
  } catch (err) {
    throw new AppError('Unauthorized: Token invalid or expired', 401);
  }
}
