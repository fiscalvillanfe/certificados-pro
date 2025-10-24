import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Rotas públicas (libera login, assets, e a rota do NextAuth)
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public');

  if (isPublic) return NextResponse.next();

  // Verifica se está logado
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL('/', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protege tudo de /dashboard pra baixo e APIs próprias (menos /api/auth)
export const config = {
  matcher: ['/dashboard/:path*', '/api/(?!auth/:path*).*'],
};
