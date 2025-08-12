import { loginSchema } from '@/app/auth/_schemas/login'
import { comparePass } from '@/libs/bcryptjs'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import JWT from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const { identifier, password } = validationResult.data

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            phone: identifier,
          },
        ],
      },
    })

    if (!user) {
      return ApiResponseHandler.notFound('کاربر یافت نشد')
    }

    const isPasswordMatched = await comparePass(password, user.password)

    if (!isPasswordMatched) {
      return ApiResponseHandler.notFound('کاربر یافت نشد')
    }

    const userWithoutPassword = omit(user, ['password'])

    const token = JWT.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    )

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'accessToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return ApiResponseHandler.success({
      user: userWithoutPassword,
    })
  } catch (error) {
    return ApiResponseHandler.internalError('error', error)
  }
}
