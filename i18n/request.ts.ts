import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Pričekaj da se locale razriješi
  const locale = await requestLocale;

  // 2. Provjeri je li locale uopće stigao (fallback na 'hr')
  const safeLocale = locale || 'hr';

  return {
    // 3. MORAŠ vratiti i locale i messages
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  };
});