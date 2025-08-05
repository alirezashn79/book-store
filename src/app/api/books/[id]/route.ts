import { bookUpdateSchema } from '@/features/products/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        translators: {
          select: {
            translator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            fileName: true,
          },
        },
      },
    })

    if (!book) {
      return ApiResponseHandler.notFound()
    }

    const authors = book.authors.map((rel) => rel.author)
    const translators = book.translators.map((rel) => rel.translator)
    const response = {
      ...book,
      authors,
      translators,
    }

    return ApiResponseHandler.success(response)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { id } = await params

    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!book) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = bookUpdateSchema.safeParse(body)

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
    ])

    const result = await prisma.$transaction(async (tx) => {
      await tx.media.updateMany({
        where: { bookId: book.id },
        data: { bookId: null },
      })

      await tx.media.updateMany({
        where: { id: { in: data.imageIds ?? [] } },
        data: { bookId: book.id },
      })

      const updatedBook = await tx.book.update({
        where: { id: book.id },
        data: pureBookData,
      })

      if (data.categoryIds) {
        await tx.bookCategory.deleteMany({
          where: { bookId: book.id },
        })
        await tx.bookCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            bookId: book.id,
            categoryId,
          })),
        })
      }
      if (data.authorIds) {
        await tx.bookAuthor.deleteMany({
          where: { bookId: book.id },
        })
        await tx.bookAuthor.createMany({
          data: data.authorIds.map((authorId) => ({
            bookId: book.id,
            authorId,
          })),
        })
      }
      if (data.topicIds) {
        await tx.bookTopic.deleteMany({
          where: { bookId: book.id },
        })
        await tx.bookTopic.createMany({
          data: data.topicIds.map((topicId) => ({
            bookId: book.id,
            topicId,
          })),
        })
      }
      if (data.translatorIds) {
        await tx.bookTranslator.deleteMany({
          where: { bookId: book.id },
        })
        await tx.bookTranslator.createMany({
          data: data.translatorIds.map((translatorId) => ({
            bookId: book.id,
            translatorId,
          })),
        })
      }

      return updatedBook
    })

    return ApiResponseHandler.success(result, 'کتاب با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { id } = await params
    const bookId = Number(id)
    const existing = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    })
    if (!existing) {
      return ApiResponseHandler.notFound()
    }

    await prisma.$transaction(async (tx) => {
      await tx.bookCategory.deleteMany({
        where: { bookId },
      })

      await tx.bookAuthor.deleteMany({
        where: { bookId },
      })

      await tx.bookTopic.deleteMany({
        where: { bookId },
      })

      await tx.bookTranslator.deleteMany({
        where: { bookId },
      })

      await tx.orderItem.deleteMany({
        where: { bookId: bookId },
      })

      await tx.cartItem.deleteMany({
        where: { bookId: bookId },
      })

      await tx.review.deleteMany({
        where: { bookId: bookId },
      })

      await tx.book.update({
        where: { id: bookId },
        data: {
          images: {
            set: [],
          },
        },
      })

      await tx.book.delete({
        where: { id: bookId },
      })
    })

    return ApiResponseHandler.success(null, 'کتاب با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
