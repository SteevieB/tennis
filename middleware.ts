import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  try {
    verify(token, process.env.JWT_SECRET!)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
}

export const config = {
  matcher: [
    '/bookings/create/:path*',
    '/admin/:path*',
    '/api/bookings/:path*',
    '/api/settings/:path*',
    '/api/users/:path*'
  ],
}
