import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointService } from '../../../core/services/breakpoint.service';
import { LayoutService } from '../../../core/services/layout.service';
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
  @Input() userName: string = '';

  private layoutService = inject(LayoutService);
  private breakpointService = inject(BreakpointService);

  isMobile = toSignal(this.breakpointService.isMobile$);
  isMenuOpen = this.layoutService.isMenuOpen;

  toggleMenu(): void {
    this.layoutService.toggleMenu();
  }

  closeMenu(): void {
    this.layoutService.closeMenu();
  }
}
