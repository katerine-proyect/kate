import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-responsive-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="cardClasses()" class="transition-all duration-300 overflow-hidden">
      <ng-content></ng-content>
    </div>
  `,
})
export class ResponsiveCardComponent {
  @Input() variant: 'default' | 'elevated' = 'default';

  private breakpointService = inject(BreakpointService);
  breakpoint = toSignal(this.breakpointService.breakpointState$);

  cardClasses = computed(() => {
    const bp = this.breakpoint();
    return {
      'bg-white dark:bg-gray-800': true,
      'border border-gray-200 dark:border-gray-700': this.variant === 'default',
      'shadow-md hover:shadow-lg': this.variant === 'elevated',
      'p-4': bp?.isMobile,
      'p-6': bp?.isTablet || bp?.isDesktop,
      'rounded-lg': true,
      'text-gray-900 dark:text-gray-100': true,
    };
  });
}
