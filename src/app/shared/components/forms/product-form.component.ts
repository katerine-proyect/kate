import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isEditMode = false;
  @Output() onSubmit = new EventEmitter<Partial<Product>>();
  @Output() onCancel = new EventEmitter<void>();

  private categoryService = inject(CategoryService);

  form!: FormGroup;
  isSubmitting = signal(false);
  categories = signal<Category[]>([]);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data.filter(c => c.activo));
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nombre: [this.product?.nombre || '', [Validators.required, Validators.minLength(3)]],
      descripcion: [this.product?.descripcion || '', Validators.maxLength(500)],
      precio: [this.product?.precio || '', [Validators.required, Validators.min(0.01)]],
      stock_actual: [this.product?.stock_actual || 0, [Validators.required, Validators.min(0)]],
      categoria_id: [this.product?.categoria_id || '', Validators.required],
      lleva_inventario: [this.product?.lleva_inventario || true]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.form.value;
    this.onSubmit.emit(formData);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (control.errors['minLength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minLength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) {
      return `${this.getFieldLabel(fieldName)} debe ser mayor a ${control.errors['min'].min}`;
    }
    if (control.errors['maxLength']) {
      return `${this.getFieldLabel(fieldName)} no puede exceder ${control.errors['maxLength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      precio: 'Precio',
      stock_actual: 'Stock',
      categoria_id: 'Categoría'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
