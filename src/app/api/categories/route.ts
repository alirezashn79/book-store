import { createCategorySchema } from '@/features/categories/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, search } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      searchFields: ['name'],
    }

    const where = PaginationHelper.buildWhereClause(search, undefined, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          children: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'desc' },
      }),
      prisma.category.count({ where }),
    ])

    const meta = PaginationHelper.createMeta(total, page, limit, search)

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
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const body = await request.json()

    const validationResult = createCategorySchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const category = await prisma.category.create({
      data: validationResult.data,
    })

    return ApiResponseHandler.success(category, 'دسته بندی با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
