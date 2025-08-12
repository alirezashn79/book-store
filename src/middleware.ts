import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from './utils/VerifyJWT'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const cookie = request.cookies.get('accessToken')
  let isVerifiedToken = null
  if (cookie) {
    isVerifiedToken = await verifyJWT(cookie.value, process.env.JWT_SECRET!)
  }

  if (pathname.startsWith('/auth')) {
    if (isVerifiedToken) return NextResponse.redirect(new URL('/', request.url))
  } else {
    if (!isVerifiedToken) return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon\.ico).*)',
}
