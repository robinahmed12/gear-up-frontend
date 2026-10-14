import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getNewAccessToken } from './service/refreshToken';
import { jwtUtils } from './utils/jwt';


const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/gear'];

// The backend signs access tokens with this single secret. The refresh token is
// an opaque, server-validated token (not a JWT), so it is verified by the
// backend on exchange, not here.
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function proxy(request: NextRequest) {

  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get('accessToken')?.value;

  const refreshToken = request.cookies.get('refreshToken')?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, JWT_SECRET)
    : null;

  const response = NextResponse.next();

  if (!decodedAccessToken?.success && refreshToken) {
    // Access token expired/missing but a refresh token exists — exchange it for
    // a new pair. The refresh token is opaque, so the backend validates it.
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
      // Refresh failed — clear the stale pair so the user is properly logged out.
      response.cookies.set('accessToken', '', { maxAge: 0 });
      response.cookies.set('refreshToken', '', { maxAge: 0 });
      accessToken = undefined;
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
