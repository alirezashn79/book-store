import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      omit: {
        password: true,
        updatedAt: true,
      },
    })

    if (!currentUser) {
      return ApiResponseHandler.unauthorized()
    }

    return ApiResponseHandler.success(currentUser)
  } catch (error) {
    return ApiResponseHandler.internalError('error', error)
  }
}
