import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transactionId, orderId, status, reference } = await request.json()

    const [updatedTransaction, updatedOrder] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: status === 'success' ? 'COMPLETED' : 'FAILED',
          reference,
          transactionDate: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: status === 'success' ? 'PROCESSING' : 'CANCELLED',
        },
      }),
    ])

    return ApiResponseHandler.success({
      order: updatedOrder,
      transaction: updatedTransaction,
    })
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
