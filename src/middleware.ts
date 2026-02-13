import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas protegidas que precisam de autenticação
  // IMPORTANTE: /planos-femininos e /planos-masculinos NÃO exigem login
  // O login só é obrigatório APÓS a página /obrigado (quando o usuário acessa /app, /chat, etc)
  const protectedRoutes = ['/app', '/admin', '/chat', '/analysis'];

  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Se é uma rota protegida e não está logado, redireciona para login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se está logado e tentando acessar login, redireciona para app
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/chat/:path*',
    '/analysis/:path*',
    '/login',
  ],
};
