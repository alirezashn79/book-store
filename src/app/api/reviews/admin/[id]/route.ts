import { reviewUpdateSchema } from '@/features/reviews/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { id } = await params

    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        bookId: true,
      },
    })

    if (!review) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = reviewUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data: {
        ...validationResult.data,
        id: review.id,
        bookId: review.bookId,
      },
    })

    return ApiResponseHandler.success(updated, 'دیدگاه با موفقیت بروزرسانی شد')
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

    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!review) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.review.delete({
      where: { id: review.id },
    })

    return ApiResponseHandler.success(deleted, 'دیدگاه با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
