import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This middleware will handle server-side routing for Next.js
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // For direct access to dashboard routes, we need to ensure the page is rendered
  // and let the client-side authentication handle the redirect
  if (
    path.startsWith('/dashboards') ||
    path === '/' ||
    path === '/overview' ||
    path === '/clients'
  ) {
    // We'll let the page render and client-side auth will handle redirection
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|static|images|icons).*)',
    '/clients'
  ]
};
