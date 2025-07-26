import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const media = await prisma.media.findUnique({
      where: {
        id,
      },
    })

    if (!media) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(media)
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

    const media = await prisma.media.findUnique({
      where: {
        id,
      },
    })

    if (!media) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.media.delete({
      where: {
        id: media.id,
      },
    })

    return ApiResponseHandler.success(deleted, 'فایل با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
