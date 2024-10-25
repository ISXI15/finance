import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
  const isFinanzplanerPage = request.nextUrl.pathname === '/finanzplaner' || request.nextUrl.pathname.startsWith('/finanzplaner/')

  if (isFinanzplanerPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/finanzplaner', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/finanzplaner/:path*', '/login', '/register'],
}