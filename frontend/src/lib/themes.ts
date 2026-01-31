// ═══════════════════════════════════════════════════════════════════════════
// ESHOPY - STORE LIBRARY WITH 15 UNIQUE THEMES
// ═══════════════════════════════════════════════════════════════════════════

import { 
  StoreTheme, 
  Category, 
  CategoryTreeNode, 
  StockStatus,
  NavigationItem,
  FooterConfig,
  Store
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// THEME 1: MODERN MINIMAL
// Clean white design with lots of whitespace
// ─────────────────────────────────────────────────────────────────────────────

export const themeModernMinimal: StoreTheme = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  colors: {
    primary: '#000000',
    primaryHover: '#1a1a1a',
    primaryLight: '#f5f5f5',
    secondary: '#6b7280',
    secondaryHover: '#4b5563',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    background: '#ffffff',
    backgroundAlt: '#fafafa',
    surface: '#ffffff',
    surfaceHover: '#f9fafb',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    text: '#111827',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1280px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.5rem',
    borderRadiusLg: '0.75rem',
    shadow: '0 1px 3px rgba(0,0,0,0.1)',
    shadowLg: '0 10px 40px rgba(0,0,0,0.1)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '72px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      shadow: '0 1px 3px rgba(0,0,0,0.05)',
      radius: '0.75rem',
      hoverShadow: '0 10px 40px rgba(0,0,0,0.1)',
    },
    button: {
      radius: '0.5rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.5rem',
      border: '1px solid #e5e7eb',
      background: '#ffffff',
      focusBorder: '#000000',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 2: LUXURY GOLD
// Dark premium design with gold accents
// ─────────────────────────────────────────────────────────────────────────────

export const themeLuxuryGold: StoreTheme = {
  id: 'luxury-gold',
  name: 'Luxury Gold',
  colors: {
    primary: '#d4af37',
    primaryHover: '#c5a028',
    primaryLight: '#f5e6b3',
    secondary: '#8b7355',
    secondaryHover: '#7a6448',
    accent: '#d4af37',
    accentHover: '#c5a028',
    background: '#0d0d0d',
    backgroundAlt: '#1a1a1a',
    surface: '#1f1f1f',
    surfaceHover: '#2a2a2a',
    border: '#333333',
    borderLight: '#404040',
    text: '#f5f5f5',
    textMuted: '#a0a0a0',
    textLight: '#707070',
    success: '#4ade80',
    successLight: '#166534',
    warning: '#fbbf24',
    warningLight: '#854d0e',
    error: '#f87171',
    errorLight: '#991b1b',
    info: '#60a5fa',
    infoLight: '#1e40af',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.625rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
  },
  layout: {
    maxWidth: '1400px',
    containerPadding: '2rem',
    sectionPadding: '5rem',
    borderRadius: '0.25rem',
    borderRadiusLg: '0.5rem',
    shadow: '0 4px 20px rgba(212,175,55,0.1)',
    shadowLg: '0 20px 60px rgba(212,175,55,0.15)',
    gridGap: '2rem',
  },
  components: {
    header: {
      height: '80px',
      background: '#0d0d0d',
      sticky: true,
      transparent: true,
    },
    card: {
      background: '#1f1f1f',
      border: '1px solid #333333',
      shadow: '0 4px 20px rgba(0,0,0,0.3)',
      radius: '0.25rem',
      hoverShadow: '0 8px 30px rgba(212,175,55,0.2)',
    },
    button: {
      radius: '0.25rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    input: {
      radius: '0.25rem',
      border: '1px solid #333333',
      background: '#1a1a1a',
      focusBorder: '#d4af37',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 3: FRESH GREEN
// Eco-friendly nature inspired design
// ─────────────────────────────────────────────────────────────────────────────

export const themeFreshGreen: StoreTheme = {
  id: 'fresh-green',
  name: 'Fresh Green',
  colors: {
    primary: '#16a34a',
    primaryHover: '#15803d',
    primaryLight: '#dcfce7',
    secondary: '#65a30d',
    secondaryHover: '#4d7c0f',
    accent: '#84cc16',
    accentHover: '#65a30d',
    background: '#f0fdf4',
    backgroundAlt: '#ecfdf5',
    surface: '#ffffff',
    surfaceHover: '#f0fdf4',
    border: '#bbf7d0',
    borderLight: '#dcfce7',
    text: '#14532d',
    textMuted: '#166534',
    textLight: '#4ade80',
    success: '#22c55e',
    successLight: '#bbf7d0',
    warning: '#eab308',
    warningLight: '#fef9c3',
    error: '#dc2626',
    errorLight: '#fecaca',
    info: '#0891b2',
    infoLight: '#cffafe',
  },
  fonts: {
    heading: "'Nunito', 'Segoe UI', sans-serif",
    body: "'Open Sans', 'Segoe UI', sans-serif",
    mono: "'Source Code Pro', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1240px',
    containerPadding: '1.5rem',
    sectionPadding: '3.5rem',
    borderRadius: '1rem',
    borderRadiusLg: '1.5rem',
    shadow: '0 4px 20px rgba(22,163,74,0.08)',
    shadowLg: '0 15px 50px rgba(22,163,74,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '70px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #bbf7d0',
      shadow: '0 2px 10px rgba(22,163,74,0.06)',
      radius: '1rem',
      hoverShadow: '0 10px 30px rgba(22,163,74,0.12)',
    },
    button: {
      radius: '0.75rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.75rem',
      border: '2px solid #bbf7d0',
      background: '#ffffff',
      focusBorder: '#16a34a',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 4: TECH BLUE
// Modern tech-focused blue design
// ─────────────────────────────────────────────────────────────────────────────

export const themeTechBlue: StoreTheme = {
  id: 'tech-blue',
  name: 'Tech Blue',
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#dbeafe',
    secondary: '#0ea5e9',
    secondaryHover: '#0284c7',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    background: '#f8fafc',
    backgroundAlt: '#f1f5f9',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#475569',
    textLight: '#94a3b8',
    success: '#22c55e',
    successLight: '#dcfce7',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  fonts: {
    heading: "'Poppins', -apple-system, sans-serif",
    body: "'IBM Plex Sans', -apple-system, sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  layout: {
    maxWidth: '1320px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.625rem',
    borderRadiusLg: '1rem',
    shadow: '0 4px 15px rgba(37,99,235,0.08)',
    shadowLg: '0 20px 50px rgba(37,99,235,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '68px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      shadow: '0 2px 8px rgba(37,99,235,0.04)',
      radius: '0.75rem',
      hoverShadow: '0 12px 35px rgba(37,99,235,0.1)',
    },
    button: {
      radius: '0.5rem',
      fontWeight: '600',
      transition: 'all 0.15s ease',
    },
    input: {
      radius: '0.5rem',
      border: '1px solid #cbd5e1',
      background: '#ffffff',
      focusBorder: '#2563eb',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 5: WARM TERRACOTTA
// Earthy warm colors design
// ─────────────────────────────────────────────────────────────────────────────

export const themeWarmTerracotta: StoreTheme = {
  id: 'warm-terracotta',
  name: 'Warm Terracotta',
  colors: {
    primary: '#c2410c',
    primaryHover: '#9a3412',
    primaryLight: '#ffedd5',
    secondary: '#b45309',
    secondaryHover: '#92400e',
    accent: '#ea580c',
    accentHover: '#c2410c',
    background: '#fffbeb',
    backgroundAlt: '#fef3c7',
    surface: '#ffffff',
    surfaceHover: '#fffbeb',
    border: '#fed7aa',
    borderLight: '#ffedd5',
    text: '#431407',
    textMuted: '#78350f',
    textLight: '#d97706',
    success: '#16a34a',
    successLight: '#dcfce7',
    warning: '#ca8a04',
    warningLight: '#fef9c3',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#0284c7',
    infoLight: '#e0f2fe',
  },
  fonts: {
    heading: "'Merriweather', Georgia, serif",
    body: "'Source Sans Pro', 'Segoe UI', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.75rem',
  },
  layout: {
    maxWidth: '1200px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.5rem',
    borderRadiusLg: '0.75rem',
    shadow: '0 4px 20px rgba(194,65,12,0.08)',
    shadowLg: '0 15px 45px rgba(194,65,12,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '74px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #fed7aa',
      shadow: '0 2px 10px rgba(194,65,12,0.05)',
      radius: '0.5rem',
      hoverShadow: '0 10px 35px rgba(194,65,12,0.1)',
    },
    button: {
      radius: '0.375rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.375rem',
      border: '2px solid #fed7aa',
      background: '#ffffff',
      focusBorder: '#c2410c',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 6: NORDIC CALM
// Scandinavian muted design
// ─────────────────────────────────────────────────────────────────────────────

export const themeNordicCalm: StoreTheme = {
  id: 'nordic-calm',
  name: 'Nordic Calm',
  colors: {
    primary: '#64748b',
    primaryHover: '#475569',
    primaryLight: '#f1f5f9',
    secondary: '#78716c',
    secondaryHover: '#57534e',
    accent: '#0d9488',
    accentHover: '#0f766e',
    background: '#fafaf9',
    backgroundAlt: '#f5f5f4',
    surface: '#ffffff',
    surfaceHover: '#fafaf9',
    border: '#d6d3d1',
    borderLight: '#e7e5e4',
    text: '#292524',
    textMuted: '#57534e',
    textLight: '#a8a29e',
    success: '#059669',
    successLight: '#d1fae5',
    warning: '#d97706',
    warningLight: '#fef3c7',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#0891b2',
    infoLight: '#cffafe',
  },
  fonts: {
    heading: "'DM Sans', 'Helvetica Neue', sans-serif",
    body: "'DM Sans', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '0.9375rem',
    lg: '1.0625rem',
    xl: '1.1875rem',
    '2xl': '1.4375rem',
    '3xl': '1.875rem',
    '4xl': '2.375rem',
  },
  layout: {
    maxWidth: '1180px',
    containerPadding: '2rem',
    sectionPadding: '5rem',
    borderRadius: '0.25rem',
    borderRadiusLg: '0.375rem',
    shadow: '0 1px 3px rgba(0,0,0,0.04)',
    shadowLg: '0 8px 30px rgba(0,0,0,0.06)',
    gridGap: '2rem',
  },
  components: {
    header: {
      height: '64px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e7e5e4',
      shadow: 'none',
      radius: '0.25rem',
      hoverShadow: '0 4px 20px rgba(0,0,0,0.04)',
    },
    button: {
      radius: '0.25rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
    },
    input: {
      radius: '0.25rem',
      border: '1px solid #d6d3d1',
      background: '#ffffff',
      focusBorder: '#64748b',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 7: ROSE BOUTIQUE
// Feminine pink tones design
// ─────────────────────────────────────────────────────────────────────────────

export const themeRoseBoutique: StoreTheme = {
  id: 'rose-boutique',
  name: 'Rose Boutique',
  colors: {
    primary: '#db2777',
    primaryHover: '#be185d',
    primaryLight: '#fce7f3',
    secondary: '#ec4899',
    secondaryHover: '#db2777',
    accent: '#f472b6',
    accentHover: '#ec4899',
    background: '#fdf2f8',
    backgroundAlt: '#fce7f3',
    surface: '#ffffff',
    surfaceHover: '#fdf2f8',
    border: '#f9a8d4',
    borderLight: '#fbcfe8',
    text: '#500724',
    textMuted: '#9d174d',
    textLight: '#ec4899',
    success: '#059669',
    successLight: '#d1fae5',
    warning: '#d97706',
    warningLight: '#fef3c7',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#7c3aed',
    infoLight: '#ede9fe',
  },
  fonts: {
    heading: "'Josefin Sans', 'Segoe UI', sans-serif",
    body: "'Quicksand', 'Segoe UI', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1200px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '1rem',
    borderRadiusLg: '1.5rem',
    shadow: '0 4px 20px rgba(219,39,119,0.08)',
    shadowLg: '0 15px 50px rgba(219,39,119,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '72px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #fbcfe8',
      shadow: '0 2px 10px rgba(219,39,119,0.04)',
      radius: '1rem',
      hoverShadow: '0 10px 35px rgba(219,39,119,0.1)',
    },
    button: {
      radius: '9999px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.75rem',
      border: '2px solid #fbcfe8',
      background: '#ffffff',
      focusBorder: '#db2777',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 8: OCEAN DEEP
// Deep blue marine design
// ─────────────────────────────────────────────────────────────────────────────

export const themeOceanDeep: StoreTheme = {
  id: 'ocean-deep',
  name: 'Ocean Deep',
  colors: {
    primary: '#0369a1',
    primaryHover: '#075985',
    primaryLight: '#e0f2fe',
    secondary: '#0284c7',
    secondaryHover: '#0369a1',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    background: '#f0f9ff',
    backgroundAlt: '#e0f2fe',
    surface: '#ffffff',
    surfaceHover: '#f0f9ff',
    border: '#7dd3fc',
    borderLight: '#bae6fd',
    text: '#082f49',
    textMuted: '#0c4a6e',
    textLight: '#0ea5e9',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#0ea5e9',
    infoLight: '#e0f2fe',
  },
  fonts: {
    heading: "'Montserrat', 'Helvetica Neue', sans-serif",
    body: "'Lato', 'Helvetica Neue', sans-serif",
    mono: "'Source Code Pro', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1280px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.75rem',
    borderRadiusLg: '1rem',
    shadow: '0 4px 20px rgba(3,105,161,0.08)',
    shadowLg: '0 20px 50px rgba(3,105,161,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '70px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #bae6fd',
      shadow: '0 2px 10px rgba(3,105,161,0.05)',
      radius: '0.75rem',
      hoverShadow: '0 10px 35px rgba(3,105,161,0.1)',
    },
    button: {
      radius: '0.5rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.5rem',
      border: '2px solid #bae6fd',
      background: '#ffffff',
      focusBorder: '#0369a1',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 9: VINTAGE RETRO
// Warm nostalgic design
// ─────────────────────────────────────────────────────────────────────────────

export const themeVintageRetro: StoreTheme = {
  id: 'vintage-retro',
  name: 'Vintage Retro',
  colors: {
    primary: '#92400e',
    primaryHover: '#78350f',
    primaryLight: '#fef3c7',
    secondary: '#a16207',
    secondaryHover: '#854d0e',
    accent: '#b45309',
    accentHover: '#92400e',
    background: '#fefce8',
    backgroundAlt: '#fef9c3',
    surface: '#fffbeb',
    surfaceHover: '#fef3c7',
    border: '#fcd34d',
    borderLight: '#fde68a',
    text: '#451a03',
    textMuted: '#78350f',
    textLight: '#b45309',
    success: '#15803d',
    successLight: '#dcfce7',
    warning: '#a16207',
    warningLight: '#fef3c7',
    error: '#b91c1c',
    errorLight: '#fee2e2',
    info: '#1d4ed8',
    infoLight: '#dbeafe',
  },
  fonts: {
    heading: "'Abril Fatface', Georgia, serif",
    body: "'Libre Baskerville', Georgia, serif",
    mono: "'Courier Prime', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.3125rem',
    '2xl': '1.625rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
  },
  layout: {
    maxWidth: '1100px',
    containerPadding: '2rem',
    sectionPadding: '4.5rem',
    borderRadius: '0.125rem',
    borderRadiusLg: '0.25rem',
    shadow: '3px 3px 0 rgba(146,64,14,0.2)',
    shadowLg: '6px 6px 0 rgba(146,64,14,0.15)',
    gridGap: '2rem',
  },
  components: {
    header: {
      height: '76px',
      background: '#fffbeb',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#fffbeb',
      border: '2px solid #92400e',
      shadow: '3px 3px 0 rgba(146,64,14,0.15)',
      radius: '0.125rem',
      hoverShadow: '5px 5px 0 rgba(146,64,14,0.2)',
    },
    button: {
      radius: '0.125rem',
      fontWeight: '600',
      transition: 'all 0.1s ease',
    },
    input: {
      radius: '0.125rem',
      border: '2px solid #92400e',
      background: '#fffbeb',
      focusBorder: '#78350f',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 10: NEON DARK
// Dark mode with neon accents
// ─────────────────────────────────────────────────────────────────────────────

export const themeNeonDark: StoreTheme = {
  id: 'neon-dark',
  name: 'Neon Dark',
  colors: {
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryLight: '#3b0764',
    secondary: '#ec4899',
    secondaryHover: '#db2777',
    accent: '#22d3ee',
    accentHover: '#06b6d4',
    background: '#09090b',
    backgroundAlt: '#18181b',
    surface: '#1f1f23',
    surfaceHover: '#27272a',
    border: '#3f3f46',
    borderLight: '#52525b',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    textLight: '#71717a',
    success: '#4ade80',
    successLight: '#14532d',
    warning: '#facc15',
    warningLight: '#713f12',
    error: '#f87171',
    errorLight: '#7f1d1d',
    info: '#38bdf8',
    infoLight: '#0c4a6e',
  },
  fonts: {
    heading: "'Space Grotesk', 'Helvetica Neue', sans-serif",
    body: "'Inter', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1320px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.75rem',
    borderRadiusLg: '1rem',
    shadow: '0 4px 30px rgba(168,85,247,0.15)',
    shadowLg: '0 20px 60px rgba(168,85,247,0.2)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '68px',
      background: '#09090b',
      sticky: true,
      transparent: true,
    },
    card: {
      background: '#1f1f23',
      border: '1px solid #3f3f46',
      shadow: '0 4px 20px rgba(0,0,0,0.4)',
      radius: '0.75rem',
      hoverShadow: '0 0 30px rgba(168,85,247,0.3)',
    },
    button: {
      radius: '0.5rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.5rem',
      border: '1px solid #3f3f46',
      background: '#18181b',
      focusBorder: '#a855f7',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 11: FOREST
// Deep green nature design
// ─────────────────────────────────────────────────────────────────────────────

export const themeForest: StoreTheme = {
  id: 'forest',
  name: 'Forest',
  colors: {
    primary: '#166534',
    primaryHover: '#14532d',
    primaryLight: '#dcfce7',
    secondary: '#15803d',
    secondaryHover: '#166534',
    accent: '#059669',
    accentHover: '#047857',
    background: '#f0fdf4',
    backgroundAlt: '#dcfce7',
    surface: '#ffffff',
    surfaceHover: '#f0fdf4',
    border: '#86efac',
    borderLight: '#bbf7d0',
    text: '#052e16',
    textMuted: '#166534',
    textLight: '#22c55e',
    success: '#22c55e',
    successLight: '#dcfce7',
    warning: '#ca8a04',
    warningLight: '#fef9c3',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#0369a1',
    infoLight: '#e0f2fe',
  },
  fonts: {
    heading: "'Bitter', Georgia, serif",
    body: "'Cabin', 'Segoe UI', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1220px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.5rem',
    borderRadiusLg: '0.75rem',
    shadow: '0 4px 20px rgba(22,101,52,0.08)',
    shadowLg: '0 15px 45px rgba(22,101,52,0.12)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '72px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #bbf7d0',
      shadow: '0 2px 10px rgba(22,101,52,0.05)',
      radius: '0.5rem',
      hoverShadow: '0 10px 35px rgba(22,101,52,0.1)',
    },
    button: {
      radius: '0.375rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.375rem',
      border: '2px solid #bbf7d0',
      background: '#ffffff',
      focusBorder: '#166534',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 12: SUNSET GLOW
// Orange/pink gradient design
// ─────────────────────────────────────────────────────────────────────────────

export const themeSunsetGlow: StoreTheme = {
  id: 'sunset-glow',
  name: 'Sunset Glow',
  colors: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#ffedd5',
    secondary: '#f43f5e',
    secondaryHover: '#e11d48',
    accent: '#fb923c',
    accentHover: '#f97316',
    background: '#fff7ed',
    backgroundAlt: '#ffedd5',
    surface: '#ffffff',
    surfaceHover: '#fff7ed',
    border: '#fed7aa',
    borderLight: '#ffedd5',
    text: '#431407',
    textMuted: '#9a3412',
    textLight: '#fb923c',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#0ea5e9',
    infoLight: '#e0f2fe',
  },
  fonts: {
    heading: "'Outfit', 'Helvetica Neue', sans-serif",
    body: "'Work Sans', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
  layout: {
    maxWidth: '1280px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '1rem',
    borderRadiusLg: '1.25rem',
    shadow: '0 4px 25px rgba(249,115,22,0.1)',
    shadowLg: '0 20px 50px rgba(249,115,22,0.15)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '70px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #fed7aa',
      shadow: '0 2px 15px rgba(249,115,22,0.06)',
      radius: '1rem',
      hoverShadow: '0 15px 40px rgba(249,115,22,0.12)',
    },
    button: {
      radius: '0.75rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    input: {
      radius: '0.75rem',
      border: '2px solid #fed7aa',
      background: '#ffffff',
      focusBorder: '#f97316',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 13: SLATE CORPORATE
// Professional business design
// ─────────────────────────────────────────────────────────────────────────────

export const themeSlateCorporate: StoreTheme = {
  id: 'slate-corporate',
  name: 'Slate Corporate',
  colors: {
    primary: '#334155',
    primaryHover: '#1e293b',
    primaryLight: '#f1f5f9',
    secondary: '#475569',
    secondaryHover: '#334155',
    accent: '#0284c7',
    accentHover: '#0369a1',
    background: '#f8fafc',
    backgroundAlt: '#f1f5f9',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#475569',
    textLight: '#94a3b8',
    success: '#059669',
    successLight: '#d1fae5',
    warning: '#d97706',
    warningLight: '#fef3c7',
    error: '#dc2626',
    errorLight: '#fee2e2',
    info: '#0284c7',
    infoLight: '#e0f2fe',
  },
  fonts: {
    heading: "'Plus Jakarta Sans', 'Helvetica Neue', sans-serif",
    body: "'Plus Jakarta Sans', 'Helvetica Neue', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.9375rem',
    lg: '1.0625rem',
    xl: '1.1875rem',
    '2xl': '1.4375rem',
    '3xl': '1.8125rem',
    '4xl': '2.25rem',
  },
  layout: {
    maxWidth: '1320px',
    containerPadding: '1.5rem',
    sectionPadding: '4rem',
    borderRadius: '0.375rem',
    borderRadiusLg: '0.5rem',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    shadowLg: '0 10px 40px rgba(0,0,0,0.08)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '64px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      shadow: '0 1px 3px rgba(0,0,0,0.05)',
      radius: '0.375rem',
      hoverShadow: '0 8px 25px rgba(0,0,0,0.08)',
    },
    button: {
      radius: '0.375rem',
      fontWeight: '500',
      transition: 'all 0.15s ease',
    },
    input: {
      radius: '0.375rem',
      border: '1px solid #cbd5e1',
      background: '#ffffff',
      focusBorder: '#334155',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 14: CANDY POP
// Playful colorful design
// ─────────────────────────────────────────────────────────────────────────────

export const themeCandyPop: StoreTheme = {
  id: 'candy-pop',
  name: 'Candy Pop',
  colors: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#ede9fe',
    secondary: '#ec4899',
    secondaryHover: '#db2777',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    background: '#faf5ff',
    backgroundAlt: '#f3e8ff',
    surface: '#ffffff',
    surfaceHover: '#faf5ff',
    border: '#c4b5fd',
    borderLight: '#ddd6fe',
    text: '#2e1065',
    textMuted: '#6b21a8',
    textLight: '#a78bfa',
    success: '#22c55e',
    successLight: '#dcfce7',
    warning: '#fbbf24',
    warningLight: '#fef3c7',
    error: '#f43f5e',
    errorLight: '#ffe4e6',
    info: '#06b6d4',
    infoLight: '#cffafe',
  },
  fonts: {
    heading: "'Baloo 2', 'Comic Sans MS', cursive",
    body: "'Nunito', 'Trebuchet MS', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.3125rem',
    '2xl': '1.625rem',
    '3xl': '2.125rem',
    '4xl': '2.75rem',
  },
  layout: {
    maxWidth: '1240px',
    containerPadding: '1.5rem',
    sectionPadding: '3.5rem',
    borderRadius: '1.5rem',
    borderRadiusLg: '2rem',
    shadow: '0 4px 20px rgba(139,92,246,0.12)',
    shadowLg: '0 20px 50px rgba(139,92,246,0.18)',
    gridGap: '1.5rem',
  },
  components: {
    header: {
      height: '72px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '2px solid #ddd6fe',
      shadow: '0 4px 15px rgba(139,92,246,0.08)',
      radius: '1.5rem',
      hoverShadow: '0 15px 40px rgba(139,92,246,0.15)',
    },
    button: {
      radius: '9999px',
      fontWeight: '700',
      transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    input: {
      radius: '1rem',
      border: '2px solid #ddd6fe',
      background: '#ffffff',
      focusBorder: '#8b5cf6',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME 15: MONO
// Pure black and white design
// ─────────────────────────────────────────────────────────────────────────────

export const themeMono: StoreTheme = {
  id: 'mono',
  name: 'Mono',
  colors: {
    primary: '#000000',
    primaryHover: '#262626',
    primaryLight: '#f5f5f5',
    secondary: '#404040',
    secondaryHover: '#262626',
    accent: '#000000',
    accentHover: '#262626',
    background: '#ffffff',
    backgroundAlt: '#fafafa',
    surface: '#ffffff',
    surfaceHover: '#f5f5f5',
    border: '#e5e5e5',
    borderLight: '#f5f5f5',
    text: '#000000',
    textMuted: '#525252',
    textLight: '#a3a3a3',
    success: '#000000',
    successLight: '#f5f5f5',
    warning: '#000000',
    warningLight: '#f5f5f5',
    error: '#000000',
    errorLight: '#f5f5f5',
    info: '#000000',
    infoLight: '#f5f5f5',
  },
  fonts: {
    heading: "'Instrument Serif', Georgia, serif",
    body: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '3rem',
  },
  layout: {
    maxWidth: '1100px',
    containerPadding: '2rem',
    sectionPadding: '5rem',
    borderRadius: '0',
    borderRadiusLg: '0',
    shadow: 'none',
    shadowLg: 'none',
    gridGap: '2rem',
  },
  components: {
    header: {
      height: '64px',
      background: '#ffffff',
      sticky: true,
      transparent: false,
    },
    card: {
      background: '#ffffff',
      border: '1px solid #000000',
      shadow: 'none',
      radius: '0',
      hoverShadow: 'none',
    },
    button: {
      radius: '0',
      fontWeight: '500',
      transition: 'all 0.1s ease',
    },
    input: {
      radius: '0',
      border: '1px solid #000000',
      background: '#ffffff',
      focusBorder: '#000000',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ALL THEMES ARRAY
// ─────────────────────────────────────────────────────────────────────────────

export const allThemes: StoreTheme[] = [
  themeModernMinimal,
  themeLuxuryGold,
  themeFreshGreen,
  themeTechBlue,
  themeWarmTerracotta,
  themeNordicCalm,
  themeRoseBoutique,
  themeOceanDeep,
  themeVintageRetro,
  themeNeonDark,
  themeForest,
  themeSunsetGlow,
  themeSlateCorporate,
  themeCandyPop,
  themeMono,
];

export const getThemeById = (id: string): StoreTheme => {
  return allThemes.find(t => t.id === id) || themeModernMinimal;
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const formatPrice = (
  price: number, 
  currency: string = 'EUR', 
  locale: string = 'sk-SK'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (
  date: string | Date, 
  locale: string = 'sk-SK',
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (
  date: string | Date,
  locale: string = 'sk-SK'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

export const getDiscountPercentage = (price: number, originalPrice: number): number => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export const getStockLabel = (stock: StockStatus): { label: string; color: string } => {
  const labels: Record<StockStatus, { label: string; color: string }> = {
    in_stock: { label: 'Skladom', color: 'green' },
    low_stock: { label: 'Posledné kusy', color: 'orange' },
    out_of_stock: { label: 'Nedostupné', color: 'red' },
    preorder: { label: 'Predobjednávka', color: 'blue' },
    unknown: { label: 'Neznámy stav', color: 'gray' },
  };
  return labels[stock] || labels.unknown;
};

export const getStockIcon = (stock: StockStatus): string => {
  const icons: Record<StockStatus, string> = {
    in_stock: '✓',
    low_stock: '!',
    out_of_stock: '✕',
    preorder: '📦',
    unknown: '?',
  };
  return icons[stock] || icons.unknown;
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY TREE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const buildCategoryTree = (
  categories: Category[], 
  parentId: string | null = null
): CategoryTreeNode[] => {
  return categories
    .filter(cat => cat.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id),
      isExpanded: false,
      isSelected: false,
    }));
};

export const flattenCategoryTree = (
  tree: CategoryTreeNode[], 
  depth: number = 0
): (CategoryTreeNode & { depth: number })[] => {
  let result: (CategoryTreeNode & { depth: number })[] = [];
  
  for (const node of tree) {
    result.push({ ...node, depth });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenCategoryTree(node.children, depth + 1));
    }
  }
  
  return result;
};

export const getCategoryPath = (
  categories: Category[], 
  categoryId: string
): Category[] => {
  const path: Category[] = [];
  let current = categories.find(c => c.id === categoryId);
  
  while (current) {
    path.unshift(current);
    current = current.parentId 
      ? categories.find(c => c.id === current!.parentId) 
      : undefined;
  }
  
  return path;
};

export const countCategoryChildren = (
  categories: Category[], 
  parentId: string
): number => {
  const directChildren = categories.filter(c => c.parentId === parentId);
  let count = directChildren.length;
  
  for (const child of directChildren) {
    count += countCategoryChildren(categories, child.id);
  }
  
  return count;
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const getPlaceholderImage = (
  width: number = 400, 
  height: number = 400,
  text?: string
): string => {
  const bg = 'f3f4f6';
  const color = '9ca3af';
  const label = text || `${width}x${height}`;
  return `https://via.placeholder.com/${width}x${height}/${bg}/${color}?text=${encodeURIComponent(label)}`;
};

export const getProductPlaceholder = (): string => {
  return getPlaceholderImage(400, 400, 'Produkt');
};

export const getCategoryPlaceholder = (): string => {
  return getPlaceholderImage(300, 200, 'Kategória');
};

// ─────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export const generateCssVariables = (theme: StoreTheme): string => {
  const vars: string[] = [];
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars.push(`--color-${cssKey}: ${value};`);
  });
  
  // Fonts
  vars.push(`--font-heading: ${theme.fonts.heading};`);
  vars.push(`--font-body: ${theme.fonts.body};`);
  vars.push(`--font-mono: ${theme.fonts.mono};`);
  
  // Font sizes
  Object.entries(theme.fontSizes).forEach(([key, value]) => {
    vars.push(`--font-size-${key}: ${value};`);
  });
  
  // Layout
  Object.entries(theme.layout).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars.push(`--layout-${cssKey}: ${value};`);
  });
  
  // Components
  vars.push(`--header-height: ${theme.components.header.height};`);
  vars.push(`--card-radius: ${theme.components.card.radius};`);
  vars.push(`--button-radius: ${theme.components.button.radius};`);
  vars.push(`--input-radius: ${theme.components.input.radius};`);
  
  return `:root {\n  ${vars.join('\n  ')}\n}`;
};

export const applyThemeToDocument = (theme: StoreTheme): void => {
  if (typeof document === 'undefined') return;
  
  const style = document.getElementById('theme-variables') || document.createElement('style');
  style.id = 'theme-variables';
  style.textContent = generateCssVariables(theme);
  
  if (!document.getElementById('theme-variables')) {
    document.head.appendChild(style);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

export const fetchApi = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      return { error: error.message || `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const defaultNavigation: NavigationItem[] = [
  { id: '1', label: 'Domov', url: '/', type: 'link', order: 1, isActive: true },
  { id: '2', label: 'Produkty', url: '/produkty', type: 'link', order: 2, isActive: true },
  { id: '3', label: 'Kategórie', type: 'megamenu', order: 3, isActive: true, children: [] },
  { id: '4', label: 'Akcie', url: '/akcie', type: 'link', order: 4, isActive: true },
  { id: '5', label: 'Kontakt', url: '/kontakt', type: 'link', order: 5, isActive: true },
];

export const defaultFooter: FooterConfig = {
  columns: [
    {
      id: '1',
      title: 'Informácie',
      type: 'links',
      links: [
        { label: 'O nás', url: '/o-nas' },
        { label: 'Kontakt', url: '/kontakt' },
        { label: 'Obchodné podmienky', url: '/obchodne-podmienky' },
        { label: 'Ochrana osobných údajov', url: '/gdpr' },
      ],
    },
    {
      id: '2',
      title: 'Nákup',
      type: 'links',
      links: [
        { label: 'Doprava a platba', url: '/doprava-platba' },
        { label: 'Vrátenie tovaru', url: '/vratenie-tovaru' },
        { label: 'Reklamácie', url: '/reklamacie' },
        { label: 'FAQ', url: '/faq' },
      ],
    },
    {
      id: '3',
      title: 'Kontakt',
      type: 'contact',
      content: 'info@eshopy.sk\n+421 123 456 789',
    },
  ],
  copyright: '© 2025 ESHOPY. Všetky práva vyhradené.',
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
  showNewsletter: true,
};

export const defaultStoreSettings = {
  currency: 'EUR',
  currencySymbol: '€',
  currencyPosition: 'after' as const,
  language: 'sk',
  timezone: 'Europe/Bratislava',
  dateFormat: 'DD.MM.YYYY',
  priceDecimals: 2,
  showStock: true,
  showCompare: true,
  showWishlist: true,
  showRatings: true,
  productsPerPage: 24,
  enableReviews: true,
  enableQuestions: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// RATING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const getRatingStars = (rating: number): { full: number; half: boolean; empty: number } => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Vynikajúce';
  if (rating >= 4) return 'Veľmi dobré';
  if (rating >= 3.5) return 'Dobré';
  if (rating >= 3) return 'Priemerné';
  if (rating >= 2) return 'Slabé';
  return 'Nedostatočné';
};

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & SORT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Cena: od najnižšej' },
  { value: 'price_desc', label: 'Cena: od najvyššej' },
  { value: 'name_asc', label: 'Názov: A-Z' },
  { value: 'name_desc', label: 'Názov: Z-A' },
  { value: 'rating', label: 'Hodnotenie' },
  { value: 'newest', label: 'Najnovšie' },
  { value: 'popularity', label: 'Najpredávanejšie' },
];

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
