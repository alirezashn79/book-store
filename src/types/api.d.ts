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

export type TokenPayload = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'role'>
export type Params = { params: Promise<{ id: string }> }
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginationMeta {
  total: number // تعداد کل رکوردها
  page: number // صفحه فعلی
  limit: number // تعداد در هر صفحه
  totalPages: number // مجموع صفحات
  hasNext: boolean // آیا صفحه بعدی وجود دارد؟
  hasPrev: boolean // آیا صفحه قبلی وجود دارد؟
  nextPage: number | null // شماره صفحه بعدی
  prevPage: number | null // شماره صفحه قبلی
  search?: string // کلمه جستجو شده
  filters?: Record<string, string> // فیلترهای اعمال شده
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page: number
  limit: number
  skip: number
  search?: string
  filters?: Record<string, string>
}

export interface SearchConfig {
  searchFields?: string[] // فیلدهایی که در آن‌ها جستجو می‌شود
  filterFields?: string[] // فیلدهای قابل فیلتر
}

// تایپ‌های Prisma Where Clause
export type PrismaStringFilter = {
  contains?: string
  mode?: 'default' | 'insensitive'
  equals?: string
  in?: string[]
  notIn?: string[]
  startsWith?: string
  endsWith?: string
}

export type PrismaNumberFilter = {
  equals?: number
  in?: number[]
  notIn?: number[]
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

export type PrismaBooleanFilter = {
  equals?: boolean
}

export type PrismaWhereClause = {
  OR?: Array<
    Record<
      string,
      PrismaStringFilter | PrismaNumberFilter | PrismaBooleanFilter | string | number | boolean
    >
  >
  AND?: Array<
    Record<
      string,
      PrismaStringFilter | PrismaNumberFilter | PrismaBooleanFilter | string | number | boolean
    >
  >
} & Record<
  string,
  PrismaStringFilter | PrismaNumberFilter | PrismaBooleanFilter | string | number | boolean
>
