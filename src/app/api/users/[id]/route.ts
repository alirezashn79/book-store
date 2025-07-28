import { updateUserSchema } from '@/features/users/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)

    if (authResponse) return authResponse

    const { id } = await params

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      omit: { password: true },
      include: {
        orders: {
          include: {
            items: {
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
        },
        reviews: {
          select: {
            id: true,
            book: {
              select: {
                id: true,
                title: true,
              },
            },
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    return ApiResponseHandler.success(userDB)
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

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    const body = await request.json()

    const validationResult = updateUserSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error)
    }

    const updated = await prisma.user.update({
      where: { id: userDB.id },
      data: validationResult.data,
    })

    return ApiResponseHandler.success(updated, 'کاربر با موفقیت بروزرسانی شد')
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

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId: userDB.id } })
      await tx.review.deleteMany({ where: { userId: userDB.id } })
      await tx.transaction.deleteMany({ where: { userId: userDB.id } })
      await tx.cart.deleteMany({ where: { userId: userDB.id } })
      await tx.address.deleteMany({ where: { userId: userDB.id } })
      await tx.user.delete({ where: { id: userDB.id } })
    })

    return ApiResponseHandler.success(undefined, 'کاربر با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
