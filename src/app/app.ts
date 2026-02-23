import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ResponsiveNavigationComponent } from './shared/components/responsive-navigation/responsive-navigation.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { ResponsiveContainerComponent } from './shared/components/responsive-container/responsive-container.component';
import { NavigationItem } from './core/models/responsive.models';
import { AuthService } from './core/services/auth.service';

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
  
  protected readonly title = signal('kate');
  protected readonly isLoggedIn = this.authService.isLoggedIn;

  protected readonly navItems: NavigationItem[] = [
    { label: 'Productos', route: '/products' },
    { label: 'Ventas', route: '/sales' },
    { label: 'Clientes', route: '/clients' },
    { label: 'Usuarios', route: '/users' },
  ];
}
