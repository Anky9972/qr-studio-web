/**
 * Language Switcher Component
 * Dropdown to switch between supported locales
 * TODO: Re-enable when i18n is properly configured
 */

'use client';

// import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export function LanguageSwitcher() {
  // Temporarily use 'en' as default until i18n is properly configured
  const locale = 'en'; // useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setIsChanging(true);

    // Remove current locale from pathname if present
    const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de|pt)/, '') || '/';

    // Navigate to new locale
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isChanging}
        startAdornment={<LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
              <Typography component="span">{language.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

/**
 * Compact Language Switcher for Mobile
 */
export function LanguageSwitcherCompact() {
  // Temporarily use 'en' as default until i18n is properly configured
  // const locale = useLocale();
  const [locale, setLocale] = useState('en');
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setLocale(newLocale);
    const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de|pt)/, '') || '/';
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <FormControl size="small" fullWidth>
      <Select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
              <Typography component="span">{language.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
