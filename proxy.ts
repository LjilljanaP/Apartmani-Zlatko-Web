import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['hr', 'en', 'de', 'pl', 'cs'],
  defaultLocale: 'hr'
});

export const config = {
  matcher: ['/', '/(de|en|hr|pl|cs)/:path*']
};