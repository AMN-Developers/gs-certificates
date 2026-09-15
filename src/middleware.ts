import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const clientToken = req.cookies.get('token')?.value || '';
  const adminSession = req.cookies.get('admin_session')?.value || '';

  if (currentPath === '/' && clientToken) {
    return NextResponse.redirect(new URL('/certificados', req.nextUrl));
  }

  if (currentPath.startsWith('/certificados') && !clientToken) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (currentPath.startsWith('/dashboard') && !adminSession)
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
}

export const config = {
  matcher: ['/', '/certificados/:path*', '/dashboard/:path*'],
};
