import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-responsive-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="gridClasses()" class="grid transition-all duration-300">
      <ng-content></ng-content>
    </div>
  `,
})
export class ResponsiveGridComponent {
  @Input() mobileColumns: number = 1;
  @Input() tabletColumns: number = 2;
  @Input() desktopColumns: number = 4;

  private breakpointService = inject(BreakpointService);
  breakpoint = toSignal(this.breakpointService.breakpointState$);

  gridClasses = computed(() => {
    const bp = this.breakpoint();
    let cols = this.mobileColumns;

    if (bp?.isTablet) cols = this.tabletColumns;
    if (bp?.isDesktop) cols = this.desktopColumns;

    return {
      [`grid-cols-${cols}`]: true,
      'gap-4': bp?.isMobile,
      'gap-6': bp?.isTablet || bp?.isDesktop,
    };
  });
}
