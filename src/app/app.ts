import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResponsiveNavigationComponent } from './shared/components/responsive-navigation/responsive-navigation.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { ResponsiveContainerComponent } from './shared/components/responsive-container/responsive-container.component';
import { NavigationItem } from './core/models/responsive.models';
import { AuthService } from './core/services/auth.service';
import { BreakpointService } from './core/services/breakpoint.service';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ResponsiveNavigationComponent,
    ThemeToggleComponent,
    ResponsiveContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  private breakpointService = inject(BreakpointService);
  public layoutService = inject(LayoutService);
  
  protected readonly title = signal('kate');
  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly isMenuOpen = this.layoutService.isMenuOpen;
  protected readonly isMobile = toSignal(this.breakpointService.isMobile$);
  protected readonly userName = computed(() => this.authService.currentUser()?.username ?? '');

  protected readonly navItems: NavigationItem[] = [
    { label: 'Productos', route: '/products' },
    { label: 'Categorías', route: '/categories' },
    { label: 'Ventas', route: '/sales' },
    { label: 'Clientes', route: '/clients' },
    { label: 'Usuarios', route: '/users' },
  ];
}
