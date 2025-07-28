import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
      select: { id: true },
    })

    if (!book) {
      return ApiResponseHandler.notFound()
    }

    const bookReviews = await prisma.review.findMany({
      where: {
        bookId: book.id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        rating: true,
        comment: true,
        status: true,
        createdAt: true,
      },
    })

    if (!bookReviews) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(bookReviews)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
