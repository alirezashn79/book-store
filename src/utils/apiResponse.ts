import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export class ApiResponseHandler {
  static success<T>(
    data: T,
    message?: string,
    status: number = 200
  ): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    )
  }

  static error(
    message?: string,
    status: number = 400,
    error?: unknown
  ): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error,
      },
      { status }
    )
  }

  static notFound(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(message || 'Resource not found', 404, error || { code: 'NOT_FOUND' })
  }

  static unauthorized(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(message || 'Unauthorized access', 401, error || { code: 'UNAUTHORIZED' })
  }

  static forbidden(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(message || 'Access forbidden', 403, error || { code: 'FORBIDDEN' })
  }

  static internalError(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(message || 'Internal server error', 500, error || { code: 'INTERNAL_ERROR' })
  }

  static validationError(errors: unknown, message?: string): NextResponse<ApiErrorResponse> {
    return this.error(message || 'Validation failed', 422, {
      code: 'VALIDATION_ERROR',
      details: errors,
    })
  }
}
