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

    const { page, limit, skip, filters, search } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      searchFields: ['id'],
      filterFields: ['status'],
    }

    const where = PaginationHelper.buildWhereClause(search, filters, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          items: {
            select: {
              book: {
                select: {
                  id: true,
                  title: true,
                },
              },
              quantity: true,
              unitPrice: true,
              totalPrice: true,
            },
          },
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
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
