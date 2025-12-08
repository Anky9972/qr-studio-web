/**
 * Language Switcher Component
 * Dropdown to switch between supported locales
 * TODO: Re-enable when i18n is properly configured
 */

'use client';

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
import { useLocale } from '@/lib/useTranslations';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
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
        startAdornment={<LanguageIcon sx={{ mr: 1, color: '#9ca3af' }} />}
        sx={{
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '8px 12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiSvgIcon-root': {
            color: '#9ca3af',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#1f2937',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              mt: 1,
              '& .MuiMenuItem-root': {
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  },
                },
              },
            },
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
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setIsChanging(true);
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
        disabled={isChanging}
        sx={{
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '8px 12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiSvgIcon-root': {
            color: '#9ca3af',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#1f2937',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              mt: 1,
              '& .MuiMenuItem-root': {
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  },
                },
              },
            },
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
