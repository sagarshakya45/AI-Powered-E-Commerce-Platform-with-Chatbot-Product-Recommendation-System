import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError, AppError } from '@/utils/errorHandler';
import { authenticateUser } from '@/utils/auth';
import { CartService } from '@/services/cartService';
import { updateCartItemSchema } from '@/validators/cartValidator';
import { handleOptions, corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to update cart item', 401);
    }

    const { productId } = params;
    const body = await req.json();
    const { quantity } = updateCartItemSchema.parse(body);

    const result = await CartService.updateCartItemQuantity(user.id, productId, quantity);
    return ApiResponse.success(result, 'Cart item updated successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      throw new AppError('Authentication required to remove cart item', 401);
    }

    const { productId } = params;

    const result = await CartService.removeCartItem(user.id, productId);
    return ApiResponse.success(result, 'Cart item removed successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}
