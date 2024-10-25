import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';

  if (!token && request.nextUrl.pathname.startsWith('/finanzplaner')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      verifyToken(token);
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/finanzplaner', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/finanzplaner', '/finanzplaner/:path*', '/login'],
};