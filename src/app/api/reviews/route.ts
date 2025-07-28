import { createReviewSchema } from '@/features/reviews/schema'
import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const { page, limit, skip } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const [data, total] = await prisma.$transaction([
      prisma.review.findMany({
        where: {
          userId: user.id,
        },
        skip,
        take: limit,
        select: {
          id: true,
          rating: true,
          book: {
            select: {
              id: true,
              title: true,
            },
          },
          status: true,
          comment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({
        where: {
          userId: user.id,
        },
      }),
    ])

    const meta = PaginationHelper.createMeta(total, page, limit)

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

    const validationResult = createReviewSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const publisher = await prisma.review.create({
      data: {
        ...validationResult.data,
        userId: user.id,
      },
    })

    return ApiResponseHandler.success(publisher, 'دیدگاه با موفقیت ثبت شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
