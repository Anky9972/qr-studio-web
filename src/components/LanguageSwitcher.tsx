/**
 * Custom Language Switcher Component
 * Simplified for dark mode only
 */

'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/lib/useTranslations';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Store locale preference for pages without locale in URL (like /dashboard)
    try {
      localStorage.setItem('qr_studio_locale', newLocale);
    } catch {
      // Ignore storage errors
    }

    // Remove current locale from pathname if present
    const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de|pt)/, '') || '/';

    // Navigate to new locale
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

    // Force immediate navigation with full page reload
    window.location.href = newPath;
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                   bg-white/5 text-white
                   border border-white/10
                   hover:bg-white/10
                   transition-all duration-200
                   min-w-[150px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 
                        bg-gray-800 border border-white/10
                        rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-2 px-3 py-2.5
                         text-white hover:bg-white/10
                         transition-colors duration-150
                         ${language.code === locale ? 'bg-blue-500/20' : ''}`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Language Switcher for Mobile
 */
export function LanguageSwitcherCompact() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Store locale preference for pages without locale in URL (like /dashboard)
    try {
      localStorage.setItem('qr_studio_locale', newLocale);
    } catch {
      // Ignore storage errors
    }

    const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de|pt)/, '') || '/';
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

    // Force immediate navigation with full page reload
    window.location.href = newPath;
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                   bg-white/5 text-white
                   border border-white/10
                   hover:bg-white/10
                   transition-all duration-200
                   justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 
                        bg-gray-800 border border-white/10
                        rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-2 px-3 py-2.5
                         text-white hover:bg-white/10
                         transition-colors duration-150
                         ${language.code === locale ? 'bg-blue-500/20' : ''}`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
