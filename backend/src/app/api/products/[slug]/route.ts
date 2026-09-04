import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError } from '@/utils/errorHandler';
import { updateProductSchema } from '@/validators/productValidator';
import { ProductService } from '@/services/productService';
import { handleOptions, corsHeaders } from '@/lib/cors';
import { requireAdmin } from '@/utils/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Call service layer
    const product = await ProductService.getProductBySlugOrId(slug);

    return ApiResponse.success({ product }, 'Product details retrieved successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return ApiResponse.error('Admin access required', 403);
    }

    const { slug } = params;
    const body = await req.json();

    // Validate payload with Zod
    const validatedData = updateProductSchema.parse(body);

    // Call service layer
    const product = await ProductService.updateProduct(slug, validatedData);

    return ApiResponse.success({ product }, 'Product updated successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return ApiResponse.error('Admin access required', 403);
    }

    const { slug } = params;

    // Call service layer
    const result = await ProductService.deleteProduct(slug);

    return ApiResponse.success(result, 'Product deleted successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}
