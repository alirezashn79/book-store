import { registerSchema } from '@/app/(auth)/_schemas/register'
import { hashPass } from '@/libs/bcryptjs'
import { omit } from '@/libs/omit'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import JWT from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResullt = registerSchema.safeParse(body)

    if (!validationResullt.success) {
      return ApiResponseHandler.validationError(validationResullt.error._zod.def)
    }

    const { name, email, password, phone } = validationResullt.data

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return ApiResponseHandler.error('کاربر وجود دارد', 409)
    }

    const hashedPassword = await hashPass(password)

    const usersCount = await prisma.user.count()
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: usersCount === 0 ? 'ADMIN' : 'CUSTOMER',
      },
    })

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

    const userWithoutPassword = omit(user, ['password'])

    return ApiResponseHandler.success(userWithoutPassword, 'ثبت نام با موفقیت انحام شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError('error', error)
  }
}
