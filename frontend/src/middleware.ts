import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: 'candidate' | 'recruiter';
}

const protectedRoutes = [
  '/jobs',
  '/create-job',
  '/manage-jobs',
  '/applications',
  '/scroll-dashboard',
  '/recruiter-dashboard',
  '/recruiter-profile',
  '/recruiter-settings',
  '/shortlisted-candidates',
  '/candidate-dashboard',
  '/candidate-profile',
  '/candidate-settings',
  '/find-candidate',
  '/interviews-schedule',
  '/screening',
  '/scraping',
  '/assistant',
  '/messages',
  '/pricing',
];

const authRoutes = ['/login', '/register', '/forgot-password', '/home'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;

  // Handle landing page (/) for authenticated users
  if (pathname === '/') {
    if (authToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(authToken);
        const dashboardUrl = decodedToken.role === 'recruiter'
          ? '/recruiter-dashboard'
          : '/candidate-dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      } catch (error) {
        // If token is invalid, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!authToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Handle auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (authToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(authToken);
        const dashboardUrl = decodedToken.role === 'recruiter'
          ? '/recruiter-dashboard'
          : '/candidate-dashboard';
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|logos|profile|projects|auth/google|auth/callback).*)',
  ],
};