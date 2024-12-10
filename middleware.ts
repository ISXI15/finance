import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow access to the homepage, login, and register pages
  if (path === '/' || path === '/login' || path === '/register') {
    return NextResponse.next()
  }

  // Redirect all other paths to the login page
  if (!path.includes('/_next') && !path.includes('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}