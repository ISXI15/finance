import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/impressum', '/datenschutz']

  // If the path is a public route, allow access
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!token && !path.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated and trying to access login or register, redirect to finanzplaner
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/finanzplaner', request.url))
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}