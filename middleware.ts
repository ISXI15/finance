import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Definieren Sie hier alle geschützten Routen
  const protectedRoutes = ['/finanzplaner', '/finanzplaner/:path*'];

  // Überprüfen Sie, ob die aktuelle Route geschützt ist
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    // Umleitung zur Login-Seite, wenn kein Token vorhanden ist
    return NextResponse.redirect(new URL('/login', request.url));
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