import { translatorUpdateSchema } from '@/features/translators/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const translator = await prisma.translator.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        bookLinks: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    if (!translator) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(translator)
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

    const body = await request.json()
    const validationResult = translatorUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }
    const data = validationResult.data

    const updated = await prisma.translator.update({
      where: { id: Number(id) },
      data,
    })

    return ApiResponseHandler.success(updated, 'منرجم با موفقیت بروزرسانی شد')
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

    const translatorId = await prisma.translator.findUnique({
      where: {
        id: Number(id),
      },
      select: { id: true },
    })

    if (!translatorId) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.translator.delete({
      where: { id: Number(translatorId) },
    })
    return ApiResponseHandler.success(deleted, 'مترجم با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
