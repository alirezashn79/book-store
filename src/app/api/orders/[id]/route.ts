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

    const orders = await prisma.order.findUnique({
      where: { id: Number(id), userId: user.id },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        address: {
          select: {
            id: true,
            city: true,
            street: true,
            postalCode: true,
            longitude: true,
            latitude: true,
          },
        },
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            totalPrice: true,
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

    if (!orders) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(orders)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
