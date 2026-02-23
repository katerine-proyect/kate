import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../core/services/theme.service';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="flex items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      [ngClass]="buttonClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      @if (isDarkTheme()) {
        <span class="text-xl" aria-hidden="true">🌙</span>
      } @else {
        <span class="text-xl" aria-hidden="true">☀️</span>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  private breakpointService = inject(BreakpointService);

  currentTheme = toSignal(this.themeService.currentTheme$);
  isMobile = toSignal(this.breakpointService.isMobile$);

  isDarkTheme = computed(() => this.currentTheme() === 'dark');

  ariaLabel = computed(() => `Switch to ${this.isDarkTheme() ? 'light' : 'dark'} theme`);

  buttonClasses = computed(() => {
    return {
      'w-11 h-11': this.isMobile() || this.breakpointService.getCurrentBreakpoint().isTablet,
      'w-10 h-10': this.breakpointService.getCurrentBreakpoint().isDesktop,
      'bg-gray-200 dark:bg-gray-700': true,
      'hover:bg-gray-300 dark:hover:bg-gray-600': true,
    };
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
