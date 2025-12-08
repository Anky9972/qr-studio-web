'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Import all translation files
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import frMessages from '../../messages/fr.json';
import deMessages from '../../messages/de.json';
import ptMessages from '../../messages/pt.json';

const messages: Record<string, any> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  pt: ptMessages,
};

// Helper to detect locale from pathname
function getLocaleFromPathname(pathname: string): string {
  const localeMatch = pathname.match(/^\/(en|es|fr|de|pt)(\/|$)/);
  return localeMatch ? localeMatch[1] : 'en';
}

// Helper to get nested translation
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return the key if not found
    }
  }
  
  return value !== undefined ? value : path;
}

/**
 * Custom hook to get translations based on URL locale
 * Usage: const t = useTranslations('common');
 *        t('appName') => returns translated string
 */
export function useTranslations(namespace?: string) {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(getLocaleFromPathname(pathname));
  }, [pathname]);

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const translations = messages[locale] || messages.en;
    return getNestedValue(translations, fullKey);
  };
}

/**
 * Get current locale from pathname
 */
export function useLocale(): string {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(getLocaleFromPathname(pathname));
  }, [pathname]);

  return locale;
}
