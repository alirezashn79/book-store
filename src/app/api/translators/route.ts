import { createTranslatorSchema } from '@/features/translators/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/paginationHelper'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const responseType = Boolean(url.searchParams.get('responseType') || undefined)

    if (responseType) {
      const translatorsWithoutPagination = await prisma.translator.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'desc' },
      })

      const res = translatorsWithoutPagination.map((item) => ({
        id: item.id,
        name: item.name,
      }))

      return ApiResponseHandler.success(res)
    }
    const { page, limit, skip, search, filters } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      searchFields: ['name'],
    }
    const where = PaginationHelper.buildWhereClause(search, filters, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.translator.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'desc' },
      }),
      prisma.translator.count({ where }),
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
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const body = await request.json()

    const validationResult = createTranslatorSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const translator = await prisma.translator.create({
      data: validationResult.data,
    })

    return ApiResponseHandler.success(translator, 'مترجم با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
