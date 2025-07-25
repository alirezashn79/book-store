import { registerSchema } from '@/features/auth/schema/register'
import { hashPass } from '@/libs/bcryptjs'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResullt = registerSchema.safeParse(body)

    if (!validationResullt.success) {
      return ApiResponseHandler.validationError(validationResullt.error._zod.def)
    }

    const { name, email, password } = validationResullt.data

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return ApiResponseHandler.error('کاربر وجود دارد', 409)
    }

    const hashedPassword = await hashPass(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const userWithoutPassword = omit(user, ['password'])

    return ApiResponseHandler.success(userWithoutPassword, 'ثبت نام با موفقیت انحام شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError('error', error)
  }
}
