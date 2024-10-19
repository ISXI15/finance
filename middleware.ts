import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';

  if (!token && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/financial-planner'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      verifyToken(token);
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/finazplaner', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/finanzplaner/:path*', '/login'],
};