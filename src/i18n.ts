import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es', 'fr', 'de', 'pt'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always use locale prefix for paths
  localePrefix: 'as-needed'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|es|fr|pt)/:path*']
};
