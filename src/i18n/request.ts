import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
const locales = ['en', 'es', 'fr', 'de', 'pt'];
 
export default getRequestConfig(async ({requestLocale}) => {
  // next-intl v4: requestLocale is a Promise<string | undefined>
  let locale = await requestLocale;

  // Validate the locale; fall back to 'en' if missing or unrecognised
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    // Messages are at <root>/messages/, two levels up from src/i18n/
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
