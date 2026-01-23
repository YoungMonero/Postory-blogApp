// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define protected routes (SaaS Dashboard)
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Case A: User is NOT logged in but tries to access the Dashboard
  if (isDashboardPage && !token) {
    // Redirect them to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Case B: User IS logged in but tries to go to Login/Register pages
  if (isAuthPage && token) {
    // Send them straight to the dashboard so they don't log in twice
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, let the request proceed normally
  return NextResponse.next();
}

// 3. Configure which paths this middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all sub-routes of dashboard
    '/login',
    '/register'
  ],
};