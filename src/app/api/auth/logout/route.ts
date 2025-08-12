import { getCurrentUser } from '@/libs/auth'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return

    const cookieStore = await cookies()
    cookieStore.delete('accessToken')
    return ApiResponseHandler.success('با موفقیت خارج شدید')
  } catch (error) {
    ApiResponseHandler.internalError(undefined, error)
  }
}
