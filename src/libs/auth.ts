import { TokenPayload } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import JWT from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET ?? ''

export async function getCurrentUser(request: NextRequest): Promise<TokenPayload | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer')) return null

  const token = authHeader.substring(7)

  try {
    const payload = JWT.verify(token, JWT_SECRET) as TokenPayload
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error(error)
    return null
  }
}

export function adminOnly(user: TokenPayload | null) {
  if (!user) {
    return ApiResponseHandler.unauthorized()
  }
  if (user.role !== 'ADMIN') {
    return ApiResponseHandler.forbidden()
  }
}
