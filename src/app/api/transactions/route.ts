import { transactionCreateSchema } from '@/features/transactions/schema'
import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/paginationHelper'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

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
        where: {
          ...where,
          userId: user.id,
        },
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
        where: {
          ...where,
          userId: user.id,
        },
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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const body = await request.json()

    const validationResult = transactionCreateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const userId = validationResult.data.userId

    if (userId !== user.id) {
      return ApiResponseHandler.forbidden('شما مجاز به ایجاد تراکنش برای این کاربر نیستید')
    }

    const orderId = validationResult.data.orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: user.id },
    })

    if (!order) {
      return ApiResponseHandler.notFound('سفارشی با این شناسه یافت نشد')
    }

    const transaction = await prisma.transaction.create({
      data: validationResult.data,
    })

    return ApiResponseHandler.success(transaction, 'تراکنش با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
