import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';
import { updateProductSchema } from '@/validators/productValidator';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const product = await ProductService.getProductBySlugOrId(params.id);

    if (product.sellerId !== user.id) {
      throw new AppError('You can only view your own products', 403);
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { product },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const body = await req.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await ProductService.updateProduct(params.id, validatedData, user.id);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { product },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const result = await ProductService.deleteProduct(params.id, user.id);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: result.message,
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
