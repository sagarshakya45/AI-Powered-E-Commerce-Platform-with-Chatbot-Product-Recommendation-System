import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError, AppError } from '@/utils/errorHandler';
import { authenticateUser } from '@/utils/auth';
import { CartService } from '@/services/cartService';
import { syncCartSchema } from '@/validators/cartValidator';
import { handleOptions, corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to sync cart', 401);
    }

    const body = await req.json();
    const validated = syncCartSchema.parse(body);
    const items = validated.items as { productId: string; quantity: number }[];

    const result = await CartService.syncCart(user.id, items);
    return ApiResponse.success(result, 'Cart synchronized successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}
