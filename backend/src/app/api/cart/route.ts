import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError, AppError } from '@/utils/errorHandler';
import { authenticateUser } from '@/utils/auth';
import { CartService } from '@/services/cartService';
import { addCartItemSchema } from '@/validators/cartValidator';
import { handleOptions, corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to access user cart', 401);
    }

    const result = await CartService.getUserCart(user.id);
    return ApiResponse.success(result, 'Cart retrieved successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to add item to cart', 401);
    }

    const body = await req.json();
    const { productId, quantity } = addCartItemSchema.parse(body);

    const result = await CartService.addItemToCart(user.id, productId, quantity);
    return ApiResponse.success(result, 'Cart updated successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to clear cart', 401);
    }

    const result = await CartService.clearCart(user.id);
    return ApiResponse.success(result, 'Cart cleared successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}
