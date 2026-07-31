import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getNewAccessToken } from './service/refreshToken';
import { jwtUtils } from './utils/jwt';

/**
 * Next.js 16 renamed middleware.ts -> proxy.ts (the exported function must
 * also be named `proxy`, not `middleware`). Functionally it's the same
 * request-interception boundary, just runs on the Node.js runtime instead
 * of Edge by default and the new name is meant to discourage stuffing
 * heavy business logic in here — this file should stay limited to auth
 * gating and redirects, with everything else living in service/ actions.
 */

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/gear'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  const response = NextResponse.next();

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // Access token expired but refresh token is still valid — get a new one.
    const result = await getNewAccessToken(refreshToken as string);

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string);
    }
  }

  let userRole: string | null = null;

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as { role: string }).role;
  }

  // Already logged in and hitting /login or /register -> bounce to the
  // dashboard matching their role.
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === 'CUSTOMER') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (userRole === 'PROVIDER') return NextResponse.redirect(new URL('/provider-dashboard', request.url));
    if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin-dashboard', request.url));
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  // Not logged in and hitting a protected page -> send to login, remember
  // where they were headed.
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control — each dashboard area is locked to its role.
  if (pathname.startsWith('/dashboard') && userRole !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  if (pathname.startsWith('/provider-dashboard') && userRole !== 'PROVIDER') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  if (pathname.startsWith('/admin-dashboard') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)'],
};
