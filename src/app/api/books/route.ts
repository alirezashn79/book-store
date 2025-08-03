import { bookCreateSchema } from '@/features/products/schema'
import { Prisma } from '@/generated/prisma'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
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

    const where: Prisma.BookWhereInput = {}

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          authors: {
            some: {
              author: {
                OR: [
                  {
                    firstName: { contains: search, mode: 'insensitive' },
                  },
                  {
                    lastName: { contains: search, mode: 'insensitive' },
                  },
                ],
              },
            },
          },
        },
        {
          translators: {
            some: {
              translator: {
                OR: [
                  {
                    firstName: { contains: search, mode: 'insensitive' },
                  },
                  {
                    lastName: { contains: search, mode: 'insensitive' },
                  },
                ],
              },
            },
          },
        },
      ]
    }

    const [data, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          price: true,
          reviews: {
            select: {
              id: true,
              rating: true,
            },
          },
          images: {
            take: 1,
            orderBy: { uploadedAt: 'asc' },
            select: {
              id: true,
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.book.count({ where }),
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
    const authRequest = adminOnly(user)
    if (authRequest) return authRequest

    const body = await request.json()

    const validationResult = bookCreateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const data = validationResult.data
    const pureBookData = omit(data, [
      'categoryIds',
      'authorIds',
      'topicIds',
      'translatorIds',
      'imageIds',
      'publishYear',
    ])

    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.create({
        data: {
          ...pureBookData,
          publishYear: data.publishYear ? new Date(data.publishYear) : null,
          images: data.imageIds ? { connect: data.imageIds.map((id) => ({ id })) } : undefined,
        },
      })
      if (data.categoryIds) {
        await tx.bookCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            categoryId,
            bookId: book.id,
          })),
        })
      }
      if (data.authorIds) {
        await tx.bookAuthor.createMany({
          data: data.authorIds.map((authorId) => ({
            authorId,
            bookId: book.id,
          })),
        })
      }
      if (data.topicIds) {
        await tx.bookTopic.createMany({
          data: data.topicIds.map((topicId) => ({
            topicId,
            bookId: book.id,
          })),
        })
      }
      if (data.translatorIds) {
        await tx.bookTranslator.createMany({
          data: data.translatorIds.map((translatorId) => ({
            translatorId,
            bookId: book.id,
          })),
        })
      }

      return book
    })

    return ApiResponseHandler.success(result, 'کتاب با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
