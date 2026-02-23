import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appTouchTarget]',
  standalone: true,
})
export class TouchTargetDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);
  private breakpointService = inject(BreakpointService);

  ngOnInit(): void {
    this.breakpointService.breakpointState$.pipe(takeUntilDestroyed()).subscribe((state) => {
      const element = this.el.nativeElement;
      if (state.isMobile || state.isTablet) {
        element.style.minWidth = '44px';
        element.style.minHeight = '44px';
        element.classList.add('touch-manipulation');
      } else {
        element.style.minWidth = '';
        element.style.minHeight = '';
        element.classList.remove('touch-manipulation');
      }
    });
  }
}
