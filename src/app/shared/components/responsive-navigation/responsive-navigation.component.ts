import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointService } from '../../../core/services/breakpoint.service';
import { NavigationItem } from '../../../core/models/responsive.models';

@Component({
  selector: 'app-responsive-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './responsive-navigation.component.html',
  styleUrl: './responsive-navigation.component.css',
})
export class ResponsiveNavigationComponent {
  @Input() items: NavigationItem[] = [];

  private breakpointService = inject(BreakpointService);

  isMobile = toSignal(this.breakpointService.isMobile$);
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
