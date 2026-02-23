import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme, ThemeConfig } from '../models/responsive.models';
import { DARK_THEME, LIGHT_THEME, STORAGE_KEYS } from '../models/constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;

  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  readonly currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.applyThemeStyles(theme);
    this.saveThemePreference(theme);
  }

  toggleTheme(): void {
    const nextTheme = this.getCurrentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.getValue();
  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE) as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.setTheme(savedTheme);
    } else {
      // Default theme
      this.setTheme('light');
    }

    // Listen to changes in other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.THEME_PREFERENCE) {
        const newTheme = event.newValue as Theme;
        if (newTheme === 'light' || newTheme === 'dark') {
          this.setTheme(newTheme);
        }
      }
    });
  }

  private applyThemeStyles(theme: Theme): void {
    const config = theme === 'light' ? LIGHT_THEME : DARK_THEME;
    const root = document.documentElement;

    // Apply CSS Variables directly to root element
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-background', config.colors.background);
    root.style.setProperty('--color-surface', config.colors.surface);
    root.style.setProperty('--color-text-primary', config.colors.text.primary);
    root.style.setProperty('--color-text-secondary', config.colors.text.secondary);
    root.style.setProperty('--color-border', config.colors.border);
    root.style.setProperty('--color-success', config.colors.success);
    root.style.setProperty('--color-warning', config.colors.warning);
    root.style.setProperty('--color-error', config.colors.error);
    root.style.setProperty('--color-info', config.colors.info);

    // Apply native color-scheme and dark class
    root.style.setProperty('color-scheme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  }
}
