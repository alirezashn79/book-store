import { publisherUpdateSchema } from '@/features/publishers/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const publisher = await prisma.publisher.findUnique({
      where: { id: Number(id) },
      include: {
        books: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!publisher) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(publisher)
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

    const publisher = await prisma.publisher.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!publisher) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = publisherUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const data = validationResult.data
    const updated = await prisma.publisher.update({
      where: { id: publisher.id },
      data,
    })

    return ApiResponseHandler.success(updated, 'ناشر با موفقیت بروزرسانی شد')
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

    const publisher = await prisma.publisher.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!publisher) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.publisher.delete({
      where: { id: publisher.id },
    })

    return ApiResponseHandler.success(deleted, 'ناشر با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
