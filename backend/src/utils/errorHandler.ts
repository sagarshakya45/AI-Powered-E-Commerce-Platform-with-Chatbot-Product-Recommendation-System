import { ZodError } from 'zod';
import { ApiResponse } from './apiResponse';

export class AppError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(message: string, statusCode = 500, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleControllerError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof AppError) {
    return ApiResponse.error(error.message, error.statusCode, error.errors);
  }

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error('Validation failed', 400, formattedErrors);
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return ApiResponse.error(message, 500);
}
