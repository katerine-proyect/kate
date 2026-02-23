import { Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Breakpoint, BreakpointState } from '../models/responsive.models';
import { BREAKPOINTS } from '../models/constants';

@Injectable({ providedIn: 'root' })
export class BreakpointService implements OnDestroy {
  private breakpointStateSubject = new BehaviorSubject<BreakpointState>(this.calculateState());
  readonly breakpointState$ = this.breakpointStateSubject.asObservable();

  readonly isMobile$ = this.breakpointState$.pipe(
    map((state) => state.isMobile),
    distinctUntilChanged(),
  );

  readonly isTablet$ = this.breakpointState$.pipe(
    map((state) => state.isTablet),
    distinctUntilChanged(),
  );

  readonly isDesktop$ = this.breakpointState$.pipe(
    map((state) => state.isDesktop),
    distinctUntilChanged(),
  );

  private resizeSubscription = fromEvent(window, 'resize')
    .pipe(
      debounceTime(150),
      map(() => this.calculateState()),
      distinctUntilChanged(
        (prev, curr) => prev.width === curr.width && prev.height === curr.height,
      ),
    )
    .subscribe((state) => this.breakpointStateSubject.next(state));

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  getCurrentBreakpoint(): BreakpointState {
    return this.breakpointStateSubject.getValue();
  }

  matchesBreakpoint(width: number, breakpointName: Breakpoint['name']): boolean {
    const bp = BREAKPOINTS[breakpointName];
    if (!bp) return false;

    if (bp.maxWidth === null) {
      return width >= bp.minWidth;
    }
    return width >= bp.minWidth && width <= bp.maxWidth;
  }

  private calculateState(): BreakpointState {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';

    let current: Breakpoint = BREAKPOINTS['mobile'];
    if (width >= BREAKPOINTS['desktop'].minWidth) {
      current = BREAKPOINTS['desktop'];
    } else if (width >= BREAKPOINTS['tablet'].minWidth) {
      current = BREAKPOINTS['tablet'];
    }

    return {
      current,
      isMobile: current.name === 'mobile',
      isTablet: current.name === 'tablet',
      isDesktop: current.name === 'desktop',
      width,
      height,
      orientation,
    };
  }
}
