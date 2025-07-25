export interface ApiSuccessResponse<T = unknown> {
  success: true
  message?: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  message?: string
  error: unknown
}
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
