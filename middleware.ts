// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isDashboardRoot = pathname === '/dashboard';
  const isProtectedDashboardPage = pathname.startsWith('/dashboard/') && pathname !== '/dashboard';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Case A: Allow anyone to see the MAIN dashboard (/dashboard)
  // But redirect them if they try to access sub-pages like /dashboard/settings
  if (isProtectedDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case B: User IS logged in but tries to go to Login/Register pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login',
    '/register'
  ],
};