import { Breakpoint, ThemeConfig, TypographyScale } from './responsive.models';

export const BREAKPOINTS: Record<string, Breakpoint> = {
  mobile: {
    name: 'mobile',
    minWidth: 320,
    maxWidth: 767,
  },
  tablet: {
    name: 'tablet',
    minWidth: 768,
    maxWidth: 1023,
  },
  desktop: {
    name: 'desktop',
    minWidth: 1024,
    maxWidth: null,
  },
};

export const LIGHT_THEME: ThemeConfig = {
  name: 'light',
  colors: {
    primary: '#4f46e5', // Indigo-600 (more vibrant)
    secondary: '#d946ef', // Fuchsia-500 (electric accent)
    background: '#f8fafc', // Slate-50 (softer, cool off-white)
    surface: '#ffffff', // white (stands out against background)
    text: {
      primary: '#0f172a', // Slate-900 (stronger contrast)
      secondary: '#64748b', // Slate-500 (subtle contrast)
    },
    border: '#e2e8f0', // Slate-200 (cleaner look)
    success: '#10b981', // Emerald-500
    warning: '#f59e0b', // Amber-500
    error: '#f43f5e', // Rose-500
    info: '#0ea5e9', // Sky-500
  },
};

export const DARK_THEME: ThemeConfig = {
  name: 'dark',
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    background: '#111827', // gray-900
    surface: '#1f2937', // gray-800
    text: {
      primary: '#f9fafb', // gray-50
      secondary: '#9ca3af', // gray-400
    },
    border: '#374151', // gray-700
    success: '#10b981', // green-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  },
};

export const TYPOGRAPHY_MOBILE: TypographyScale = {
  base: '14px',
  h1: '28px',
  h2: '24px',
  h3: '20px',
  h4: '18px',
  h5: '16px',
  h6: '14px',
  small: '12px',
};

export const TYPOGRAPHY_DESKTOP: TypographyScale = {
  base: '16px',
  h1: '36px',
  h2: '30px',
  h3: '24px',
  h4: '20px',
  h5: '18px',
  h6: '16px',
  small: '14px',
};

export const STORAGE_KEYS = {
  THEME_PREFERENCE: 'kate-theme-preference',
  MENU_STATE: 'kate-menu-state',
  AUTH_KEY: 'kate-auth-session',
} as const;
