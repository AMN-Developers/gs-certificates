import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const isPublic = currentPath === '/';
  const token = req.cookies.get('token')?.value || '';

  if (isPublic && token.length > 0) {
    return NextResponse.redirect(new URL('/certificados', req.nextUrl));
  }

  if (!isPublic && !(token.length > 0)) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
}

export const config = {
  matcher: ['/', '/certificados', '/certificados/novo'],
};
