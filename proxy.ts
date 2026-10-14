import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getNewAccessToken } from './service/refreshToken';
import { jwtUtils } from './utils/jwt';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/gear', '/forgot-password', '/reset-password'];

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pendingVerification = request.cookies.get('emailPendingVerification')?.value === '1';

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, JWT_SECRET)
    : null;

  const response = NextResponse.next();

  if (!decodedAccessToken?.success && refreshToken) {
    const result = await getNewAccessToken(refreshToken);
    if (result.success) {
      response.cookies.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      });
      response.cookies.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
      accessToken = result.data.accessToken;
      decodedAccessToken = jwtUtils.verifyToken(accessToken, JWT_SECRET);
    } else {
      response.cookies.set('accessToken', '', { maxAge: 0 });
      response.cookies.set('refreshToken', '', { maxAge: 0 });
      accessToken = undefined;
    }
  }

  let userRole: string | null = null;
  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as { role: string }).role;
  }

  // Accounts created but not yet verified must complete verification before
  // accessing anything beyond the public pages.
  if (pendingVerification) {
    const allowedWhilePending =
      pathname === '/verify-email' ||
      pathname === '/' ||
      pathname === '/gear' ||
      pathname.startsWith('/gear/') ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password';
    if (!allowedWhilePending) {
      return NextResponse.redirect(new URL('/verify-email?pending=1', request.url));
    }
    // Do not auto-bounce a pending account from auth routes to a dashboard.
  } else {
    if (accessToken && AUTH_ROUTES.includes(pathname)) {
      if (userRole === 'CUSTOMER') return NextResponse.redirect(new URL('/dashboard', request.url));
      if (userRole === 'PROVIDER') return NextResponse.redirect(new URL('/provider-dashboard', request.url));
      if (userRole === 'ADMIN') return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isVerifyRoute = pathname === '/verify-email';

  if (!accessToken && !isPublicRoute && !isAuthRoute && !isVerifyRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

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