import { createTopicrSchema } from '@/features/topics/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const responseType = Boolean(url.searchParams.get('responseType') || undefined)

    if (responseType) {
      const topicsWithdoutPagination = await prisma.topic.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'desc' },
      })

      return ApiResponseHandler.success(topicsWithdoutPagination)
    }
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
      prisma.topic.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'desc' },
      }),
      prisma.topic.count({ where }),
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

    const validationResult = createTopicrSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const topics = await prisma.topic.create({
      data: validationResult.data,
    })

    return ApiResponseHandler.success(topics, 'موضوع با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
