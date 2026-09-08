import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError } from '@/utils/errorHandler';
import { updateProductSchema } from '@/validators/productValidator';
import { ProductService } from '@/services/productService';
import { handleOptions, corsHeaders } from '@/lib/cors';
import { requireAdmin } from '@/utils/auth';
import { authenticateUser } from '@/utils/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await ProductService.getProductBySlugOrId(slug);

    return ApiResponse.success({ product }, 'Product details retrieved successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return ApiResponse.error('Authentication required', 401, [], corsHeaders);
    }

    if (user.role !== 'ADMIN' && user.role !== 'SALESMAN') {
      return ApiResponse.error('Admin or seller access required', 403, [], corsHeaders);
    }

    const { slug } = params;
    const body = await req.json();

    const validatedData = updateProductSchema.parse(body);

    const sellerId = user.role === 'SALESMAN' ? user.id : undefined;

    const product = await ProductService.updateProduct(slug, validatedData, sellerId);

    return ApiResponse.success({ product }, 'Product updated successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return ApiResponse.error('Authentication required', 401, [], corsHeaders);
    }

    if (user.role !== 'ADMIN' && user.role !== 'SALESMAN') {
      return ApiResponse.error('Admin or seller access required', 403, [], corsHeaders);
    }

    const { slug } = params;

    const sellerId = user.role === 'SALESMAN' ? user.id : undefined;
    const result = await ProductService.deleteProduct(slug, sellerId);

    return ApiResponse.success(result, 'Product deleted successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}
