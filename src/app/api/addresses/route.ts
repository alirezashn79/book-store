import { createAddressSchema } from '@/features/addresses/schema'
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

    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        country: true,
        state: true,
        city: true,
        street: true,
        isDefault: true,
      },
      orderBy: { id: 'desc' },
    })

    return ApiResponseHandler.success(addresses)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const body = await request.json()

    const validationResult = createAddressSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    if (validationResult.data.isDefault) {
      await prisma.address.updateMany({
        where: {
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    const address = await prisma.address.create({
      data: {
        ...validationResult.data,
        userId: user.id,
      },
    })

    return ApiResponseHandler.success(address, 'آدرس با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
