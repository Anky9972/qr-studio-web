import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const locales = ['en', 'es', 'fr', 'de', 'pt'];

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    // Handle API admin auth
    if (pathname.startsWith('/api/admin')) {
      const token = await getToken({ req: request });
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const isAdmin = token.email === 'admin@qrstudio.com' || token.isAdmin === true;
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }
    }
    
    return NextResponse.next();
  }

  // Handle locale routing - rewrite locale URLs to base path
  const localeMatch = pathname.match(/^\/(en|es|fr|de|pt)(\/.*)?$/);
  if (localeMatch) {
    const locale = localeMatch[1];
    const pathWithoutLocale = localeMatch[2] || '/';
    
    // Rewrite the URL to serve the base path content
    const url = request.nextUrl.clone();
    url.pathname = pathWithoutLocale;
    
    // Store the locale in a header for client-side access
    const response = NextResponse.rewrite(url);
    response.headers.set('x-locale', locale);
    
    // Continue with auth checks on the rewritten path
    const token = await getToken({ req: request });
    
    // Protect dashboard routes
    if (pathWithoutLocale.startsWith('/dashboard')) {
      if (!token) {
        const redirectUrl = new URL('/signin', request.url);
        redirectUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // Check if accessing admin routes
    if (pathWithoutLocale.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }
      
      const isAdmin = token.email === 'admin@qrstudio.com' || token.isAdmin === true;
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Redirect authenticated users away from auth pages
    if (token && (
      pathWithoutLocale.startsWith('/signin') ||
      pathWithoutLocale.startsWith('/signup')
    )) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return response;
  }

  // Check authentication for protected routes
  const token = await getToken({ req: request });
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = new URL('/signin', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    const isAdmin = token.email === 'admin@qrstudio.com' || token.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (token && (
    request.nextUrl.pathname.startsWith('/signin') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
