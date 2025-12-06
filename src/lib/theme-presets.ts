
import { ThemePreset } from '@/types/theme';
import { backgroundPatterns, stockImages } from './theme-assets';

export const themePresets: ThemePreset[] = [
    // General Presets
    {
        id: 'midnight',
        name: 'Midnight',
        thumbnail: '#0f172a',
        category: 'general',
        config: {
            backgroundColor: '#0f172a',
            primaryColor: '#3b82f6',
            textColor: '#ffffff',
            backgroundType: 'solid',
            backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            backgroundImage: '',
            buttonStyle: 'rounded',
            cardStyle: 'solid',
            fontFamily: 'Inter, sans-serif',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset',
        thumbnail: 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)',
        category: 'general',
        config: {
            backgroundColor: '#4c1d95',
            primaryColor: '#f9a8d4',
            textColor: '#ffffff',
            backgroundType: 'gradient',
            backgroundGradient: 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)',
            backgroundImage: '',
            buttonStyle: 'pill',
            cardStyle: 'glass',
            fontFamily: 'Inter, sans-serif',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean',
        thumbnail: 'linear-gradient(to bottom right, #0062ff, #00c6ff)',
        category: 'general',
        config: {
            backgroundColor: '#0062ff',
            primaryColor: '#ffffff',
            textColor: '#ffffff',
            backgroundType: 'gradient',
            backgroundGradient: 'linear-gradient(to bottom right, #0062ff, #00c6ff)',
            backgroundImage: '',
            buttonStyle: 'soft',
            cardStyle: 'glass',
            fontFamily: 'Inter, sans-serif',
        },
    },
    {
        id: 'minimal-light',
        name: 'Minimal Light',
        thumbnail: '#ffffff',
        category: 'general',
        config: {
            backgroundColor: '#ffffff',
            primaryColor: '#000000',
            textColor: '#000000',
            backgroundType: 'solid',
            backgroundGradient: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
            backgroundImage: '',
            buttonStyle: 'square',
            cardStyle: 'outline',
            fontFamily: 'Inter, sans-serif',
        },
    },

    // Restaurant Presets
    {
        id: 'savory',
        name: 'Savory',
        thumbnail: '#78350f',
        category: 'restaurant',
        config: {
            backgroundColor: '#78350f',
            primaryColor: '#f59e0b',
            textColor: '#fffbeb',
            backgroundType: 'image',
            backgroundGradient: 'linear-gradient(to bottom, #78350f, #451a03)',
            backgroundImage: stockImages.restaurant[0],
            buttonStyle: 'rounded',
            cardStyle: 'solid',
            fontFamily: 'Playfair Display, serif',
        },
    },
    {
        id: 'bistro',
        name: 'Bistro',
        thumbnail: '#1c1917',
        category: 'restaurant',
        config: {
            backgroundColor: '#1c1917',
            primaryColor: '#e7e5e4',
            textColor: '#fafaf9',
            backgroundType: 'pattern',
            backgroundGradient: '',
            backgroundImage: backgroundPatterns.find(p => p.id === 'noise')?.value || '',
            buttonStyle: 'square',
            cardStyle: 'outline',
            fontFamily: 'Lato, sans-serif',
        },
    },

    // Corporate Presets
    {
        id: 'executive',
        name: 'Executive',
        thumbnail: '#0f172a',
        category: 'corporate',
        config: {
            backgroundColor: '#0f172a',
            primaryColor: '#38bdf8',
            textColor: '#f0f9ff',
            backgroundType: 'pattern',
            backgroundGradient: '',
            backgroundImage: backgroundPatterns.find(p => p.id === 'grid')?.value || '',
            buttonStyle: 'soft',
            cardStyle: 'solid',
            fontFamily: 'Inter, sans-serif',
        },
    },

    // Creative Presets
    {
        id: 'neo',
        name: 'Neo Pop',
        thumbnail: '#facc15',
        category: 'creative',
        config: {
            backgroundColor: '#facc15',
            primaryColor: '#000000',
            textColor: '#000000',
            backgroundType: 'pattern',
            backgroundGradient: '',
            backgroundImage: backgroundPatterns.find(p => p.id === 'dots')?.value || '',
            buttonStyle: 'square',
            cardStyle: 'none',
            fontFamily: 'Poppins, sans-serif',
        },
    },

    // Beauty Presets
    {
        id: 'serenity',
        name: 'Serenity',
        thumbnail: '#fdf2f8',
        category: 'beauty',
        config: {
            backgroundColor: '#fdf2f8',
            primaryColor: '#db2777',
            textColor: '#831843',
            backgroundType: 'image',
            backgroundGradient: '',
            backgroundImage: stockImages.beauty[0],
            buttonStyle: 'pill',
            cardStyle: 'glass',
            fontFamily: 'Montserrat, sans-serif',
        },
    },
];

export const fontOptions = [
    { label: 'Beautique (Default)', value: "'BeautiqueDisplay', sans-serif" },
    { label: 'Inter', value: "'Inter', sans-serif" },
    { label: 'Roboto', value: "'Roboto', sans-serif" },
    { label: 'Playfair Display', value: "'Playfair Display', serif" },
    { label: 'Montserrat', value: "'Montserrat', sans-serif" },
    { label: 'Open Sans', value: "'Open Sans', sans-serif" },
    { label: 'Lato', value: "'Lato', sans-serif" },
    { label: 'Poppins', value: "'Poppins', sans-serif" },
];
