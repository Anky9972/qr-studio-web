// QR Code Design Templates with Advanced Patterns and Gradients

export interface QRTemplate {
  id: string;
  name: string;
  category: 'minimal' | 'gradient' | 'pattern' | 'animated' | 'premium';
  foreground: string;
  background: string;
  pattern: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  gradient?: {
    type: 'linear' | 'radial';
    colorStops: Array<{ offset: number; color: string }>;
    rotation?: number;
  };
  cornerSquareOptions?: {
    type: 'square' | 'dot' | 'extra-rounded';
    color?: string;
    gradient?: any;
  };
  cornerDotOptions?: {
    type: 'square' | 'dot';
    color?: string;
    gradient?: any;
  };
  dotsOptions?: {
    type: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    color?: string;
    gradient?: any;
  };
  animated?: boolean;
  premium?: boolean;
}

export const QR_TEMPLATES: QRTemplate[] = [
  // ===== MINIMAL TEMPLATES =====
  {
    id: 'classic-black',
    name: 'Classic Black',
    category: 'minimal',
    foreground: '#000000',
    background: '#FFFFFF',
    pattern: 'square',
  },
  {
    id: 'minimal-dots',
    name: 'Minimal Dots',
    category: 'minimal',
    foreground: '#1a1a1a',
    background: '#FFFFFF',
    pattern: 'dots',
    dotsOptions: {
      type: 'dots',
      color: '#1a1a1a',
    },
  },
  {
    id: 'rounded-minimal',
    name: 'Rounded Minimal',
    category: 'minimal',
    foreground: '#2c3e50',
    background: '#FFFFFF',
    pattern: 'rounded',
    cornerSquareOptions: {
      type: 'extra-rounded',
      color: '#2c3e50',
    },
  },
  {
    id: 'classy-dots',
    name: 'Classy Dots',
    category: 'minimal',
    foreground: '#34495e',
    background: '#ecf0f1',
    pattern: 'classy',
    dotsOptions: {
      type: 'classy-rounded',
      color: '#34495e',
    },
  },

  // ===== GRADIENT TEMPLATES =====
  {
    id: 'blue-ocean',
    name: 'Blue Ocean',
    category: 'gradient',
    foreground: '#1976D2',
    background: '#E3F2FD',
    pattern: 'rounded',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#1976D2' },
        { offset: 0.5, color: '#2196F3' },
        { offset: 1, color: '#42A5F5' },
      ],
      rotation: 45,
    },
    dotsOptions: {
      type: 'rounded',
      gradient: {
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#1976D2' },
          { offset: 1, color: '#42A5F5' },
        ],
        rotation: 45,
      },
    },
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'gradient',
    foreground: '#FF6B6B',
    background: '#FFF5F5',
    pattern: 'extra-rounded',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#FF6B6B' },
        { offset: 0.5, color: '#FF8E53' },
        { offset: 1, color: '#FFA726' },
      ],
      rotation: 135,
    },
    dotsOptions: {
      type: 'extra-rounded',
      gradient: {
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#FF6B6B' },
          { offset: 1, color: '#FFA726' },
        ],
        rotation: 135,
      },
    },
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    category: 'gradient',
    foreground: '#7C4DFF',
    background: '#F3E5F5',
    pattern: 'dots',
    gradient: {
      type: 'radial',
      colorStops: [
        { offset: 0, color: '#7C4DFF' },
        { offset: 0.5, color: '#9C27B0' },
        { offset: 1, color: '#BA68C8' },
      ],
    },
    dotsOptions: {
      type: 'dots',
      gradient: {
        type: 'radial',
        colorStops: [
          { offset: 0, color: '#7C4DFF' },
          { offset: 1, color: '#BA68C8' },
        ],
      },
    },
  },
  {
    id: 'emerald-dream',
    name: 'Emerald Dream',
    category: 'gradient',
    foreground: '#00897B',
    background: '#E0F2F1',
    pattern: 'classy-rounded',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#00897B' },
        { offset: 0.5, color: '#26A69A' },
        { offset: 1, color: '#4DB6AC' },
      ],
      rotation: 90,
    },
    dotsOptions: {
      type: 'classy-rounded',
      gradient: {
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#00897B' },
          { offset: 1, color: '#4DB6AC' },
        ],
        rotation: 90,
      },
    },
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    category: 'gradient',
    foreground: '#00BCD4',
    background: '#1a1a2e',
    pattern: 'dots',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#00BCD4' },
        { offset: 0.5, color: '#00E5FF' },
        { offset: 1, color: '#18FFFF' },
      ],
      rotation: 45,
    },
    dotsOptions: {
      type: 'dots',
      gradient: {
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#00BCD4' },
          { offset: 1, color: '#18FFFF' },
        ],
        rotation: 45,
      },
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'gradient',
    foreground: '#F57C00',
    background: '#FFF3E0',
    pattern: 'extra-rounded',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#F57C00' },
        { offset: 0.5, color: '#FFB300' },
        { offset: 1, color: '#FFD54F' },
      ],
      rotation: 120,
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    category: 'gradient',
    foreground: '#1565C0',
    background: '#E8EAF6',
    pattern: 'rounded',
    gradient: {
      type: 'radial',
      colorStops: [
        { offset: 0, color: '#1565C0' },
        { offset: 0.5, color: '#1976D2' },
        { offset: 1, color: '#42A5F5' },
      ],
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'gradient',
    foreground: '#D81B60',
    background: '#FCE4EC',
    pattern: 'classy',
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#D81B60' },
        { offset: 0.5, color: '#EC407A' },
        { offset: 1, color: '#F48FB1' },
      ],
      rotation: 180,
    },
  },

  // ===== PATTERN TEMPLATES =====
  {
    id: 'dot-matrix',
    name: 'Dot Matrix',
    category: 'pattern',
    foreground: '#E91E63',
    background: '#FFFFFF',
    pattern: 'dots',
    dotsOptions: {
      type: 'dots',
      color: '#E91E63',
    },
    cornerSquareOptions: {
      type: 'dot',
      color: '#C2185B',
    },
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    category: 'pattern',
    foreground: '#00BCD4',
    background: '#E0F7FA',
    pattern: 'extra-rounded',
    dotsOptions: {
      type: 'extra-rounded',
      color: '#00BCD4',
    },
    cornerSquareOptions: {
      type: 'extra-rounded',
      color: '#0097A7',
    },
  },
  {
    id: 'diamond-grid',
    name: 'Diamond Grid',
    category: 'pattern',
    foreground: '#673AB7',
    background: '#EDE7F6',
    pattern: 'classy',
    dotsOptions: {
      type: 'classy',
      color: '#673AB7',
    },
    cornerSquareOptions: {
      type: 'extra-rounded',
      color: '#512DA8',
    },
  },
  {
    id: 'retro-dots',
    name: 'Retro Dots',
    category: 'pattern',
    foreground: '#FF5722',
    background: '#FBE9E7',
    pattern: 'dots',
    dotsOptions: {
      type: 'dots',
      color: '#FF5722',
    },
    cornerSquareOptions: {
      type: 'dot',
      color: '#D84315',
    },
    cornerDotOptions: {
      type: 'dot',
      color: '#FF5722',
    },
  },
  {
    id: 'smooth-operator',
    name: 'Smooth Operator',
    category: 'pattern',
    foreground: '#4CAF50',
    background: '#F1F8E9',
    pattern: 'extra-rounded',
    dotsOptions: {
      type: 'extra-rounded',
      color: '#4CAF50',
    },
    cornerSquareOptions: {
      type: 'extra-rounded',
      color: '#388E3C',
    },
  },

  // ===== ANIMATED TEMPLATES =====
  {
    id: 'pulse-blue',
    name: 'Pulse Blue',
    category: 'animated',
    foreground: '#2196F3',
    background: '#E3F2FD',
    pattern: 'dots',
    animated: true,
    dotsOptions: {
      type: 'dots',
      color: '#2196F3',
    },
  },
  {
    id: 'gradient-wave',
    name: 'Gradient Wave',
    category: 'animated',
    foreground: '#00BCD4',
    background: '#E0F7FA',
    pattern: 'rounded',
    animated: true,
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#00BCD4' },
        { offset: 0.5, color: '#26C6DA' },
        { offset: 1, color: '#4DD0E1' },
      ],
      rotation: 45,
    },
  },
  {
    id: 'rainbow-flow',
    name: 'Rainbow Flow',
    category: 'animated',
    foreground: '#FF6B6B',
    background: '#FFFFFF',
    pattern: 'extra-rounded',
    animated: true,
    premium: true,
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#FF6B6B' },
        { offset: 0.25, color: '#FFA726' },
        { offset: 0.5, color: '#66BB6A' },
        { offset: 0.75, color: '#42A5F5' },
        { offset: 1, color: '#AB47BC' },
      ],
      rotation: 0,
    },
  },

  // ===== PREMIUM TEMPLATES =====
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'premium',
    foreground: '#00E5FF',
    background: '#1a1a2e',
    pattern: 'dots',
    premium: true,
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#00E5FF' },
        { offset: 0.33, color: '#18FFFF' },
        { offset: 0.66, color: '#00BCD4' },
        { offset: 1, color: '#0097A7' },
      ],
      rotation: 45,
    },
  },
  {
    id: 'metallic-gold',
    name: 'Metallic Gold',
    category: 'premium',
    foreground: '#FFD700',
    background: '#1a1a1a',
    pattern: 'classy-rounded',
    premium: true,
    gradient: {
      type: 'radial',
      colorStops: [
        { offset: 0, color: '#FFD700' },
        { offset: 0.5, color: '#FFA000' },
        { offset: 1, color: '#FF6F00' },
      ],
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'premium',
    foreground: '#FF0080',
    background: '#0a0a0a',
    pattern: 'dots',
    premium: true,
    gradient: {
      type: 'linear',
      colorStops: [
        { offset: 0, color: '#FF0080' },
        { offset: 0.5, color: '#7928CA' },
        { offset: 1, color: '#00DFD8' },
      ],
      rotation: 135,
    },
  },
];

export const getTemplatesByCategory = (category: QRTemplate['category']) => {
  return QR_TEMPLATES.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return QR_TEMPLATES.find(t => t.id === id);
};

export const getAllTemplates = () => {
  return QR_TEMPLATES;
};

export const getFreeTemplates = () => {
  return QR_TEMPLATES.filter(t => !t.premium);
};

export const getPremiumTemplates = () => {
  return QR_TEMPLATES.filter(t => t.premium);
};
