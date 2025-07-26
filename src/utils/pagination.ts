import { PaginationMeta, PaginationParams, SearchConfig } from '@/types/api'

export class PaginationHelper {
  /**
   * استخراج پارامترهای pagination، search و filter از URL
   */
  static extractParams(request: Request): PaginationParams {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || 1))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 10))) // حداکثر 100
    const skip = (page - 1) * limit

    // استخراج search parameter
    const search = url.searchParams.get('search')?.trim() || undefined

    // استخراج filter parameters
    const filters: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      // فیلترها را از پارامترهای اصلی pagination جدا می‌کنیم
      if (!['page', 'limit', 'search'].includes(key) && value.trim()) {
        filters[key] = value.trim()
      }
    })

    return { page, limit, skip, search, filters }
  }

  /**
   * ساخت metadata کامل برای pagination
   */
  static createMeta(
    total: number,
    page: number,
    limit: number,
    search?: string,
    filters?: Record<string, string>
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    const nextPage = hasNext ? page + 1 : null
    const prevPage = hasPrev ? page - 1 : null

    return {
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
      nextPage,
      prevPage,
      ...(search && { search }),
      ...(filters && Object.keys(filters).length > 0 && { filters }),
    }
  }

  /**
   * اعتبارسنجی پارامترهای pagination
   */
  static validateParams(page: number, limit: number): string | null {
    if (page < 1) return 'صفحه باید بزرگتر از 0 باشد'
    if (limit < 1) return 'حد باید بزرگتر از 0 باشد'
    if (limit > 100) return 'حداکثر 100 آیتم در هر صفحه مجاز است'
    return null
  }

  /**
   * ساخت where clause برای Prisma با قابلیت search و filter
   */
  static buildWhereClause(
    search?: string,
    filters?: Record<string, string>,
    searchConfig?: SearchConfig
  ): Record<string, unknown> | undefined {
    const where: Record<string, unknown> = {}

    // اضافه کردن search
    if (search && searchConfig?.searchFields?.length) {
      const searchConditions: Record<string, unknown>[] = []

      searchConfig.searchFields.forEach((field) => {
        // بررسی اینکه آیا فیلد عددی است یا نه
        if (field === 'id' && !isNaN(Number(search))) {
          // برای فیلد id، اگر search عدد باشد، exact match انجام می‌دهیم
          searchConditions.push({
            [field]: Number(search),
          })
        } else if (field !== 'id') {
          // برای فیلدهای string، contains استفاده می‌کنیم
          searchConditions.push({
            [field]: {
              contains: search,
              mode: 'insensitive',
            },
          })
        }
      })

      if (searchConditions.length > 0) {
        where.OR = searchConditions
      }
    }

    // اضافه کردن filters
    if (filters && searchConfig?.filterFields?.length) {
      Object.entries(filters).forEach(([key, value]) => {
        if (searchConfig.filterFields?.includes(key)) {
          // برای فیلدهای عددی
          if (!isNaN(Number(value))) {
            where[key] = Number(value)
          }
          // برای فیلدهای boolean
          else if (value === 'true' || value === 'false') {
            where[key] = value === 'true'
          }
          // برای فیلدهای string (exact match)
          else {
            where[key] = value
          }
        }
      })
    }

    return Object.keys(where).length > 0 ? where : undefined
  }
}
