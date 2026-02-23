import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: 'img[appResponsiveImage]',
  standalone: true,
})
export class ResponsiveImageDirective implements OnInit {
  @Input() alt: string = '';

  private el = inject(ElementRef<HTMLImageElement>);

  ngOnInit(): void {
    const img = this.el.nativeElement;

    // Configurar lazy loading
    img.loading = 'lazy';

    // Configurar estilos responsivos
    img.classList.add('max-w-full', 'h-auto', 'block');

    // Configurar alt text si no existe
    if (this.alt && !img.alt) {
      img.alt = this.alt;
    }
  }
}
