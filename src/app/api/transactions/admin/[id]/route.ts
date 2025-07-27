import { transactionUpdateSchema } from '@/features/transactions/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse
    const { id } = await params

    const body = await request.json()
    const validationResult = transactionUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }
    const data = validationResult.data

    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data,
    })

    return ApiResponseHandler.success(updated, 'تراکنش با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
