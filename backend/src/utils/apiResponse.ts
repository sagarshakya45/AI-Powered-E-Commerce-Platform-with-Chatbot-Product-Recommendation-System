import { NextResponse } from 'next/server';
import { ApiResponseFormat } from '../types';

export class ApiResponse {
  static success<T>(data: T, message = 'Success', statusCode = 200, headers: HeadersInit = {}) {
    const body: ApiResponseFormat<T> = {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(body, { status: statusCode, headers });
  }

  static error(message = 'An error occurred', statusCode = 500, errors: any[] = []) {
    const body: ApiResponseFormat = {
      success: false,
      statusCode,
      message,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(body, { status: statusCode });
  }
}
