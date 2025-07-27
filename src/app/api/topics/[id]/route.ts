import { topicrUpdateSchema } from '@/features/topics/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const topic = await prisma.topic.findUnique({
      where: { id: Number(id) },
      include: {
        bookLinks: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
    })

    if (!topic) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(topic)
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

    const topic = await prisma.topic.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!topic) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = topicrUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const data = validationResult.data
    const updated = await prisma.topic.update({
      where: { id: topic.id },
      data,
    })

    return ApiResponseHandler.success(updated, 'موضوع با موفقیت بروزرسانی شد')
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

    const topic = await prisma.topic.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!topic) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.topic.delete({
      where: { id: topic.id },
    })

    return ApiResponseHandler.success(deleted, 'موضوع با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
