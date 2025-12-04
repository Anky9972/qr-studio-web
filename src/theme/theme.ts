'use client';

import { createTheme, alpha } from '@mui/material/styles';

// Color palette inspired by Material Design 3 with expressive colors
const lightPalette = {
  primary: {
    main: '#6750A4',
    light: '#9A82DB',
    dark: '#4F378B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7D5260',
    light: '#A97C8A',
    dark: '#633B48',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#FF5449',
    dark: '#93000A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF8C00',
    light: '#FFB74D',
    dark: '#C66900',
    contrastText: '#000000',
  },
  info: {
    main: '#006874',
    light: '#4F9BA7',
    dark: '#004F58',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#006E1C',
    light: '#4D9C5E',
    dark: '#005313',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FEF7FF',
    paper: '#FFFFFF',
  },
  surface: {
    main: '#FEF7FF',
    variant: '#E7E0EC',
    container: '#EADDFF',
    containerHigh: '#E8DEF8',
  },
  outline: {
    main: '#79747E',
    variant: '#CAC4D0',
  },
};

const darkPalette = {
  primary: {
    main: '#D0BCFF',
    light: '#E8DEF8',
    dark: '#9A82DB',
    contrastText: '#371E73',
  },
  secondary: {
    main: '#42A5F5',
    light: '#90CAF9',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#EFB8C8',
    light: '#FFD8E4',
    dark: '#BD8A98',
    contrastText: '#492532',
  },
  error: {
    main: '#FFB4AB',
    light: '#FFDAD6',
    dark: '#FF5449',
    contrastText: '#690005',
  },
  warning: {
    main: '#FFB74D',
    light: '#FFCC80',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  info: {
    main: '#4F9BA7',
    light: '#B8EAFF',
    dark: '#006874',
    contrastText: '#003640',
  },
  success: {
    main: '#4D9C5E',
    light: '#B7F1C5',
    dark: '#006E1C',
    contrastText: '#00390A',
  },
  background: {
    default: '#1C1B1F',
    paper: '#1C1B1F',
  },
  surface: {
    main: '#1C1B1F',
    variant: '#49454F',
    container: '#4F378B',
    containerHigh: '#2B2930',
  },
  outline: {
    main: '#938F99',
    variant: '#49454F',
  },
};

// Expressive animation configurations
export const animations = {
  emphasized: {
    duration: '500ms',
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  emphasizedAccelerate: {
    duration: '200ms',
    easing: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  },
  emphasizedDecelerate: {
    duration: '400ms',
    easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
  standard: {
    duration: '300ms',
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  bounce: {
    duration: '600ms',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  smooth: {
    duration: '350ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  
  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    shape: {
      borderRadius: 16,
    },
    shadows: [
      'none',
      mode === 'light'
        ? '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.08)'
        : '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(0, 0, 0, 0.24)',
      mode === 'light'
        ? '0px 2px 6px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.08)'
        : '0px 2px 6px rgba(0, 0, 0, 0.3), 0px 2px 4px rgba(0, 0, 0, 0.24)',
      mode === 'light'
        ? '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.08)'
        : '0px 4px 12px rgba(0, 0, 0, 0.3), 0px 2px 6px rgba(0, 0, 0, 0.24)',
      mode === 'light'
        ? '0px 8px 24px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)'
        : '0px 8px 24px rgba(0, 0, 0, 0.35), 0px 4px 12px rgba(0, 0, 0, 0.3)',
      mode === 'light'
        ? '0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px rgba(0, 0, 0, 0.1)'
        : '0px 12px 32px rgba(0, 0, 0, 0.4), 0px 8px 16px rgba(0, 0, 0, 0.35)',
      ...Array(19).fill('none'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? alpha('#000', 0.2) : alpha('#fff', 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            padding: '10px 24px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            boxShadow: 'none',
            transition: `all ${animations.emphasized.duration} ${animations.emphasized.easing}`,
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0px 4px 12px rgba(0, 0, 0, 0.15)' 
                : '0px 4px 12px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0px 6px 16px rgba(0, 0, 0, 0.2)' 
                : '0px 6px 16px rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            transition: `all ${animations.emphasized.duration} ${animations.emphasized.easing}`,
            border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'light' 
                ? '0px 12px 32px rgba(0, 0, 0, 0.12)' 
                : '0px 12px 32px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: `all ${animations.standard.duration} ${animations.standard.easing}`,
          },
          rounded: {
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: mode === 'light' 
              ? '0px 2px 8px rgba(0, 0, 0, 0.08)' 
              : '0px 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            borderRight: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
            background: mode === 'light' ? palette.background.paper : palette.surface.main,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            backgroundColor: mode === 'light' 
              ? alpha(palette.background.paper, 0.8) 
              : alpha(palette.surface.main, 0.8),
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '2px 0',
            transition: `all ${animations.smooth.duration} ${animations.smooth.easing}`,
            '&.Mui-selected': {
              backgroundColor: mode === 'light' ? palette.primary.main : palette.primary.dark,
              color: palette.primary.contrastText,
              '&:hover': {
                backgroundColor: mode === 'light' ? palette.primary.dark : palette.primary.main,
              },
              '& .MuiListItemIcon-root': {
                color: palette.primary.contrastText,
              },
            },
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? alpha(palette.primary.main, 0.08) 
                : alpha(palette.primary.main, 0.12),
              transform: 'translateX(4px)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            transition: `all ${animations.smooth.duration} ${animations.smooth.easing}`,
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: `all ${animations.smooth.duration} ${animations.smooth.easing}`,
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
              },
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0px 4px 12px rgba(0, 0, 0, 0.15)' 
              : '0px 4px 12px rgba(0, 0, 0, 0.4)',
            transition: `all ${animations.bounce.duration} ${animations.bounce.easing}`,
            '&:hover': {
              transform: 'scale(1.1) translateY(-4px)',
              boxShadow: mode === 'light' 
                ? '0px 8px 24px rgba(0, 0, 0, 0.2)' 
                : '0px 8px 24px rgba(0, 0, 0, 0.5)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            transition: `all ${animations.smooth.duration} ${animations.smooth.easing}`,
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: `all ${animations.smooth.duration} ${animations.smooth.easing}`,
            '&:hover': {
              transform: 'rotate(15deg) scale(1.1)',
              backgroundColor: mode === 'light' 
                ? alpha(palette.primary.main, 0.08) 
                : alpha(palette.primary.main, 0.12),
            },
            '&:active': {
              transform: 'rotate(0deg) scale(0.95)',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.875rem',
            padding: '8px 12px',
            backgroundColor: mode === 'light' ? '#1C1B1F' : '#E8DEF8',
            color: mode === 'light' ? '#FFFFFF' : '#1C1B1F',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 52,
            height: 32,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: 4,
              transitionDuration: '300ms',
              '&.Mui-checked': {
                transform: 'translateX(20px)',
                '& + .MuiSwitch-track': {
                  backgroundColor: palette.primary.main,
                  opacity: 1,
                  border: 0,
                },
              },
            },
            '& .MuiSwitch-thumb': {
              width: 24,
              height: 24,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            '& .MuiSwitch-track': {
              borderRadius: 16,
              backgroundColor: mode === 'light' ? '#E9E9EA' : '#39393D',
              opacity: 1,
              transition: animations.smooth.duration,
            },
          },
        },
      },
    },
  });
};
