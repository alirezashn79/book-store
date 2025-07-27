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

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(id),
        userId: user.id,
      },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
          },
        },
      },
    })

    if (!transaction) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(transaction)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
