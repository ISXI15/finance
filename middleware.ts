import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login';
  const isProtectedRoute = request.nextUrl.pathname === '/finanzplaner' || request.nextUrl.pathname.startsWith('/finanzplaner/');

  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected routes
  if (isProtectedRoute && token) {
    try {
      verifyToken(token);
    } catch (error) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to finanzplaner if already logged in and trying to access login page
  if (isAuthPage && token) {
    try {
      verifyToken(token);
      return NextResponse.redirect(new URL('/finanzplaner', request.url));
    } catch (error) {
      // If token is invalid, allow access to login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/finanzplaner',
    '/finanzplaner/:path*',
    '/login',
  ],
};