import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(vi|en)/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)']
};