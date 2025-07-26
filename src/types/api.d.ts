import { User } from '@/generated/prisma'

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

// id: user.id,
//   name: user.name,
//   email: user.email,
//   phone: user.phone,
//   role: user.role,
export type TokenPayload = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'role'>
export type Params = { params: Promise<{ id: string }> }
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
