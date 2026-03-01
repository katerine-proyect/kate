import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isMenuOpen = signal(true); // Abierto por defecto en desktop

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  openMenu(): void {
    this.isMenuOpen.set(true);
  }
}
