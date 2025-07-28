import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }
    const { transactionId, orderId, status, reference } = await request.json()

    await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id: Number(transactionId), userId: Number(user.id) },
        data: {
          status: status === 'success' ? 'COMPLETED' : 'FAILED',
          reference,
          transactionDate: new Date(),
        },
      })

      await tx.order.update({
        where: { id: Number(orderId), userId: Number(user.id) },
        data: {
          status: status === 'success' ? 'PROCESSING' : 'CANCELLED',
        },
      })

      const cart = await tx.cart.findUnique({
        where: {
          userId: user.id,
        },
        select: { id: true },
      })

      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      }
    })

    return ApiResponseHandler.success(undefined, 'سفارش با موفقیت تایید شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
