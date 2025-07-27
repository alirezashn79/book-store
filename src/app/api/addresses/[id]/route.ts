import { addressUpdateSchema } from '@/features/addresses/schema'
import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const { id } = await params

    const address = await prisma.address.findUnique({
      where: { id: Number(id), userId: user.id },
    })

    if (!address) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(address)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const { id } = await params

    const address = await prisma.address.findUnique({
      where: { id: Number(id), userId: user.id },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!address) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = addressUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const data = validationResult.data

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    const updated = await prisma.address.update({
      where: { id: address.id, userId: address.userId },
      data: {
        ...data,
        userId: address.userId,
      },
    })

    return ApiResponseHandler.success(updated, 'آدرس با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const { id } = await params

    const address = await prisma.address.findUnique({
      where: { id: Number(id), userId: user.id },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!address) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.address.delete({
      where: { id: address.id, userId: address.userId },
    })

    return ApiResponseHandler.success(deleted, 'آدرس با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
