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

const LOCALE_STORAGE_KEY = 'qr_studio_locale';
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt'];

// Helper to get stored locale from localStorage
function getStoredLocale(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && SUPPORTED_LOCALES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

// Helper to store locale in localStorage
function storeLocale(locale: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage errors
  }
}

// Helper to detect locale from pathname
function getLocaleFromPathname(pathname: string): string | null {
  const localeMatch = pathname.match(/^\/(en|es|fr|de|pt)(\/|$)/);
  return localeMatch ? localeMatch[1] : null;
}

// Get the effective locale: URL path > localStorage > default 'en'
function getEffectiveLocale(pathname: string): string {
  // First, try to get from URL path
  const pathLocale = getLocaleFromPathname(pathname);
  if (pathLocale) {
    // Store in localStorage for use on pages without locale in path
    storeLocale(pathLocale);
    return pathLocale;
  }

  // Fall back to stored locale (e.g., for /dashboard pages)
  const storedLocale = getStoredLocale();
  if (storedLocale) {
    return storedLocale;
  }

  // Default to English
  return 'en';
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
 * Custom hook to get translations based on URL locale or stored preference
 * Usage: const t = useTranslations('common');
 *        t('appName') => returns translated string
 * 
 * The locale is determined by:
 * 1. URL path prefix (e.g., /es/features -> 'es')
 * 2. Stored locale in localStorage (for pages like /dashboard without locale prefix)
 * 3. Default 'en'
 */
export function useTranslations(namespace?: string) {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(getEffectiveLocale(pathname));
  }, [pathname]);

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const translations = messages[locale] || messages.en;
    return getNestedValue(translations, fullKey);
  };
}

/**
 * Get current locale from pathname or stored preference
 */
export function useLocale(): string {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(getEffectiveLocale(pathname));
  }, [pathname]);

  return locale;
}
