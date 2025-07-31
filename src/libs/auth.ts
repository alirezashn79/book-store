import { NextRequest, NextResponse } from 'next/server'
import JWT from 'jsonwebtoken'
import { prisma } from './prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { ApiErrorResponse, TokenPayload } from '@/types/api'

const JWT_SECRET = process.env.JWT_SECRET ?? ''

export async function getCurrentUser(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get('accessToken')?.value
  if (!token) {
    return null
  }

  try {
    const payload = JWT.verify(token, JWT_SECRET) as TokenPayload

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (err) {
    console.error('getCurrentUser error:', err)
    return null
  }
}

export function adminOnly(user: TokenPayload | null): NextResponse<ApiErrorResponse> | undefined {
  if (!user) {
    return ApiResponseHandler.unauthorized()
  }
  if (user.role !== 'ADMIN') {
    return ApiResponseHandler.forbidden()
  }
}
