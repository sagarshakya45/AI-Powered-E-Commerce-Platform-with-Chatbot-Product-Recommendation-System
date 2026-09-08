import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError } from '@/utils/errorHandler';
import { productQuerySchema, createProductSchema } from '@/validators/productValidator';
import { ProductService } from '@/services/productService';
import { handleOptions, corsHeaders } from '@/lib/cors';
import { requireAdmin } from '@/utils/auth';
import { authenticateUser } from '@/utils/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const queryObj: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const validatedParams = productQuerySchema.parse(queryObj);

    const result = await ProductService.getProducts(validatedParams);

    return ApiResponse.success(result, 'Products retrieved successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return ApiResponse.error('Authentication required', 401, [], corsHeaders);
    }

    const body = await req.json();

    const validatedData = createProductSchema.parse(body);

    let sellerId: string | undefined;
    let isApproved = true;

    if (user.role === 'SALESMAN') {
      sellerId = user.id;
      isApproved = false;
    } else if (user.role !== 'ADMIN') {
      return ApiResponse.error('Only sellers and admins can create products', 403, [], corsHeaders);
    }

    if (sellerId) {
      validatedData.isActive = false;
    }

    const product = await ProductService.createProduct(validatedData, sellerId);

    return ApiResponse.success({ product }, 'Product created successfully', 201, corsHeaders);
  } catch (error) {
    return handleControllerError(error, corsHeaders);
  }
}
