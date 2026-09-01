import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError } from '@/utils/errorHandler';
import { productQuerySchema, createProductSchema } from '@/validators/productValidator';
import { ProductService } from '@/services/productService';
import { handleOptions, corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters into an object
    const queryObj: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    // Validate parameters with Zod
    const validatedParams = productQuerySchema.parse(queryObj);

    // Call service layer
    const result = await ProductService.getProducts(validatedParams);

    return ApiResponse.success(result, 'Products retrieved successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload with Zod
    const validatedData = createProductSchema.parse(body);

    // Call service layer
    const product = await ProductService.createProduct(validatedData);

    return ApiResponse.success({ product }, 'Product created successfully', 201, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}
