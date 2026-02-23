export interface Breakpoint {
  name: 'mobile' | 'tablet' | 'desktop';
  minWidth: number;
  maxWidth: number | null;
}

export interface BreakpointState {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  name: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
    };
    border: string;
    // States
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface TypographyScale {
  base: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  small: string;
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
}
