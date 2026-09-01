import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { handleControllerError } from '@/utils/errorHandler';
import { HealthService } from '@/services/healthService';
import { handleOptions, corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const statusData = HealthService.getHealthStatus();
    return ApiResponse.success(statusData, 'API v1 Health check passed successfully', 200, corsHeaders);
  } catch (error) {
    return handleControllerError(error);
  }
}
