import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/paginationHelper'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { page, limit, skip, search, filters } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      searchFields: ['id'],
      filterFields: ['method', 'status'],
    }
    const where = PaginationHelper.buildWhereClause(search, filters, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          transactionDate: true,
          amount: true,
          method: true,
          status: true,
          orderId: true,
        },
        orderBy: { transactionDate: 'desc' },
      }),
      prisma.transaction.count({
        where,
      }),
    ])

    const meta = PaginationHelper.createMeta(total, page, limit, search, filters)

    const response = {
      data,
      meta,
    }

    return ApiResponseHandler.success(response)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
