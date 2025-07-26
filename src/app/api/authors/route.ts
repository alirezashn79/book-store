import { createAuthorSchema } from '@/features/authors/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, search, filters } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      searchFields: ['firstName', 'lastName'],
    }

    const where = PaginationHelper.buildWhereClause(search, filters, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.author.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photo: {
            select: {
              id: true,
              url: true,
            },
          },
        },
        orderBy: { lastName: 'desc' },
      }),
      prisma.author.count({ where }),
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

    const validationResult = createAuthorSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }
    const data = validationResult.data
    const author = await prisma.author.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        biography: data.biography,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        deathDate: data.deathDate ? new Date(data.deathDate) : null,
        // photo: data.photoId ? { connect: { id: data.photoId } } : undefined,
        photoId: data.photoId ?? undefined,
      },
    })

    return ApiResponseHandler.success(author, 'نویسنده با موفقیت ساخته شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError('Internal Server Error', error)
  }
}
