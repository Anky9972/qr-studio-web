
export interface ThemeConfig {
    // Basic Colors
    backgroundColor: string;
    primaryColor: string;
    textColor: string;

    // Advanced Background
    backgroundType: 'solid' | 'gradient' | 'image' | 'pattern';
    backgroundGradient: string;
    backgroundImage: string;

    // Shapes & Styles
    buttonStyle: 'rounded' | 'pill' | 'square' | 'soft';
    cardStyle: 'glass' | 'solid' | 'outline' | 'none';

    // Typography
    fontFamily: string;
}

export type ThemePreset = {
    id: string;
    name: string;
    thumbnail: string; // CSS color string or gradient
    category?: 'general' | 'restaurant' | 'corporate' | 'creative' | 'beauty';
    config: ThemeConfig;
};
