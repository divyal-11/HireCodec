// apps/web/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes — always allowed
  const publicRoutes = ['/', '/register', '/api/auth'];
  const isPublic = publicRoutes.includes(pathname) || pathname.startsWith('/api/auth');
  if (isPublic) return NextResponse.next();

  // Room route — allow with invite token in query (candidates may not have accounts)
  if (pathname.startsWith('/room/')) {
    const inviteToken = req.nextUrl.searchParams.get('token');
    if (inviteToken || req.auth) return NextResponse.next();
    const loginUrl = new URL('/', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // All other routes require auth
  if (!req.auth) {
    const loginUrl = new URL('/', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
