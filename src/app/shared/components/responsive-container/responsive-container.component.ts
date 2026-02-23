import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-responsive-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="containerClasses()"
      [style.max-width]="maxWidth()"
      class="mx-auto w-full flex-1 flex flex-col transition-all duration-300"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class ResponsiveContainerComponent {
  private breakpointService = inject(BreakpointService);

  breakpoint = toSignal(this.breakpointService.breakpointState$);

  containerClasses = computed(() => {
    const bp = this.breakpoint();
    return {
      'px-4': bp?.isMobile,
      'px-6': bp?.isTablet,
      'px-8': bp?.isDesktop,
    };
  });

  maxWidth = computed(() => {
    return this.breakpoint()?.isDesktop ? '1280px' : '100%';
  });
}
