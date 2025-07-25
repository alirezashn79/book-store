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
    return this.error(error || { code: 'NOT_FOUND' }, message || 'Resource not found', 404)
  }

  static unauthorized(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(error || { code: 'UNAUTHORIZED' }, message || 'Unauthorized access', 401)
  }

  static forbidden(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(error || { code: 'FORBIDDEN' }, message || 'Access forbidden', 403)
  }

  static internalError(message?: string, error?: unknown): NextResponse<ApiErrorResponse> {
    return this.error(error || { code: 'INTERNAL_ERROR' }, message || 'Internal server error', 500)
  }

  static validationError(errors: unknown, message?: string): NextResponse<ApiErrorResponse> {
    return this.error(
      { code: 'VALIDATION_ERROR', details: errors },
      message || 'Validation failed',
      422
    )
  }
}
