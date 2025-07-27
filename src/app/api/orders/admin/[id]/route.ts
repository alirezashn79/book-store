import { orderUpdateSchema } from '@/features/orders/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResult = adminOnly(user)

    if (authResult) return authResult

    const { id } = await params

    const orders = await prisma.order.findUnique({
      where: { id: Number(id) },
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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!order) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = orderUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    let data = validationResult.data

    if (data?.addressId) {
      const isAddressExist = await prisma.address.findUnique({
        where: {
          id: data.addressId,
          userId: order.userId,
        },
        select: { id: true },
      })
      if (!isAddressExist) {
        data = omit(data, ['addressId'])
      }
    }

    const updated = await prisma.order.update({
      where: { id: order.id, userId: order.userId },
      data: {
        ...data,
        userId: order.userId,
      },
    })

    return ApiResponseHandler.success(updated, 'سفارش با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
